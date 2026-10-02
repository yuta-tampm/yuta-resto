"""YUTA-owned archive-as-data and guarded Windows placement controls.

No network client, package manager, archive extraction API or installer execution.
Private mechanics are tested with inert archives; production entrypoints pin the
reviewed record. Trust boundary: the repository and workstation owner/admin.
"""

from __future__ import annotations

import argparse
import base64
import contextlib
import ctypes
from ctypes import wintypes as wt
import gzip
import hashlib
import io
import json
import os
from pathlib import Path
import re
import sys
import subprocess
import uuid


ACCEPTED = "ACCEPTED_FOR_EXACT_ARTIFACT_AND_BOUNDED_USE"
RECORD_DIGEST = "00a9c767cf1023526f17ed6ed31e6d73cd97fb478619626d56352e1642198a02"
TARGET = Path(".agents/skills/ui-ux-pro-max")
STAGING = Path(".yuta-tooling/ui-ux-pro-max")
RECORD = Path("tooling/ui-ux-pro-max/artifact.json")
CHECKS = frozenset({*(f"M{i:02}" for i in range(1, 12)), "M13", "PRE_COMPLETION_INTEGRITY"})
PREPLACEMENT = frozenset(f"M{i:02}" for i in range(1, 11))
RESERVED = re.compile(r"^(CON|PRN|AUX|NUL|CLOCK\$|CONIN\$|CONOUT\$|COM[1-9¹²³]|LPT[1-9¹²³])(?:\.|$)", re.I)


class Blocked(RuntimeError):
    """A fail-closed decision; never permission to repair an unknown path."""


def require(condition, reason):
    if not condition:
        raise Blocked(reason)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()


def decode_json(data):
    def unique(pairs):
        result = {}
        for key, value in pairs:
            require(key not in result, "DUPLICATE_JSON_KEY")
            result[key] = value
        return result
    try:
        return json.loads(data, object_pairs_hook=unique,
                          parse_constant=lambda _: (_ for _ in ()).throw(Blocked("NONFINITE_JSON")))
    except (ValueError, UnicodeError) as exc:
        raise Blocked("INVALID_JSON") from exc


def safe_name(name):
    require(isinstance(name, str) and 0 < len(name) < 240, "INVALID_PATH")
    require(not any(ord(ch) < 32 for ch in name), "CONTROL_OR_NUL_PATH")
    require(not any(ch in name for ch in '\\:<>"|?*'), "WINDOWS_PATH")
    parts = name.split("/")
    require(all(p and p not in (".", "..") and not p.endswith((".", " "))
                and not RESERVED.match(p) for p in parts), "UNSAFE_SEGMENT")
    return parts


def ancestors(names):
    return {"/".join(name.split("/")[:n]) for name in names
            for n in range(1, len(name.split("/")))}


def validate_record(record):
    # Exact canonical object pins schema, keys, types, acceptance, inventory and
    # projection together. Labels/counts cannot substitute for reviewed hashes.
    require(isinstance(record, dict) and sha(canonical(record)) == RECORD_DIGEST,
            "BLOCKED_LICENSE_OR_RECORD_DRIFT")
    require(record["licenseProvenance"] == ACCEPTED, "BLOCKED_LICENSE")
    return record


def _archive(data, inventory, compressed_bytes, regular_bytes, expected_sha, sri):
    """Pure parser shared by the pinned entrypoint and inert synthetic tests."""
    require(isinstance(data, bytes) and len(data) == compressed_bytes, "COMPRESSED_SIZE")
    require(sha(data) == expected_sha, "WRONG_SHA")
    actual_sri = "sha512-" + base64.b64encode(hashlib.sha512(data).digest()).decode()
    require(actual_sri == sri, "WRONG_SRI")
    require(len(inventory) == 196, "INVENTORY_COUNT")
    expected = {row["path"]: row for row in inventory}
    require(len(expected) == 196, "INVENTORY_DUPLICATE")
    for name in expected:
        safe_name(name)
    require(len({p.casefold() for p in expected}) == 196, "INVENTORY_CASE_COLLISION")
    allowed_dirs = ancestors(expected)
    # Bounded decompression, including worst-case padding/header allowance and
    # explicit directory ancestors. No unbounded gzip.decompress/tar extraction.
    maximum = regular_bytes + (196 + len(allowed_dirs)) * 1024 + 10240
    try:
        with gzip.GzipFile(fileobj=io.BytesIO(data)) as source:
            raw = source.read(maximum + 1)
        require(len(raw) <= maximum, "DECOMPRESSION_BOUND")
    except (OSError, EOFError) as exc:
        raise Blocked("INVALID_GZIP") from exc

    def text_field(field):
        first, sep, tail = field.partition(b"\0")
        require(not sep or not any(tail), "EMBEDDED_NUL")
        try:
            return first.decode("utf-8", "strict")
        except UnicodeError as exc:
            raise Blocked("HEADER_ENCODING") from exc

    def octal(field):
        value = field.strip(b"\0 ")
        require(bool(re.fullmatch(b"[0-7]+", value)), "UNSUPPORTED_NUMERIC_HEADER")
        return int(value, 8)

    pos, seen, folded, files, total = 0, set(), set(), {}, 0
    while True:
        require(pos + 512 <= len(raw), "TRUNCATED_HEADER")
        header = raw[pos:pos + 512]
        if not any(header):
            require(pos + 1024 <= len(raw) and not any(raw[pos:]), "TAR_TERMINATOR")
            break
        require(header[257:263] == b"ustar\0" and header[263:265] == b"00", "UNSUPPORTED_HEADER")
        require(octal(header[148:156]) == sum(header[:148]) + 256 + sum(header[156:]),
                "HEADER_CHECKSUM")
        kind = header[156:157]
        require(kind in (b"0", b"\0", b"5"), "UNSUPPORTED_TYPE_LINK_PAX_SPARSE")
        require(not any(header[157:257]), "LINK_NAME")
        prefix, name = text_field(header[345:500]), text_field(header[:100])
        name = prefix + "/" + name if prefix else name
        if kind == b"5" and name.endswith("/"):
            name = name[:-1]
        safe_name(name)
        require(name not in seen and name.casefold() not in folded, "DUPLICATE_OR_CASE_COLLISION")
        seen.add(name)
        folded.add(name.casefold())
        size = octal(header[124:136])
        pos += 512
        require(size <= regular_bytes and pos + size <= len(raw), "ENTRY_BOUND")
        content = raw[pos:pos + size]
        padded = ((size + 511) // 512) * 512
        require(pos + padded <= len(raw) and not any(raw[pos + size:pos + padded]), "ENTRY_PADDING")
        pos += padded
        if kind == b"5":
            require(size == 0 and name in allowed_dirs, "UNEXPECTED_DIRECTORY")
        else:
            require(name in expected, "UNEXPECTED_ENTRY")
            row = expected[name]
            require(size == row["size"] and sha(content) == row["sha256"], "ENTRY_HASH_OR_SIZE")
            files[name] = content
            total += size
            require(total <= regular_bytes and len(files) <= 196, "ARCHIVE_BOUND")
    require(set(files) == set(expected) and total == regular_bytes, "INVENTORY_MISMATCH")
    return files


def verify_archive(data, record):
    validate_record(record)
    return _archive(data, record["inventory"], record["compressedBytes"],
                    record["regularBytes"], record["tarballSha256"], record["npmIntegrity"])


def _projection(files, projection, skill, notice):
    require(len(projection) == 67, "PROJECTION_COUNT")
    result = {}
    for row in projection:
        require(set(row) == {"source", "target"}, "PROJECTION_SCHEMA")
        source, target = row["source"], row["target"]
        safe_name(source)
        safe_name(target)
        require(source == "package/assets/" + target and source in files, "PROJECTION_SOURCE")
        require(target.startswith(("data/", "scripts/")), "PROJECTION_SIBLING")
        require(target.casefold() not in {p.casefold() for p in result}, "PROJECTION_COLLISION")
        # Iteration over an exact reviewed map; never a runtime prefix selector.
        result[target] = files[source]
    result.update({"SKILL.md": skill, "NOTICE.md": notice})
    require(len(result) == 69, "OUTPUT_COUNT")
    return result


def planned_files(files, record, root):
    validate_record(record)
    skill = (root / "tooling/ui-ux-pro-max/SKILL.md.template").read_bytes()
    notice = (root / "tooling/ui-ux-pro-max/NOTICE.md.template").read_bytes()
    require(sha(skill) == record["localWrapperSha256"], "WRAPPER_DRIFT")
    require(sha(notice) == record["acceptance"]["noticeSha256"], "NOTICE_DRIFT")
    return _projection(files, record["projection"], skill, notice)


def expected_output_hashes(record):
    expected = {r["target"]: next(x["sha256"] for x in record["inventory"]
                                 if x["path"] == r["source"]) for r in record["projection"]}
    expected.update({"SKILL.md": record["localWrapperSha256"],
                     "NOTICE.md": record["acceptance"]["noticeSha256"]})
    require(len(expected) == 69, "OUTPUT_COUNT")
    for name in expected:
        safe_name(name)
    return expected


def host_check(path, executable=None):
    require(os.name == "nt" and sys.version_info >= (3, 10), "UNSUPPORTED_HOST_OR_PYTHON")
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.GetModuleFileNameW.argtypes = [wt.HANDLE, wt.LPWSTR, wt.DWORD]
    kernel.GetModuleFileNameW.restype = wt.DWORD
    module = ctypes.create_unicode_buffer(32768)
    size = kernel.GetModuleFileNameW(None, module, len(module))
    require(0 < size < len(module), "PYTHON_IDENTITY_UNKNOWN")
    executable = module.value if executable is None else executable
    executable = Path(executable)
    require(executable.is_absolute() and executable.is_file(), "PYTHON_MISSING")
    # The version belongs to this running module, never an arbitrary executable
    # supplied by a receipt. No alternate interpreter is executed to probe it.
    require(os.path.normcase(str(executable.resolve())) == os.path.normcase(module.value),
            "PYTHON_IDENTITY_DRIFT")
    api = Windows()
    volume = api.volume(Path(path))
    return {"path": str(executable.resolve()), "version": sys.version.split()[0],
            "sha256": sha(executable.read_bytes()), "volume": volume}


class Windows:
    """Typed Win32 calls; no shell, helper executable, privilege escalation."""

    class Info(ctypes.Structure):
        _fields_ = [("attributes", wt.DWORD), ("created", wt.FILETIME),
                    ("accessed", wt.FILETIME), ("written", wt.FILETIME),
                    ("volume", wt.DWORD), ("sizeHigh", wt.DWORD),
                    ("sizeLow", wt.DWORD), ("links", wt.DWORD),
                    ("indexHigh", wt.DWORD), ("indexLow", wt.DWORD)]

    def __init__(self):
        require(os.name == "nt", "UNSUPPORTED_HOST")
        self.k = ctypes.WinDLL("kernel32", use_last_error=True)
        self.a = ctypes.WinDLL("advapi32", use_last_error=True)
        self.k.CreateFileW.argtypes = [wt.LPCWSTR, wt.DWORD, wt.DWORD, ctypes.c_void_p,
                                      wt.DWORD, wt.DWORD, wt.HANDLE]
        self.k.CreateFileW.restype = wt.HANDLE
        self.k.CloseHandle.argtypes = [wt.HANDLE]
        self.k.CloseHandle.restype = wt.BOOL
        self.k.GetFileInformationByHandle.argtypes = [wt.HANDLE, ctypes.POINTER(self.Info)]
        self.k.GetFileInformationByHandle.restype = wt.BOOL
        self.k.GetFinalPathNameByHandleW.argtypes = [wt.HANDLE, wt.LPWSTR, wt.DWORD, wt.DWORD]
        self.k.GetFinalPathNameByHandleW.restype = wt.DWORD
        self.k.GetVolumePathNameW.argtypes = [wt.LPCWSTR, wt.LPWSTR, wt.DWORD]
        self.k.GetVolumePathNameW.restype = wt.BOOL
        self.k.GetVolumeInformationW.argtypes = [wt.LPCWSTR, wt.LPWSTR, wt.DWORD,
                                                ctypes.POINTER(wt.DWORD), ctypes.POINTER(wt.DWORD),
                                                ctypes.POINTER(wt.DWORD), wt.LPWSTR, wt.DWORD]
        self.k.GetVolumeInformationW.restype = wt.BOOL
        self.k.GetDriveTypeW.argtypes = [wt.LPCWSTR]
        self.k.GetDriveTypeW.restype = wt.UINT
        self.k.MoveFileExW.argtypes = [wt.LPCWSTR, wt.LPCWSTR, wt.DWORD]
        self.k.MoveFileExW.restype = wt.BOOL
        self.k.LocalFree.argtypes = [ctypes.c_void_p]
        self.k.LocalFree.restype = ctypes.c_void_p
        ptr = ctypes.POINTER(ctypes.c_void_p)
        self.a.GetSecurityInfo.argtypes = [wt.HANDLE, wt.DWORD, wt.DWORD, ptr, ptr, ptr, ptr, ptr]
        self.a.GetSecurityInfo.restype = wt.DWORD
        self.a.ConvertSidToStringSidW.argtypes = [ctypes.c_void_p, ctypes.POINTER(wt.LPWSTR)]
        self.a.ConvertSidToStringSidW.restype = wt.BOOL
        self.a.OpenProcessToken.argtypes = [wt.HANDLE, wt.DWORD, ctypes.POINTER(wt.HANDLE)]
        self.a.OpenProcessToken.restype = wt.BOOL
        self.a.GetTokenInformation.argtypes = [wt.HANDLE, wt.DWORD, ctypes.c_void_p, wt.DWORD,
                                              ctypes.POINTER(wt.DWORD)]
        self.a.GetTokenInformation.restype = wt.BOOL
        self.k.GetCurrentProcess.restype = wt.HANDLE
        self.owners = {self.current_sid(), "S-1-5-18", "S-1-5-32-544"}

    def sid(self, value):
        text = wt.LPWSTR()
        require(self.a.ConvertSidToStringSidW(value, ctypes.byref(text)), "UNKNOWN_OWNER")
        try:
            return text.value
        finally:
            self.k.LocalFree(ctypes.cast(text, ctypes.c_void_p))

    def current_sid(self):
        token = wt.HANDLE()
        require(self.a.OpenProcessToken(self.k.GetCurrentProcess(), 8, ctypes.byref(token)), "TOKEN_GUARD")
        try:
            size = wt.DWORD()
            self.a.GetTokenInformation(token, 1, None, 0, ctypes.byref(size))
            require(0 < size.value < 65536, "TOKEN_BOUND")
            buf = ctypes.create_string_buffer(size.value)
            require(self.a.GetTokenInformation(token, 1, buf, size, ctypes.byref(size)), "TOKEN_GUARD")
            return self.sid(ctypes.cast(buf, ctypes.POINTER(ctypes.c_void_p))[0])
        finally:
            self.k.CloseHandle(token)

    def volume(self, path):
        require(path.is_absolute() and not str(path).startswith("\\\\"), "REMOTE_OR_RELATIVE_PATH")
        anchor = ctypes.create_unicode_buffer(1024)
        require(self.k.GetVolumePathNameW(str(path), anchor, len(anchor)), "VOLUME_GUARD")
        require(self.k.GetDriveTypeW(anchor.value) == 3, "UNSUPPORTED_FILESYSTEM_HOST")
        fs = ctypes.create_unicode_buffer(32)
        serial, maximum, flags = wt.DWORD(), wt.DWORD(), wt.DWORD()
        require(self.k.GetVolumeInformationW(anchor.value, None, 0, ctypes.byref(serial),
                                            ctypes.byref(maximum), ctypes.byref(flags), fs, len(fs)),
                "VOLUME_GUARD")
        require(fs.value == "NTFS", "UNSUPPORTED_FILESYSTEM")
        return (anchor.value.casefold(), serial.value)

    def open(self, path):
        # GENERIC_READ | READ_CONTROL. Metadata-only access does not establish
        # the required share constraint; the real ancestor-rename test covers
        # this distinction. READ/WRITE sharing, explicitly NO DELETE sharing.
        handle = self.k.CreateFileW(str(path), 0x80020000, 3, None, 3, 0x02200000, None)
        require(handle not in (None, ctypes.c_void_p(-1).value), "HANDLE_GUARD")
        return handle

    def identity(self, handle, path):
        info = self.Info()
        require(self.k.GetFileInformationByHandle(handle, ctypes.byref(info)), "FILE_ID_GUARD")
        require(not info.attributes & 0x400, "REPARSE_POINT")
        final = ctypes.create_unicode_buffer(32768)
        size = self.k.GetFinalPathNameByHandleW(handle, final, len(final), 0)
        require(0 < size < len(final), "FINAL_PATH_GUARD")
        require(os.path.normcase(final.value.removeprefix("\\\\?\\")) ==
                os.path.normcase(str(path)), "RESOLVED_PATH_MISMATCH")
        owner, descriptor = ctypes.c_void_p(), ctypes.c_void_p()
        require(self.a.GetSecurityInfo(handle, 1, 1, ctypes.byref(owner), None, None, None,
                                       ctypes.byref(descriptor)) == 0, "OWNER_GUARD")
        try:
            sid = self.sid(owner)
            require(sid in self.owners, "UNKNOWN_OWNER")
        finally:
            self.k.LocalFree(descriptor)
        require(info.attributes & 0x10 or info.links == 1, "HARDLINK_FILE")
        return (info.volume, info.indexHigh, info.indexLow, sid, info.attributes & 0x10)

    def inspect(self, path):
        handle = self.open(path)
        try:
            return self.identity(handle, path)
        finally:
            self.k.CloseHandle(handle)


class Guard:
    """Pins existing ancestors. It does not claim to defeat hostile admins."""

    def __init__(self, root, paths):
        self.root = Path(os.path.abspath(root))
        self.paths = [Path(os.path.abspath(p)) for p in paths]
        self.api = Windows()
        self.handles = []
        self.active = False

    def __enter__(self):
        try:
            root_volume = self.api.volume(self.root)
            required = set(self.root.parents) | {self.root}
            for path in self.paths:
                require(path == self.root or self.root in path.parents, "OUTSIDE_REPOSITORY")
                required.update(path.parents)
            for path in sorted(required, key=lambda p: len(p.parts)):
                require(path.is_dir(), "MISSING_GUARD_ANCESTOR")
                require(self.api.volume(path) == root_volume, "CROSS_VOLUME")
                handle = self.api.open(path)
                self.handles.append((handle, path, None))
                ident = self.api.identity(handle, path)
                self.handles[-1] = (handle, path, ident)
            self.active = True
            self.recheck()
            return self
        except BaseException:
            self.__exit__(None, None, None)
            raise

    def recheck(self):
        require(self.active, "GUARD_NOT_HELD")
        for handle, path, ident in self.handles:
            require(self.api.identity(handle, path) == ident, "ANCESTOR_DRIFT")

    def __exit__(self, *_):
        self.active = False
        for handle, _, _ in reversed(self.handles):
            self.api.k.CloseHandle(handle)
        self.handles.clear()


def move_no_replace(root, source, target, expected):
    source, target = Path(source), Path(target)
    with Guard(root, [source, target]) as guard:
        require(guard.api.inspect(source) == expected, "SOURCE_ID_DRIFT")
        require(not os.path.lexists(target), "TARGET_CONFLICT")
        guard.recheck()
        # Windows enforces no-replace even if a target races the check above.
        if not guard.api.k.MoveFileExW(str(source), str(target), 0):
            raise Blocked(f"NO_REPLACE_MOVE_FAILED:{ctypes.get_last_error()}")
        require(guard.api.inspect(target) == expected, "POST_MOVE_ID_DRIFT")
        return expected


def tree_snapshot(path, *, _receipt=None):
    path = Path(path)
    api = Windows()
    root_id = api.inspect(path)
    require(bool(root_id[-1]), "TREE_NOT_DIRECTORY")
    found, dirs, folded = {}, set(), set()
    for parent, directory_names, file_names in os.walk(path, followlinks=False):
        for name in directory_names + file_names:
            child = Path(parent) / name
            relative = child.relative_to(path).as_posix()
            safe_name(relative)
            require(relative.casefold() not in folded, "TREE_CASE_COLLISION")
            folded.add(relative.casefold())
            if relative == "installation.json" and _receipt is not None:
                stream, handle = _receipt
                identity = api.identity(handle, child)
                stream.seek(0)
                found[relative] = {"identity": identity, "sha256": sha(stream.read())}
                continue
            identity = api.inspect(child)
            if name in directory_names:
                dirs.add(relative)
            else:
                found[relative] = {"identity": identity, "sha256": sha(child.read_bytes())}
    return {"identity": root_id, "files": found, "directories": sorted(dirs)}


def same_tree(path, expected):
    require(tree_snapshot(path) == expected, "UNKNOWN_CONCURRENT_STATE")


def protected_paths(root):
    user = Path.home()
    codex = Path(os.environ.get("CODEX_HOME", user / ".codex"))
    return [Path(root) / ".agents/skills", codex / "config.toml", codex / "skills",
            user / ".agents/skills", Path(os.environ.get("PROGRAMDATA", "C:/ProgramData")) / "codex"]


def fingerprint(paths, excluded=()):
    """Bounded non-following inventory; only hashes, never configuration text."""
    excluded = {os.path.normcase(os.path.abspath(p)) for p in excluded}
    pending, result = list(map(Path, paths)), {}
    while pending:
        path = pending.pop()
        key = os.path.normcase(os.path.abspath(path))
        if key in excluded:
            continue
        require(len(result) + len(pending) < 10000, "FINGERPRINT_BOUND")
        if not os.path.lexists(path):
            result[key] = "ABSENT"
            continue
        info = path.lstat()
        require(not getattr(info, "st_file_attributes", 0) & 0x400, "GLOBAL_REPARSE")
        if path.is_dir():
            result[key] = "DIRECTORY"
            pending.extend(path.iterdir())
        else:
            require(path.is_file(), "UNSUPPORTED_GLOBAL_ENTRY")
            result[key] = sha(path.read_bytes())
    return result


def content_check(path, hashes):
    snap = tree_snapshot(path)
    require(set(snap["files"]) == set(hashes), "TREE_INVENTORY")
    require(set(snap["directories"]) == ancestors(hashes), "TREE_EXTRA_DIRECTORY")
    require(all(snap["files"][p]["sha256"] == h for p, h in hashes.items()), "TREE_HASH")
    return snap


def receipt(files, record, run_id, interpreter):
    require(len(files) == 69 and "installation.json" not in files, "RECEIPT_FILE_COUNT")
    return {"schemaVersion": 1, "state": "pending", "runId": run_id,
            "artifactRecordSha256": sha(canonical(record)),
            "acceptancePacketSha256": record["acceptance"]["packetSha256"],
            "localWrapperVersion": record["localWrapperVersion"],
            "files": {p: sha(b) for p, b in files.items()},
            "interpreter": interpreter, "checks": {}}


def verify_receipt(path, record, *, verification=None):
    validate_record(record)
    value = decode_json((path / "installation.json").read_bytes())
    keys = {"schemaVersion", "state", "runId", "artifactRecordSha256", "acceptancePacketSha256",
            "localWrapperVersion", "files", "interpreter", "checks"}
    require(isinstance(value, dict) and set(value) == keys, "RECEIPT_SCHEMA")
    require(value["schemaVersion"] == 1 and type(value["schemaVersion"]) is int, "RECEIPT_VERSION")
    require(value["artifactRecordSha256"] == sha(canonical(record)) and
            value["acceptancePacketSha256"] == record["acceptance"]["packetSha256"] and
            value["localWrapperVersion"] == record["localWrapperVersion"], "RECEIPT_IDENTITY")
    require(bool(re.fullmatch("[a-f0-9]{32}", value["runId"])), "RUN_ID")
    expected = expected_output_hashes(record)
    require(value["files"] == expected, "RECEIPT_HASH_MAP")
    require(value["state"] in ("pending", "verified"), "RECEIPT_STATE")
    if value["state"] == "pending":
        require(value["checks"] == {}, "PENDING_CHECKS")
        require((isinstance(verification, _Run) or _owns_resume(verification)) and verification.active and
                verification.path == path and verification.run_id == value["runId"], "PENDING_DENIED")
        verification.guard.recheck()
    else:
        require(set(value["checks"]) == CHECKS and
                all(v == "PASS" for v in value["checks"].values()), "INCOMPLETE_VERIFICATION")
    require(isinstance(value["interpreter"], dict) and set(value["interpreter"]) ==
            {"path", "version", "sha256", "volume"}, "INTERPRETER_SCHEMA")
    current = host_check(path, value["interpreter"]["path"])
    require(canonical(current) == canonical(value["interpreter"]), "PYTHON_IDENTITY_DRIFT")
    content_check(path, {**expected, "installation.json": sha((path / "installation.json").read_bytes())})
    return value


def read_record(root, acceptance_path):
    root, acceptance_path = Path(root), Path(acceptance_path)
    with Guard(root, [root / RECORD, acceptance_path]) as guard:
        guard.api.inspect(root / RECORD)
        guard.api.inspect(acceptance_path)
        record = validate_record(decode_json((root / RECORD).read_bytes()))
        require(decode_json(acceptance_path.read_bytes()) == record, "ACCEPTANCE_MISMATCH")
    packet = root / record["acceptance"]["packet"]
    with Guard(root, [packet]) as guard:
        guard.api.inspect(packet)
        require(sha(packet.read_bytes()) == record["acceptance"]["packetSha256"], "ACCEPTANCE_PACKET_DRIFT")
    return record


@contextlib.contextmanager
def _mutation_lease(root):
    # A named kernel object, never a 71st file or an on-disk lock. Existing
    # objects (including a recursive acquisition on this thread) fail closed.
    api = Windows()
    api.k.CreateMutexW.argtypes = [ctypes.c_void_p, wt.BOOL, wt.LPCWSTR]
    api.k.CreateMutexW.restype = wt.HANDLE
    api.k.ReleaseMutex.argtypes = [wt.HANDLE]
    api.k.ReleaseMutex.restype = wt.BOOL
    name = "Local\\YutaUiUxResume-" + sha(os.path.normcase(str(root / TARGET)).encode())
    ctypes.set_last_error(0)
    handle = api.k.CreateMutexW(None, True, name)
    error = ctypes.get_last_error()
    require(handle, "MUTATION_LEASE_UNAVAILABLE")
    if error == 183:
        api.k.CloseHandle(handle)
        raise Blocked("MUTATION_LEASE_BUSY")
    try:
        yield
    finally:
        api.k.ReleaseMutex(handle)
        api.k.CloseHandle(handle)


@contextlib.contextmanager
def _exclusive_receipt(path):
    import msvcrt
    api = Windows()
    handle = api.k.CreateFileW(str(path), 0xC0020000, 0, None, 3, 0x02200000, None)
    require(handle not in (None, ctypes.c_void_p(-1).value), "RECEIPT_EXCLUSIVE_OPEN")
    try:
        api.identity(handle, path)
        fd = msvcrt.open_osfhandle(handle, os.O_RDWR | os.O_BINARY)
    except BaseException:
        api.k.CloseHandle(handle)
        raise
    # fd owns the handle. Do not close it a second time with CloseHandle.
    with os.fdopen(fd, "r+b") as stream:
        yield stream, handle


def _transition_receipt(path, run_id, snapshot, guard, surroundings):
    guard.recheck()
    surroundings()
    same_tree(path, snapshot)
    with _exclusive_receipt(path / "installation.json") as opened:
        stream, _ = opened
        require(tree_snapshot(path, _receipt=opened) == snapshot, "RECEIPT_PREIMAGE_DRIFT")
        stream.seek(0)
        original = stream.read()
        value = decode_json(original)
        require(value["state"] == "pending" and value["checks"] == {} and
                value["runId"] == run_id, "RECEIPT_TRANSITION")
        require(sha(original) == snapshot["files"]["installation.json"]["sha256"],
                "RECEIPT_PREIMAGE_DRIFT")
        guard.recheck()
        surroundings()
        require(tree_snapshot(path, _receipt=opened) == snapshot, "RECEIPT_PREIMAGE_DRIFT")
        value.update(state="verified", checks={name: "PASS" for name in sorted(CHECKS)})
        data = canonical(value) + b"\n"
        # One write on the very handle that read/validated the preimage. No
        # replacement, self-hash, temporary output or crash-repair behavior.
        stream.seek(0)
        require(stream.write(data) == len(data), "RECEIPT_SHORT_WRITE")
        stream.truncate()
        stream.flush()
        os.fsync(stream.fileno())
        post = tree_snapshot(path, _receipt=opened)
        expected = decode_json(canonical(snapshot))
        expected["files"]["installation.json"]["sha256"] = sha(data)
        require(canonical(post) == canonical(expected), "RECEIPT_POSTIMAGE_DRIFT")
        guard.recheck()
        surroundings()
    same_tree(path, post)
    return sha(data), post


_CHANGE = Path("openspec/changes/ui-ux-pro-max-integration")
_TASKS = _CHANGE / "tasks.md"
_SOURCE_PATHS = frozenset({
    "scripts/ui-ux-pro-max/bootstrap.py", "scripts/ui-ux-pro-max/query.py",
    "scripts/ui-ux-pro-max/test_bootstrap.py", "package.json", "pnpm-lock.yaml",
    "AGENTS.md", "docs/AUTHORITY_MODEL.md", "docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md",
    ".gitignore", "docs/README.md", "docs/ui/README.md", "docs/ui/YUTA_FRONTEND_RULES.md",
    "docs/ui/DELIVERY_WORKFLOW_MODES.md", "docs/ui/DESIGN_TO_CODE_WORKFLOW.md",
    "docs/YUTA_WORKFLOW_V3.md", "docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md",
    "docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md",
    "docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md", "docs/DEVELOPMENT_WORKFLOW.md",
    ".agents/skills/yuta-run-change/SKILL.md", ".agents/skills/yuta-finish-change/SKILL.md",
    "tooling/ui-ux-pro-max/artifact.json", "tooling/ui-ux-pro-max/SKILL.md.template",
    "tooling/ui-ux-pro-max/NOTICE.md.template", "docs/CURRENT_STATE.md",
    "docs/LIFECYCLE_STATUS_MODEL.md", "docs/MODULE_REGISTRY.md",
    "docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md", "docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md",
    "docs/PRODUCT_KNOWLEDGE.md", "docs/ui/PAGE_PACK_PROTOCOL.md", "openspec/config.yaml",
    "openspec/schemas/yuta-spec-driven/schema.yaml", "packages/ui/src/index.ts",
    "packages/ui/src/styles/global.css", "openspec/changes/ui-ux-pro-max-integration/.openspec.yaml",
    str(_CHANGE / "proposal.md").replace("\\", "/"),
    str(_CHANGE / "analysis.md").replace("\\", "/"),
    str(_CHANGE / "design.md").replace("\\", "/"),
    str(_CHANGE / "specs/tooling/external-design-intelligence/spec.md").replace("\\", "/"),
})
_RESUMES = set()


def _owns_resume(value):
    return value is not None and id(value) in _RESUMES


def _shape(value, keys, reason):
    require(isinstance(value, dict) and set(value) == set(keys), reason)
    return value


def _digest(value):
    require(isinstance(value, str) and re.fullmatch(r"[a-f0-9]{64}", value), "INVALID_DIGEST")
    return value


def _local(root, value):
    require(isinstance(value, str), "INVALID_LOCAL_PATH")
    safe_name(value)
    path = root / Path(value)
    require(root in path.parents and path.is_absolute(), "OUTSIDE_REPOSITORY")
    return path


def _unit(root, reference):
    # References select hash-bound units in the existing Tasks artifact only.
    # There is no caller-selected checkpoint file or implicit approval by hash.
    _shape(reference, {"marker", "sha256"}, "EVIDENCE_REFERENCE_SCHEMA")
    marker = reference["marker"]
    require(isinstance(marker, str) and re.fullmatch(r"[A-Z][A-Z0-9_]{2,95}", marker),
            "EVIDENCE_MARKER")
    data = (root / _TASKS).read_bytes()
    begin, end = (f"<!-- {marker}_BEGIN -->\n".encode(), f"<!-- {marker}_END -->".encode())
    require(data.count(begin) == data.count(end) == 1, "EVIDENCE_UNIT_MISSING_OR_DUPLICATE")
    start = data.index(begin) + len(begin)
    stop = data.index(end)
    require(stop > start, "EVIDENCE_UNIT_ORDER")
    raw = data[start:stop]
    require(len(raw) <= 2 * 1024 * 1024 and sha(raw) == _digest(reference["sha256"]),
            "EVIDENCE_HASH_MISMATCH")
    matches = re.findall(rb"(?m)^(`{3,4})json\n(.*?)\n\1(?:\n|$)", raw, re.S)
    require(len(matches) == 1, "EVIDENCE_JSON_UNIT")
    return decode_json(matches[0][1])


def _review(root, reviewed_checkpoint, mode):
    _shape(reviewed_checkpoint, {"checkpoint", "approval"}, "REVIEW_REFERENCE_SCHEMA")
    checkpoint = _unit(root, reviewed_checkpoint["checkpoint"])
    _shape(checkpoint, {"mode", "root", "artifactPath", "acceptancePath", "runId",
                       "recordRawSha256", "recordCanonicalSha256", "pendingReceiptSha256",
                       "targetSnapshot", "baseline", "m11", "protectedFiles",
                       "surroundings", "interpreter", "completion"}, "CHECKPOINT_SCHEMA")
    approval = _unit(root, reviewed_checkpoint["approval"])
    _shape(approval, {"source", "decision", "operation", "checkpointSha256",
                     "baselineSha256", "m11Sha256", "environmentSha256",
                     "protectedFilesSha256"}, "APPROVAL_SCHEMA")
    require(approval["source"] == "explicit Control Tower approval" and
            approval["decision"] == "APPROVED" and approval["operation"] == mode and
            checkpoint["mode"] == mode, "RESUME_NOT_AUTHORIZED")
    require(approval["checkpointSha256"] == reviewed_checkpoint["checkpoint"]["sha256"] and
            approval["baselineSha256"] == checkpoint["baseline"]["sha256"] and
            approval["m11Sha256"] == checkpoint["m11"]["sha256"] and
            approval["environmentSha256"] == sha(canonical(checkpoint["surroundings"])) and
            approval["protectedFilesSha256"] == sha(canonical(checkpoint["protectedFiles"])),
            "APPROVAL_BINDING")
    require(checkpoint["root"] == str(root), "CHECKPOINT_ROOT")
    require(isinstance(checkpoint["runId"], str) and
            re.fullmatch(r"[a-f0-9]{32}", checkpoint["runId"]), "RUN_ID")
    require(checkpoint["baseline"]["marker"] == "CURRENT_RESUME_IDENTITY_BASELINE",
            "CURRENT_BASELINE_REQUIRED")
    _digest(checkpoint["pendingReceiptSha256"])
    return checkpoint


def _check_m11(root, checkpoint):
    value = _unit(root, checkpoint["m11"])
    # Overall FAIL is never rescued by correct artifact identity/A-G fields.
    require(value.get("result") == "PASS", "M11_NOT_PASS")
    _shape(value, {"result", "environment", "binary", "argv", "threadId", "ephemeral",
                   "promptSha256", "transcriptSha256", "exitCode", "observations",
                   "artifactRecordSha256", "protectedFilesSha256"}, "M11_SCHEMA")
    require(value["exitCode"] == 0 and type(value["exitCode"]) is int and
            value["ephemeral"] is True and isinstance(value["threadId"], str) and
            re.fullmatch(r"[a-f0-9-]{36}", value["threadId"]), "M11_INVOCATION")
    require(set(value["observations"]) == set("ABCDEFG") and
            all(v == "PASS" for v in value["observations"].values()), "M11_OBSERVATIONS")
    _digest(value["promptSha256"])
    _digest(value["transcriptSha256"])
    require(value["environment"] == checkpoint["surroundings"] and
            value["environment"] == fingerprint(protected_paths(root), [root / TARGET]),
            "M11_ENVIRONMENT_DRIFT")
    require(value["artifactRecordSha256"] == checkpoint["recordCanonicalSha256"] and
            value["protectedFilesSha256"] == sha(canonical(checkpoint["protectedFiles"])),
            "M11_SOURCE_BINDING")
    binary = _shape(value["binary"], {"path", "version", "sha256"}, "M11_BINARY_SCHEMA")
    exe = Path(binary["path"])
    require(exe.is_absolute() and exe.is_file() and isinstance(binary["version"], str) and
            binary["version"].startswith("codex-cli ") and
            sha(exe.read_bytes()) == _digest(binary["sha256"]), "M11_BINARY_DRIFT")
    # The exact reviewed invocation is data; never execute Codex from resume.
    require(value["argv"] == [str(exe), "exec", "--sandbox", "read-only", "--ephemeral",
                               "--json", "--color", "never", "-c", 'approval_policy="never"',
                               "-c", "notify=[]", "-C", str(root), "-"], "M11_INVOCATION")
    return value


def _baseline(root, checkpoint, snapshot):
    baseline = _unit(root, checkpoint["baseline"])
    require(baseline["identityMapSha256"] == sha(canonical(baseline["identityMap"])) and
            baseline["beforeAfterIdentityMapEqual"] is True and
            baseline["captureStartedUtc"] <= baseline["captureCompletedUtc"], "BASELINE_BINDING")
    require(baseline["historicalRunDirectoryIdentity"] == "NOT_RECORDED" and
            baseline["originalRunCurrentState"] == "EXISTING_EXACT" and
            baseline["candidateCurrentState"] == baseline["quarantineCurrentState"] == "ABSENT",
            "BASELINE_PROVENANCE")
    require(baseline["receiptRunId"] == checkpoint["runId"] and
            baseline["receiptSha256"] == checkpoint["pendingReceiptSha256"] and
            checkpoint["targetSnapshot"]["files"]["installation.json"]["sha256"] ==
            checkpoint["pendingReceiptSha256"] and
            baseline["targetSnapshotSha256"] == sha(canonical(checkpoint["targetSnapshot"])),
            "BASELINE_TARGET_BINDING")
    run = root / STAGING / checkpoint["runId"]
    paths = {root / RECORD, root / _TASKS, root / _CHANGE / "design.md",
             root / "docs/reviews/ui-ux-pro-max-integration/02b-design-review.md",
             root / "docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md",
             _local(root, checkpoint["artifactPath"]), _local(root, checkpoint["acceptancePath"]),
             root / TARGET / "installation.json", run / "candidate", run / "quarantine"}
    for path in list(paths):
        paths.update(path.parents)
    require(set(baseline["identityMap"]) == {os.path.normcase(str(p)) for p in paths},
            "BASELINE_PATH_SET")
    api = Windows()
    for name, row in baseline["identityMap"].items():
        path = Path(name)
        require(row["normalizedAbsolutePath"] == name, "BASELINE_PATH")
        if row["type"] == "ABSENT":
            _shape(row, {"type", "normalizedAbsolutePath", "nearestExistingParent", "nearestParentIdentity",
                         "intendedFinalComponent", "missingRelativePathFromNearestParent", "parentPath",
                         "containment", "existingAncestorChain", "existingAncestorChainReparse",
                         "absenceVerifiedBefore", "absenceVerifiedAfter"}, "ABSENCE_RECORD_SCHEMA")
            require(path in {run / "candidate", run / "quarantine"} and not os.path.lexists(path),
                    "RECOVERY_DESTINATION_EXISTS")
            require(row["nearestExistingParent"] == row["parentPath"] == os.path.normcase(str(run)) and
                    row["intendedFinalComponent"] == row["missingRelativePathFromNearestParent"] == path.name and
                    row["containment"] == "WITHIN_REPOSITORY" and
                    row["existingAncestorChainReparse"] is False and
                    row["absenceVerifiedBefore"] is row["absenceVerifiedAfter"] is True and
                    row["existingAncestorChain"] == [os.path.normcase(str(p)) for p in
                                                     [*reversed(run.parents), run]], "ABSENCE_RECORD_BINDING")
            require(canonical(row["nearestParentIdentity"]) == canonical(api.inspect(run)),
                    "ABSENCE_PARENT_DRIFT")
            require(canonical(api.inspect(run)) == canonical(baseline["identityMap"][
                os.path.normcase(str(run))]["identity"]), "ORIGINAL_RUN_DRIFT")
        else:
            ident = api.inspect(path)
            require(row["type"] == ("DIRECTORY" if ident[-1] else "FILE") and
                    canonical(ident) == canonical(row["identity"]), "BASELINE_NATIVE_ID_DRIFT")
            if row["type"] == "FILE" and path != root / _TASKS:
                if path == root / TARGET / "installation.json":
                    expected = snapshot["files"]["installation.json"]["sha256"]
                else:
                    relative = path.relative_to(root).as_posix()
                    # Only the explicitly approved current source binding can
                    # supersede a capture-time hash; never infer one from disk.
                    expected = checkpoint["protectedFiles"].get(relative, row["sha256"])
                require(sha(path.read_bytes()) == expected, "BASELINE_FILE_DRIFT")
    return baseline


def _bound_state(root, artifact_path, acceptance_path, checkpoint, snapshot):
    require(artifact_path == _local(root, checkpoint["artifactPath"]) and
            acceptance_path == _local(root, checkpoint["acceptancePath"]), "INPUT_PATH_DRIFT")
    protected = checkpoint["protectedFiles"]
    require(isinstance(protected, dict) and _SOURCE_PATHS <= set(protected), "PROTECTED_PATH_SET")
    for name, digest in protected.items():
        require(sha(_local(root, name).read_bytes()) == _digest(digest), "PROTECTED_SOURCE_DRIFT")
    record = read_record(root, acceptance_path)
    require(sha((root / RECORD).read_bytes()) == checkpoint["recordRawSha256"] and
            sha(canonical(record)) == checkpoint["recordCanonicalSha256"], "ARTIFACT_IDENTITY_DRIFT")
    files = verify_archive(artifact_path.read_bytes(), record)
    planned = planned_files(files, record, root)
    require(len(files) == 196 and len(record["projection"]) == 67 and len(planned) == 69,
            "ACCEPTED_INVENTORY")
    expected = {name: sha(data) for name, data in planned.items()}
    require({p: v["sha256"] for p, v in snapshot["files"].items() if p != "installation.json"}
            == expected, "CHECKPOINT_MANIFEST")
    actual = content_check(root / TARGET, {**expected, "installation.json":
                                          snapshot["files"]["installation.json"]["sha256"]})
    require(canonical(actual) == canonical(snapshot), "TARGET_IDENTITY_DRIFT")
    _baseline(root, checkpoint, snapshot)
    require(canonical(host_check(root)) == canonical(checkpoint["interpreter"]), "PYTHON_IDENTITY_DRIFT")
    require(fingerprint(protected_paths(root), [root / TARGET]) == checkpoint["surroundings"],
            "SIBLING_OR_GLOBAL_DRIFT")
    _check_m11(root, checkpoint)
    return record, actual


class _Resume:
    """Created only inside resume_pending's guarded lifetime; no PASS setter."""

    def __init__(self, *args, **kwargs):
        raise Blocked("PRIVATE_RESUME_CONTEXT")

    def _recheck(self):
        require(_owns_resume(self) and self.active, "RESUME_CONTEXT_EXPIRED")
        self.guard.recheck()
        current = _review(self.root, self.reference, "resume_pending")
        require(current == self.checkpoint, "REVIEW_DRIFT")
        _bound_state(self.root, self.artifact, self.acceptance, self.checkpoint, self.snapshot)

    def _complete(self):
        self._recheck()
        require(not self.completed, "RECEIPT_TRANSITION")
        evidence = _run_current_checks(self)
        self._recheck()
        _validate_checks(self.root, self.checkpoint, evidence)
        # During the exclusive receipt open, recheck every other bound file and
        # environment without opening that receipt again.
        def surroundings():
            self.guard.recheck()
            require(_review(self.root, self.reference, "resume_pending") == self.checkpoint,
                    "REVIEW_DRIFT")
            for name, digest in self.checkpoint["protectedFiles"].items():
                require(sha(_local(self.root, name).read_bytes()) == digest, "PROTECTED_SOURCE_DRIFT")
            _check_m11(self.root, self.checkpoint)
            run = self.root / STAGING / self.run_id
            require(not os.path.lexists(run / "candidate") and not os.path.lexists(run / "quarantine"),
                    "RECOVERY_DESTINATION_EXISTS")
        digest, self.snapshot = _transition_receipt(
            self.path, self.run_id, self.snapshot, self.guard, surroundings)
        self.completed = True
        self._recheck()
        self.result = {"receiptPostimageSha256": digest, "targetSnapshot": self.snapshot,
                       "evidence": evidence}
        return decode_json(canonical(self.result))

    def _quarantine_verified(self):
        # D17 is recovery, never success and never verified -> pending.
        require(self.completed and self.result is not None, "RECOVERY_WITHOUT_POSTIMAGE")
        self._recheck()
        require(sha((self.path / "installation.json").read_bytes()) ==
                self.result["receiptPostimageSha256"], "RECOVERY_POSTIMAGE_DRIFT")
        destination = self.root / STAGING / self.run_id / "quarantine"
        # Release target-descendant guards only after verification; retain the
        # original-run/root ancestor guards and reacquire no-replace move guards.
        self.guard.__exit__()
        with Guard(self.root, [self.path, destination]) as guard:
            guard.recheck()
            require(canonical(tree_snapshot(self.path)) == canonical(self.snapshot), "RECOVERY_DRIFT")
            baseline = _unit(self.root, self.checkpoint["baseline"])
            original = baseline["identityMap"][os.path.normcase(str(destination.parent))]["identity"]
            require(canonical(guard.api.inspect(destination.parent)) == canonical(original), "ORIGINAL_RUN_DRIFT")
            move_no_replace(self.root, self.path, destination, self.snapshot["identity"])
        self.active = False
        return {"status": "NOT_INTEGRATED", "quarantine": str(destination),
                "receiptState": "verified", "receiptPostimageSha256": self.result["receiptPostimageSha256"]}


@contextlib.contextmanager
def resume_pending(root, artifact_path, acceptance_path, reviewed_checkpoint):
    root = Path(os.path.abspath(root))
    artifact_path, acceptance_path = Path(artifact_path), Path(acceptance_path)
    # Load only under evidence/ancestor guards; no new run/candidate is created.
    with Guard(root, [root / _TASKS, root / RECORD, artifact_path, acceptance_path]):
        checkpoint = _review(root, reviewed_checkpoint, "resume_pending")
        require(checkpoint["completion"] is None, "PENDING_COMPLETION_EVIDENCE")
        run = root / STAGING / checkpoint["runId"]
        paths = [artifact_path, acceptance_path, root / _TASKS, root / RECORD,
                 root / TARGET / "installation.json", run / "quarantine", run / "candidate"]
        paths.extend(_local(root, p) for p in checkpoint["protectedFiles"])
        with Guard(root, paths) as guard, _mutation_lease(root):
            record, snapshot = _bound_state(root, artifact_path, acceptance_path,
                                            checkpoint, checkpoint["targetSnapshot"])
            raw = (root / TARGET / "installation.json").read_bytes()
            require(sha(raw) == checkpoint["pendingReceiptSha256"], "RECEIPT_PREIMAGE_DRIFT")
            value = decode_json(raw)
            require(value["state"] == "pending" and value["checks"] == {} and
                    value["runId"] == checkpoint["runId"], "RECEIPT_TRANSITION")
            owner = object.__new__(_Resume)
            owner.root, owner.path, owner.run_id = root, root / TARGET, checkpoint["runId"]
            owner.record, owner.snapshot, owner.guard = record, snapshot, guard
            owner.reference = decode_json(canonical(reviewed_checkpoint))
            owner.checkpoint, owner.artifact, owner.acceptance = checkpoint, artifact_path, acceptance_path
            owner.active, owner.completed, owner.result = True, False, None
            _RESUMES.add(id(owner))
            try:
                verify_receipt(owner.path, record, verification=owner)
                owner._recheck()
                yield owner
            finally:
                owner.active = False
                _RESUMES.discard(id(owner))


_SMOKE_QUERIES = (
    ("keyboard accessibility", "--domain", "ux"),
    ("destructive confirmation modal form validation", "--domain", "ux"),
    ("loading pending feedback", "--domain", "ux"),
    ("server client component boundaries", "--stack", "nextjs"),
)
_DENIED_SMOKE_FLAGS = ("--persist", "--force", "--output-dir", "--design-system")


def _check_binding(checkpoint):
    # Completion changes neither the original pending binding nor source/M11
    # authority. Exclude only the operation selector and completion reference.
    return sha(canonical({k: v for k, v in checkpoint.items() if k not in {"mode", "completion"}}))


def _m13_command(root, interpreter):
    return [interpreter["path"], "-B", "-m", "unittest", "discover", "-s",
            "scripts/ui-ux-pro-max", "-p", "test_bootstrap.py"]


def _run_m13(root, interpreter):
    import query
    command = _m13_command(root, interpreter)
    result = subprocess.run(command, cwd=root, env=query._query_environment(root),
                            shell=False, capture_output=True, timeout=300, check=False)
    require(len(result.stdout) + len(result.stderr) < 2 * 1024 * 1024, "M13_OUTPUT_BOUND")
    return {"argv": command, "exitCode": result.returncode,
            "stdout": result.stdout.decode("utf-8"), "stderr": result.stderr.decode("utf-8")}


def _run_current_checks(owner):
    import query
    owner._recheck()
    evidence = {"binding": _check_binding(owner.checkpoint), "checks": {}}
    checks = evidence["checks"]
    # These measurements follow _bound_state's actual archive/template/tree/
    # interpreter checks. They are not caller-provided PASS assertions.
    for name in ("M01", "M02", "M03", "M04"):
        checks[name] = {"kind": "content-and-identity", "targetSnapshotSha256":
                        sha(canonical(owner.checkpoint["targetSnapshot"]))}
    for index, spec in enumerate(_SMOKE_QUERIES, 5):
        owner._recheck()
        args = query.arguments([*spec, "--max-results", "3"])
        _, observed = query._execute(args, owner.root, owner.record, owner.path, verification=owner)
        checks[f"M{index:02}"] = observed
        owner._recheck()
    for flag in _DENIED_SMOKE_FLAGS:
        denied = False
        with contextlib.redirect_stderr(io.StringIO()):
            try:
                query.arguments([*_SMOKE_QUERIES[0], "--max-results", "3", flag])
            except (SystemExit, Blocked):
                denied = True
        require(denied, "M09_ARGUMENT_ACCEPTED")
    checks["M09"] = {"rejectedBeforeSpawn": list(_DENIED_SMOKE_FLAGS)}
    owner._recheck()
    checks["M10"] = {"unchangedSurroundingsSha256": sha(canonical(owner.checkpoint["surroundings"]))}
    _check_m11(owner.root, owner.checkpoint)
    checks["M11"] = {"approvedEvidenceSha256": owner.checkpoint["m11"]["sha256"]}
    checks["M13"] = _run_m13(owner.root, owner.checkpoint["interpreter"])
    owner._recheck()
    checks["PRE_COMPLETION_INTEGRITY"] = {"binding": evidence["binding"]}
    _validate_checks(owner.root, owner.checkpoint, evidence)
    return evidence


def _validate_checks(root, checkpoint, evidence):
    import query
    _shape(evidence, {"binding", "checks"}, "SMOKE_EVIDENCE_SCHEMA")
    require(evidence["binding"] == _check_binding(checkpoint), "SMOKE_BINDING")
    checks = _shape(evidence["checks"], CHECKS, "SMOKE_CHECK_SET")
    for name in ("M01", "M02", "M03", "M04"):
        require(checks[name] == {"kind": "content-and-identity", "targetSnapshotSha256":
                                sha(canonical(checkpoint["targetSnapshot"]))}, "CONTENT_EVIDENCE")
    for index, spec in enumerate(_SMOKE_QUERIES, 5):
        value = _shape(checks[f"M{index:02}"], {"utc", "argv", "interpreter", "environmentKeys",
                       "scratchPath", "scratchIdentity", "exitCode", "timedOut", "stdoutSha256",
                       "stderrSha256", "receiptSha256", "artifactRecordSha256", "scratchEmpty"},
                       "QUERY_EVIDENCE_SCHEMA")
        args = query.arguments([*spec, "--max-results", "3"])
        require(value["argv"] == query._argv(args, checkpoint["interpreter"], root / TARGET) and
                canonical(value["interpreter"]) == canonical(checkpoint["interpreter"]), "QUERY_INVOCATION")
        require(type(value["exitCode"]) is int and value["exitCode"] == 0 and
                value["timedOut"] is False and value["scratchEmpty"] is True, "QUERY_FAILED")
        require(value["environmentKeys"] == sorted(("SystemRoot", "WINDIR", "SystemDrive", "TEMP", "TMP")),
                "QUERY_ENVIRONMENT")
        require(value["receiptSha256"] == checkpoint["pendingReceiptSha256"] and
                value["artifactRecordSha256"] == checkpoint["recordCanonicalSha256"], "QUERY_BINDING")
        _digest(value["stdoutSha256"])
        _digest(value["stderrSha256"])
        scratch = Path(value["scratchPath"])
        require(scratch.parent == root / STAGING and scratch.name.startswith("query-") and
                not os.path.lexists(scratch) and isinstance(value["scratchIdentity"], (list, tuple)) and
                len(value["scratchIdentity"]) == 5 and value["scratchIdentity"][-1] == 16 and
                isinstance(value["utc"], str) and "T" in value["utc"], "QUERY_SCRATCH_EVIDENCE")
    require(checks["M09"] == {"rejectedBeforeSpawn": list(_DENIED_SMOKE_FLAGS)}, "M09_EVIDENCE")
    require(checks["M10"] == {"unchangedSurroundingsSha256": sha(canonical(checkpoint["surroundings"]))},
            "M10_EVIDENCE")
    require(checks["M11"] == {"approvedEvidenceSha256": checkpoint["m11"]["sha256"]}, "M11_BINDING")
    m13 = _shape(checks["M13"], {"argv", "exitCode", "stdout", "stderr"}, "M13_EVIDENCE")
    require(m13["argv"] == _m13_command(root, checkpoint["interpreter"]) and
            type(m13["exitCode"]) is int and m13["exitCode"] == 0, "M13_FAILED")
    require(isinstance(m13["stderr"], str) and isinstance(m13["stdout"], str) and
            len(m13["stderr"]) + len(m13["stdout"]) < 2 * 1024 * 1024, "M13_OUTPUT_BOUND")
    match = re.search(r"(?m)^Ran ([0-9]+) tests in [0-9.]+s\s+OK\s*$", m13["stderr"])
    require(match is not None and int(match[1]) >= 127 and "skipped" not in m13["stderr"].lower(),
            "M13_NOT_ALL_PASS")
    require(checks["PRE_COMPLETION_INTEGRITY"] == {"binding": evidence["binding"]}, "PRE_COMPLETION_EVIDENCE")


def verify_existing(root, artifact_path, acceptance_path, reviewed_checkpoint):
    """M12: revalidate exact approved completion evidence without executing it.

    No receipt repair, scratch, query, subprocess, directory creation or writes.
    This operation needs its own exact reviewed verified-state evidence unit.
    """
    root = Path(os.path.abspath(root))
    artifact_path, acceptance_path = Path(artifact_path), Path(acceptance_path)
    with Guard(root, [root / _TASKS, root / RECORD, artifact_path, acceptance_path]):
        checkpoint = _review(root, reviewed_checkpoint, "verify_existing")
        require(checkpoint["completion"] is not None, "MISSING_COMPLETION_EVIDENCE")
        completion = _unit(root, checkpoint["completion"])
        _shape(completion, {"receiptPostimageSha256", "targetSnapshot", "evidence"}, "COMPLETION_SCHEMA")
        expected = decode_json(canonical(checkpoint["targetSnapshot"]))
        expected["files"]["installation.json"]["sha256"] = _digest(completion["receiptPostimageSha256"])
        require(canonical(expected) == canonical(completion["targetSnapshot"]), "POSTIMAGE_IDENTITY_DRIFT")
        paths = [root / TARGET / "installation.json", root / STAGING / checkpoint["runId"] / "quarantine"]
        paths.extend(_local(root, p) for p in checkpoint["protectedFiles"])
        with Guard(root, paths) as guard:
            before = fingerprint(protected_paths(root), [root / TARGET])
            record, snapshot = _bound_state(root, artifact_path, acceptance_path, checkpoint, expected)
            value = verify_receipt(root / TARGET, record)
            require(value["state"] == "verified" and value["runId"] == checkpoint["runId"], "M12_RECEIPT_STATE")
            require((root / TARGET / "installation.json").read_bytes() == canonical(value) + b"\n",
                    "RECEIPT_NOT_CANONICAL")
            _validate_checks(root, checkpoint, completion["evidence"])
            guard.recheck()
            require(_review(root, reviewed_checkpoint, "verify_existing") == checkpoint and
                    _unit(root, checkpoint["completion"]) == completion, "REVIEW_DRIFT")
            _bound_state(root, artifact_path, acceptance_path, checkpoint, expected)
            require(fingerprint(protected_paths(root), [root / TARGET]) == before,
                    "M12_SURROUNDINGS_DRIFT")
            same_tree(root / TARGET, snapshot)
            return "VERIFIED_NO_CHANGE"


class _Run:
    """Private guarded verification owner; no public pending-bypass argument.

    Phase-A tests exercise its mechanics with inert files only. Runtime smoke
    and independent Codex activation still have to supply actual evidence.
    """

    def __init__(self, root, record, files):
        self.root, self.record, self.files = Path(root), record, files
        self.run_id = uuid.uuid4().hex
        self.run = self.root / STAGING / self.run_id
        self.path = self.run / "candidate"
        self.target = self.root / TARGET
        self.active = False
        self.guard = None
        self.stack = contextlib.ExitStack()
        self.checks = {}
        self.snapshot = None
        self.surroundings = None

    def __enter__(self):
        expected = expected_output_hashes(self.record)
        require(set(self.files) == set(expected) and
                all(isinstance(data, bytes) and sha(data) == expected[name]
                    for name, data in self.files.items()), "UNVALIDATED_PLACEMENT_PLAN")
        self.interpreter = host_check(self.root)
        # All pre-existing ancestors are checked before creation. Parents are
        # never created under discovery during Phase-A tests.
        base = self.root / STAGING
        require(base.parent.is_dir() and (self.root / TARGET).parent.is_dir(), "MISSING_APPROVED_ANCESTORS")
        self.surroundings = fingerprint(protected_paths(self.root), [self.target])
        try:
            self.guard = self.stack.enter_context(Guard(self.root, [base, self.target]))
            if not base.exists():
                base.mkdir()
            self.stack.enter_context(Guard(self.root, [self.run]))
            self.run.mkdir()
            self.guard = self.stack.enter_context(Guard(self.root, [self.path, self.target]))
            self.active = True
            return self
        except BaseException:
            self.stack.close()
            raise

    def stage(self):
        require(self.active and not self.path.exists(), "RUN_STATE")
        self.guard.recheck()
        self.check_surroundings()
        self.path.mkdir()
        value = receipt(self.files, self.record, self.run_id, self.interpreter)
        outputs = {**self.files, "installation.json": canonical(value) + b"\n"}
        try:
            for relative in sorted(ancestors(outputs), key=lambda p: (p.count("/"), p)):
                (self.path / relative).mkdir()
            for relative, data in outputs.items():
                safe_name(relative)
                with (self.path / relative).open("xb") as stream:
                    stream.write(data)
            self.snapshot = content_check(self.path, {p: sha(b) for p, b in outputs.items()})
            self.check_surroundings()
        except BaseException:
            # Preserve partial stage; never guess ownership of bytes on error.
            # A later cleanup needs the exact recorded identity/hash inventory.
            self.snapshot = None
            raise
        return self.snapshot

    def record_check(self, check, result):
        require(self.active and check in CHECKS and result == "PASS", "FAILED_OR_UNKNOWN_CHECK")
        self.guard.recheck()
        same_tree(self.path, self.snapshot)
        self.check_surroundings()
        self.checks[check] = result

    def check_surroundings(self):
        require(fingerprint(protected_paths(self.root), [self.target]) == self.surroundings,
                "SIBLING_OR_GLOBAL_DRIFT")

    def place(self):
        require(self.active and PREPLACEMENT <= set(self.checks), "MISSING_STAGED_CHECKS")
        same_tree(self.path, self.snapshot)
        self.check_surroundings()
        move_no_replace(self.root, self.path, self.target, self.snapshot["identity"])
        self.path = self.target
        same_tree(self.path, self.snapshot)
        self.check_surroundings()

    def complete(self):
        require(self.active and self.path == self.target and set(self.checks) == CHECKS,
                "INCOMPLETE_VERIFICATION")
        self.guard.recheck()
        same_tree(self.path, self.snapshot)
        self.check_surroundings()
        digest, self.snapshot = _transition_receipt(
            self.path, self.run_id, self.snapshot, self.guard, self.check_surroundings)
        return digest

    def quarantine(self):
        require(self.active and self.path == self.target, "RUN_STATE")
        same_tree(self.path, self.snapshot)
        destination = self.run / "quarantine"
        move_no_replace(self.root, self.path, destination, self.snapshot["identity"])
        self.path = destination
        return destination

    def __exit__(self, *args):
        self.active = False
        self.stack.close()


def replace_reviewed(root, old_path, old_snapshot, new_run, authorization):
    """Two-rename maintenance, not an atomic swap. No arbitrary previous path."""
    require(old_path == Path(root) / TARGET and new_run.root == Path(root), "UPDATE_SCOPE")
    required = {"oldTreeSha256", "oldRecordSha256", "newRecordSha256",
                "oldAcceptancePacketSha256", "newAcceptancePacketSha256",
                "rollbackAuthorized", "approvalReference"}
    require(isinstance(authorization, dict) and set(authorization) == required and
            authorization["rollbackAuthorized"] is True and
            isinstance(authorization["approvalReference"], str) and
            bool(authorization["approvalReference"].strip()), "UPDATE_AUTHORIZATION")
    require(authorization["oldTreeSha256"] == sha(canonical(old_snapshot)) and
            authorization["newRecordSha256"] == sha(canonical(new_run.record)), "UPDATE_HASH")
    require(new_run.active and PREPLACEMENT <= set(new_run.checks), "MISSING_STAGED_CHECKS")
    same_tree(old_path, old_snapshot)
    old_receipt = decode_json((old_path / "installation.json").read_bytes())
    require(old_receipt.get("artifactRecordSha256") == authorization["oldRecordSha256"],
            "OLD_RECORD_MISMATCH")
    require(old_receipt.get("acceptancePacketSha256") == authorization["oldAcceptancePacketSha256"] and
            new_run.record["acceptance"]["packetSha256"] == authorization["newAcceptancePacketSha256"],
            "UPDATE_ACCEPTANCE_MISMATCH")
    old_hashes = {p: row["sha256"] for p, row in old_snapshot["files"].items()
                  if p != "installation.json"}
    require(len(old_hashes) == 69 and old_receipt.get("files") == old_hashes,
            "OLD_CONTENT_MISMATCH")
    require(old_receipt["state"] == "verified" and set(old_receipt["checks"]) == CHECKS and
            all(v == "PASS" for v in old_receipt["checks"].values()), "OLD_NOT_VERIFIED")
    backup = new_run.run / "backup"
    move_no_replace(root, old_path, backup, old_snapshot["identity"])
    try:
        new_run.place()
    except BaseException:
        # Restore only into absence; racing target is never removed.
        restore_reviewed(root, backup, old_snapshot, authorization)
        raise
    return backup


def restore_reviewed(root, backup, old_snapshot, authorization):
    require(authorization.get("rollbackAuthorized") is True and
            authorization.get("oldTreeSha256") == sha(canonical(old_snapshot)), "ROLLBACK_AUTHORIZATION")
    require(Path(root) / STAGING in backup.parents and backup.name == "backup", "BACKUP_SCOPE")
    same_tree(backup, old_snapshot)
    return move_no_replace(root, backup, Path(root) / TARGET, old_snapshot["identity"])


def cleanup_owned(root, path, expected):
    """Bounded cleanup only after exact ownership/identity/hash comparison.

    No stale-run discovery or broad-root removal. Partial/unknown state must be
    preserved for review rather than turned into a permissive recursive delete.
    """
    path, root = Path(path), Path(root)
    require(root / STAGING in path.parents and path.name in ("candidate", "quarantine"),
            "CLEANUP_SCOPE")
    require(isinstance(expected, dict), "PARTIAL_STAGE_REQUIRES_REVIEW")
    with Guard(root, [path]) as guard:
        same_tree(path, expected)
        for name in sorted(expected["files"]):
            guard.recheck()
            child = path / name
            require(guard.api.inspect(child) == expected["files"][name]["identity"] and
                    sha(child.read_bytes()) == expected["files"][name]["sha256"], "CLEANUP_DRIFT")
            child.unlink()
        for name in sorted(expected["directories"], key=lambda p: (p.count("/"), p), reverse=True):
            (path / name).rmdir()
        require(guard.api.inspect(path) == expected["identity"], "CLEANUP_ROOT_DRIFT")
        path.rmdir()


def main(argv=None):
    parser = argparse.ArgumentParser(allow_abbrev=False)
    parser.add_argument("mode", choices=["verify-content", "install", "replace-reviewed"])
    parser.add_argument("--artifact")
    parser.add_argument("--acceptance")
    args = parser.parse_args(argv)
    root = Path(__file__).resolve().parents[2]
    if args.mode != "verify-content":
        # Phase A supplies deterministic mechanics; real orchestration/activation
        # is a later authorized task, never an implicit procurement entrypoint.
        raise Blocked("PRE_PROCUREMENT_CHECKPOINT: runtime orchestration awaits tasks 5.x")
    require(not args.artifact and not args.acceptance, "UNKNOWN_VERIFY_ARGUMENTS")
    record = read_record(root, root / RECORD)
    value = verify_receipt(root / TARGET, record)
    print(json.dumps({"content": "VERIFIED", "state": value["state"],
                      "receiptSha256": sha((root / TARGET / "installation.json").read_bytes())}))


if __name__ == "__main__":
    try:
        main()
    except (Blocked, OSError, ValueError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
