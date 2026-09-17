"""Inert YUTA fixtures only. No member is executed; no real artifact is read.

Windows tests create owned OS scratch directories, never the repository skill
target. Test doubles exercise receipt/parser mechanics, not installed-tool QA.
The environment regression also executes the validated Python with "-c pass".
"""

import base64
import copy
import ctypes
import gzip
import hashlib
import io
import json
import os
import re
import subprocess
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch, Mock

import bootstrap as b
import query


ROOT = Path(__file__).resolve().parents[2]
REAL = b.decode_json((ROOT / b.RECORD).read_bytes())


def fixtures():
    # Exactly 196 inert records, including all 67 fixed source path spellings.
    return {row["path"]: ("YUTA INERT " + str(i) + "\n").encode()
            for i, row in enumerate(REAL["inventory"])}


def archive(files=None, change=None, extra=None, format=tarfile.USTAR_FORMAT):
    files = fixtures() if files is None else files
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode="w", format=format) as tar:
        for index, (name, data) in enumerate(files.items()):
            item = tarfile.TarInfo(name)
            item.size = len(data)
            if change and index == 0:
                change(item)
            tar.addfile(item, io.BytesIO(data) if item.isreg() else None)
        if extra:
            item, data = extra
            tar.addfile(item, io.BytesIO(data) if item.isreg() else None)
    return gzip.compress(stream.getvalue(), mtime=0)


def inventory(files):
    return [{"path": p, "size": len(data), "sha256": b.sha(data)} for p, data in files.items()]


def parse(data, files=None, **overrides):
    files = fixtures() if files is None else files
    values = dict(inventory=inventory(files), compressed_bytes=len(data),
                  regular_bytes=sum(map(len, files.values())), expected_sha=b.sha(data),
                  sri="sha512-" + base64.b64encode(hashlib.sha512(data).digest()).decode())
    values.update(overrides)
    return b._archive(data, **values)


def synthetic_record():
    record = copy.deepcopy(REAL)
    files = fixtures()
    record["inventory"] = inventory(files)
    skill, notice = b"YUTA INERT ADAPTER\n", b"YUTA INERT NOTICE\n"
    record["localWrapperSha256"] = b.sha(skill)
    record["acceptance"]["noticeSha256"] = b.sha(notice)
    output = b._projection(files, record["projection"], skill, notice)
    return record, output


class ArchiveTests(unittest.TestCase):
    def test_exact_inert_inventory_and_projection(self):
        data = archive()
        files = parse(data)
        output = b._projection(files, REAL["projection"], b"adapter", b"notice")
        self.assertEqual(len(files), 196)
        self.assertEqual(len(output), 69)
        for row in REAL["projection"]:
            self.assertEqual(output[row["target"]], files[row["source"]])
        self.assertFalse(any(p.startswith("skills/") for p in output))

    def test_real_record_schema_and_acceptance(self):
        self.assertEqual(b.validate_record(REAL), REAL)
        self.assertEqual(len(REAL["projection"]), 67)
        self.assertEqual(len(REAL["inventory"]), 196)
        self.assertEqual(sum(p["target"].startswith("data/") for p in REAL["projection"]), 39)
        self.assertEqual(sum(p["target"].startswith("scripts/") for p in REAL["projection"]), 28)

    def test_notice_and_adapter_exact_bytes(self):
        self.assertEqual(b.sha((ROOT / "tooling/ui-ux-pro-max/NOTICE.md.template").read_bytes()),
                         "1c0d756bc8feeb1d6dd3dfffe9644f8f812581ae6cb53d6f06c50284bbb0451c")
        self.assertEqual(b.sha((ROOT / "tooling/ui-ux-pro-max/SKILL.md.template").read_bytes()),
                         REAL["localWrapperSha256"])

    def test_adapter_static_frontmatter_and_bounded_instructions(self):
        # Closed current template, not a general YAML parser or Codex activation.
        text = (ROOT / "tooling/ui-ux-pro-max/SKILL.md.template").read_text(encoding="utf-8")
        front, body = text.removeprefix("---\n").split("\n---\n", 1)
        lines = front.splitlines()
        self.assertEqual(lines[0], "name: ui-ux-pro-max")
        self.assertTrue(lines[1].startswith("description: "))
        self.assertTrue(0 < len(lines[1]) < 1024)
        self.assertEqual(lines[2:], ["metadata:", "  version: yuta-adapter-1"])
        self.assertFalse(re.search(r"[<>]|\[TODO:", front))
        for text in ["DESIGN_REFERENCE", "CONFLICT / NEEDS_REVIEW / STOP",
                     "NOT_APPLICABLE", "verified", "query.py", "Browser QA"]:
            self.assertIn(text, body)
        self.assertNotIn("allowed-tools:", front)
        self.assertNotIn("license:", front)

    def test_pinned_entrypoint_rejects_synthetic_artifact(self):
        with self.assertRaises(b.Blocked):
            b.verify_archive(archive(), REAL)

    def test_missing_inventory(self):
        files = fixtures()
        files.pop(next(iter(files)))
        with self.assertRaises(b.Blocked):
            parse(archive(files))

    def test_extra_inventory(self):
        files = fixtures()
        files["package/unexpected"] = b"inert"
        with self.assertRaises(b.Blocked):
            parse(archive(files))

    def test_entry_hash(self):
        files = fixtures()
        files[next(iter(files))] = b"different"
        with self.assertRaises(b.Blocked):
            parse(archive(files))

    def test_duplicate_member(self):
        name, data = next(iter(fixtures().items()))
        entry = tarfile.TarInfo(name)
        entry.size = len(data)
        with self.assertRaises(b.Blocked):
            parse(archive(extra=(entry, data)))

    def test_case_fold_collision(self):
        name, data = next(iter(fixtures().items()))
        entry = tarfile.TarInfo(name.upper())
        entry.size = len(data)
        with self.assertRaises(b.Blocked):
            parse(archive(extra=(entry, data)))

    def test_pax_override(self):
        def change(item):
            item.pax_headers = {"path": "package/override"}
        with self.assertRaises(b.Blocked):
            parse(archive(change=change, format=tarfile.PAX_FORMAT))

    def test_unknown_directory(self):
        entry = tarfile.TarInfo("package/sibling-created/")
        entry.type = tarfile.DIRTYPE
        with self.assertRaises(b.Blocked):
            parse(archive(extra=(entry, b"")))

    def test_explicit_known_ancestor(self):
        entry = tarfile.TarInfo("package/")
        entry.type = tarfile.DIRTYPE
        self.assertEqual(len(parse(archive(extra=(entry, b"")))), 196)

    def test_unknown_projection(self):
        projection = copy.deepcopy(REAL["projection"])
        projection[0]["target"] = "skills/banner-design/SKILL.md"
        with self.assertRaises(b.Blocked):
            b._projection(fixtures(), projection, b"inert", b"inert")

    def test_json_duplicates(self):
        with self.assertRaises(b.Blocked):
            b.decode_json(b'{"a":1,"a":2}')

    def test_json_nonfinite(self):
        with self.assertRaises(b.Blocked):
            b.decode_json(b'{"a":NaN}')

    def test_header_embedded_nul(self):
        raw = bytearray(gzip.decompress(archive()))
        raw[:100] = b"package/a\0hidden".ljust(100, b"\0")
        raw[148:156] = b"        "
        raw[148:156] = ("%06o\0 " % sum(raw[:512])).encode()
        with self.assertRaises(b.Blocked):
            parse(gzip.compress(raw, mtime=0))

    def test_unsupported_magic(self):
        raw = bytearray(gzip.decompress(archive()))
        raw[257:263] = b"other!"
        with self.assertRaises(b.Blocked):
            parse(gzip.compress(raw, mtime=0))

    def test_corrupt_header_checksum(self):
        raw = bytearray(gzip.decompress(archive()))
        raw[148:156] = b"000000\0 "
        with self.assertRaises(b.Blocked):
            parse(gzip.compress(raw, mtime=0))

    def test_truncated_terminator(self):
        raw = gzip.decompress(archive())
        with self.assertRaises(b.Blocked):
            parse(gzip.compress(raw.rstrip(b"\0"), mtime=0))


def path_attack(name):
    def test(self):
        with self.assertRaises(b.Blocked):
            b.safe_name(name)
        if "\0" not in name and all(ord(c) < 128 for c in name):
            def change(item):
                item.name = name
            with self.assertRaises(b.Blocked):
                parse(archive(change=change))
    return test


for label, name in {
    "absolute": "/outside", "drive": "C:/outside", "unc": "//server/share",
    "backslash": "package\\outside", "dot": "package/./file", "dotdot": "package/../file",
    "empty": "package//file", "ads": "package/file:stream", "nul": "package/nul\0suffix",
    "reserved_con": "package/CON.txt", "reserved_com": "package/com1",
    "reserved_lpt": "package/LPT9.csv", "reserved_superscript": "package/COM¹.txt",
    "trailing_dot": "package/file.", "trailing_space": "package/file ",
    "wildcard": "package/*.csv", "control": "package/\nfile",
}.items():
    setattr(ArchiveTests, "test_path_" + label, path_attack(name))


def type_attack(kind):
    def test(self):
        def change(item):
            item.type = kind
            item.size = 0
            if kind in (tarfile.SYMTYPE, tarfile.LNKTYPE):
                item.linkname = "package/other"
        with self.assertRaises(b.Blocked):
            parse(archive(change=change))
    return test


for label, kind in {"symlink": b"2", "hardlink": b"1", "device": b"3", "block_device": b"4",
                    "fifo": b"6", "sparse": b"S", "gnu_longname": b"L", "pax": b"x",
                    "global_pax": b"g", "unsupported": b"9"}.items():
    setattr(ArchiveTests, "test_type_" + label, type_attack(kind))


def record_attack(field, value):
    def test(self):
        record = copy.deepcopy(REAL)
        if value is None:
            record.pop(field)
        else:
            record[field] = value
        with self.assertRaises(b.Blocked):
            b.validate_record(record)
    return test


for label, field, value in [
    ("missing_acceptance", "acceptance", None), ("unaccepted", "licenseProvenance", "UNCERTAIN"),
    ("wrong_identity", "npmName", "other"), ("wrong_version", "npmVersion", "latest"),
    ("wrong_sri", "npmIntegrity", "sha512-invalid"), ("wrong_sha", "tarballSha256", "0" * 64),
    ("unknown_schema_field", "unknown", True), ("wrong_inventory", "inventory", []),
    ("wrong_projection", "projection", []), ("wrong_type", "schemaVersion", True),
]:
    setattr(ArchiveTests, "test_record_" + label, record_attack(field, value))


def digest_attack(field, value):
    def test(self):
        with self.assertRaises(b.Blocked):
            parse(archive(), **{field: value})
    return test


for label, field, value in [("sha", "expected_sha", "0" * 64), ("sri", "sri", "sha512-no"),
                            ("size", "compressed_bytes", 1), ("expanded_bound", "regular_bytes", 1)]:
    setattr(ArchiveTests, "test_digest_" + label, digest_attack(field, value))


class WindowsTests(unittest.TestCase):
    def setUp(self):
        # User-authorized owned OS scratch; no production/repository target.
        # Same NTFS volume as the intended repository; outside its discovery
        # roots. The default C: temp chain may have unsupported service owners.
        self.scratch = tempfile.TemporaryDirectory(prefix=".tmp-yuta-phase-a-", dir=ROOT.parent)
        self.root = Path(self.scratch.name).resolve()
        b.host_check(self.root)  # unsupported host is FAIL, not a silent skip
        (self.root / ".agents/skills").mkdir(parents=True)
        (self.root / ".yuta-tooling").mkdir()
        # Synthetic global/sibling fixtures, never real user config mutation.
        self.protected = patch.object(b, "protected_paths", return_value=[
            self.root / ".agents/skills", self.root / "inert-global-config"])
        self.protected.start()
        self.addCleanup(self.protected.stop)

    def tearDown(self):
        # All test writes are YUTA-created inert fixture directories. Test-added
        # junctions are unlinked in their own finally block before this cleanup.
        self.assertEqual(self.root.parent, ROOT.parent.resolve())
        self.assertTrue(self.root.name.startswith(".tmp-yuta-phase-a-"))
        self.assertFalse(self.root.is_symlink())
        self.scratch.cleanup()

    def test_actual_no_replace(self):
        source, target = self.root / "source", self.root / "target"
        source.mkdir()
        (source / "inert.txt").write_bytes(b"YUTA inert fixture")
        before = b.tree_snapshot(source)
        b.move_no_replace(self.root, source, target, before["identity"])
        self.assertFalse(source.exists())
        b.same_tree(target, before)

    def test_existing_target_preserved(self):
        source, target = self.root / "source", self.root / "target"
        source.mkdir()
        target.mkdir()
        (target / "competing.txt").write_bytes(b"YUTA competing fixture")
        before = b.tree_snapshot(target)
        with self.assertRaises(b.Blocked):
            b.move_no_replace(self.root, source, target, b.Windows().inspect(source))
        b.same_tree(target, before)
        self.assertTrue(source.exists())

    def test_wrapper_target_race_preserves_competitor(self):
        source, target = self.root / "source", self.root / "target"
        source.mkdir()
        api = b.Windows()
        original = api.k.MoveFileExW
        def race(src, dst, flags):
            self.assertEqual(flags, 0)
            target.mkdir()
            (target / "inert-competitor").write_bytes(b"YUTA competing fixture")
            return original(src, dst, flags)
        expected = api.inspect(source)
        with patch.object(b, "Windows", return_value=api), patch.object(api.k, "MoveFileExW", side_effect=race):
            with self.assertRaises(b.Blocked):
                b.move_no_replace(self.root, source, target, expected)
        self.assertEqual((target / "inert-competitor").read_bytes(), b"YUTA competing fixture")
        self.assertTrue(source.exists())

    def test_actual_target_race_at_primitive(self):
        source, target = self.root / "source", self.root / "target"
        source.mkdir()
        with b.Guard(self.root, [source, target]) as guard:
            self.assertFalse(target.exists())
            target.mkdir()  # competing creator after preflight
            (target / "competing.txt").write_bytes(b"YUTA competing fixture")
            before = b.tree_snapshot(target)
            self.assertFalse(guard.api.k.MoveFileExW(str(source), str(target), 0))
            self.assertNotEqual(ctypes.get_last_error(), 0)
            b.same_tree(target, before)
            self.assertTrue(source.exists())

    def test_guard_prevents_ancestor_rename(self):
        parent = self.root / "parent"
        parent.mkdir()
        with b.Guard(self.root, [parent / "target"]) as guard:
            self.assertFalse(guard.api.k.MoveFileExW(str(parent), str(self.root / "moved"), 0))
            guard.recheck()

    def test_outside_root(self):
        with self.assertRaises(b.Blocked):
            with b.Guard(self.root, [self.root.parent / "outside"]):
                self.fail("must not acquire")

    def test_unknown_owner(self):
        api = b.Windows()
        api.owners = set()
        with self.assertRaises(b.Blocked):
            api.inspect(self.root)

    def test_unsupported_filesystem(self):
        api = b.Windows()
        with patch.object(api.k, "GetDriveTypeW", return_value=4):
            with self.assertRaises(b.Blocked):
                api.volume(self.root)

    def test_python_missing(self):
        with self.assertRaises(b.Blocked):
            b.host_check(self.root, self.root / "missing-python.exe")

    def test_other_executable_cannot_borrow_current_version(self):
        path = self.root / "inert-not-python.exe"
        path.write_bytes(b"YUTA inert non executable")
        with self.assertRaisesRegex(b.Blocked, "PYTHON_IDENTITY_DRIFT"):
            b.host_check(self.root, path)

    def test_unsupported_host(self):
        with patch.object(b.os, "name", "posix"):
            with self.assertRaises(b.Blocked):
                b.host_check(self.root)

    def test_closed_guard(self):
        with b.Guard(self.root, [self.root / "target"]) as guard:
            pass
        with self.assertRaises(b.Blocked):
            guard.recheck()

    def test_reparse_guard(self):
        # A real directory junction made through FSCTL_SET_REPARSE_POINT,
        # not cmd/mklink or a symlink privilege escalation.
        junction, destination = self.root / "junction", self.root / "destination"
        junction.mkdir()
        destination.mkdir()
        import struct
        substitute = ("\\??\\" + str(destination)).encode("utf-16-le")
        printable = str(destination).encode("utf-16-le")
        names = substitute + b"\0\0" + printable + b"\0\0"
        data = struct.pack("<IHHHHHH", 0xA0000003, 8 + len(names), 0,
                           0, len(substitute), len(substitute) + 2, len(printable)) + names
        api = b.Windows()
        api.k.DeviceIoControl.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.c_void_p,
                                         ctypes.c_uint32, ctypes.c_void_p, ctypes.c_uint32,
                                         ctypes.POINTER(ctypes.c_uint32), ctypes.c_void_p]
        api.k.DeviceIoControl.restype = ctypes.c_int
        handle = api.k.CreateFileW(str(junction), 0x40000000, 0, None, 3, 0x02200000, None)
        self.assertNotEqual(handle, ctypes.c_void_p(-1).value)
        try:
            returned = ctypes.c_uint32()
            buf = ctypes.create_string_buffer(data)
            self.assertTrue(api.k.DeviceIoControl(handle, 0x900A4, buf, len(data), None, 0,
                                                 ctypes.byref(returned), None))
        finally:
            api.k.CloseHandle(handle)
        try:
            with self.assertRaises(b.Blocked):
                with b.Guard(self.root, [junction / "child"]):
                    self.fail("reparse must fail")
        finally:
            junction.rmdir()  # remove only the test-owned junction, not destination
        self.assertTrue(destination.exists())

    def test_fixed_stage_seventy_and_pending_denial(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            self.assertEqual(len(run.snapshot["files"]), 70)
            self.assertFalse(run.target.exists())
            with patch.object(b, "validate_record", side_effect=lambda r: r):
                with self.assertRaisesRegex(b.Blocked, "PENDING_DENIED"):
                    b.verify_receipt(run.path, record)
                self.assertEqual(b.verify_receipt(run.path, record, verification=run)["state"], "pending")

    def test_completion_requires_all_checks_and_placement(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            with self.assertRaises(b.Blocked):
                run.complete()
            with self.assertRaises(b.Blocked):
                run.place()
            for name in b.PREPLACEMENT:
                run.record_check(name, "PASS")
            run.place()
            with self.assertRaises(b.Blocked):
                run.complete()
            for name in b.CHECKS - b.PREPLACEMENT:
                run.record_check(name, "PASS")
            receipt_hash = run.complete()
            self.assertEqual(receipt_hash, b.sha((run.target / "installation.json").read_bytes()))
            with patch.object(b, "validate_record", side_effect=lambda r: r):
                self.assertEqual(b.verify_receipt(run.target, record)["state"], "verified")
            self.assertEqual(len(run.snapshot["files"]), 70)

    def test_quarantine_preserves_owned_complete_tree(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            for name in b.PREPLACEMENT:
                run.record_check(name, "PASS")
            run.place()
            path = run.quarantine()
            self.assertFalse(run.target.exists())
            b.same_tree(path, run.snapshot)

    def test_concurrent_quarantine_denied(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            for name in b.PREPLACEMENT:
                run.record_check(name, "PASS")
            run.place()
            (run.target / "other.txt").write_bytes(b"YUTA concurrent fixture")
            before = b.tree_snapshot(run.target)
            with self.assertRaises(b.Blocked):
                run.quarantine()
            b.same_tree(run.target, before)

    def test_partial_stage_not_placeable(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            original = Path.open
            def fail_open(path, *args, **kwargs):
                if path.name == "SKILL.md":
                    raise OSError("YUTA injected disk write failure")
                return original(path, *args, **kwargs)
            with patch.object(Path, "open", fail_open):
                with self.assertRaises(OSError):
                    run.stage()
            self.assertIsNone(run.snapshot)
            self.assertFalse(run.target.exists())
            with self.assertRaises(b.Blocked):
                run.place()
            with self.assertRaises(b.Blocked):
                b.cleanup_owned(self.root, run.path, run.snapshot)

    def test_hidden_and_sibling_output_rejected(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            extra = run.path / ".hidden-sibling"
            extra.mkdir()
            with self.assertRaises(b.Blocked):
                b.same_tree(run.path, run.snapshot)
            self.assertFalse(run.target.exists())

    def test_sibling_drift_before_stage_preserved(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            other = self.root / ".agents/skills/inert-sibling"
            other.mkdir()
            with self.assertRaisesRegex(b.Blocked, "SIBLING_OR_GLOBAL_DRIFT"):
                run.stage()
            self.assertFalse(run.path.exists())
            self.assertTrue(other.exists())

    def test_global_drift_before_placement_preserved(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            for name in b.PREPLACEMENT:
                run.record_check(name, "PASS")
            other = self.root / "inert-global-config"
            other.write_bytes(b"YUTA concurrent global fixture")
            with self.assertRaisesRegex(b.Blocked, "SIBLING_OR_GLOBAL_DRIFT"):
                run.place()
            self.assertFalse(run.target.exists())
            self.assertEqual(other.read_bytes(), b"YUTA concurrent global fixture")

    def test_unvalidated_output_plan_makes_no_stage(self):
        record, files = synthetic_record()
        files["../../outside"] = files.pop("SKILL.md")
        with self.assertRaises(b.Blocked):
            with b._Run(self.root, record, files):
                self.fail("bad plan")
        self.assertFalse((self.root / b.STAGING).exists())

    def test_cleanup_only_exact_owned_candidate(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            b.cleanup_owned(self.root, run.path, run.snapshot)
            self.assertFalse(run.path.exists())
            self.assertTrue(run.run.exists())

    def test_cleanup_unknown_state_preserved(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            (run.path / "unexpected").write_bytes(b"YUTA concurrent fixture")
            before = b.tree_snapshot(run.path)
            with self.assertRaises(b.Blocked):
                b.cleanup_owned(self.root, run.path, run.snapshot)
            b.same_tree(run.path, before)

    def test_pending_query_denies_before_spawn_and_scratch(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            args = query.arguments(BASE)
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query.subprocess, "run") as spawn, patch.object(query.tempfile, "mkdtemp") as scratch:
                with self.assertRaisesRegex(b.Blocked, "PENDING_DENIED"):
                    query._execute(args, self.root, record, run.path)
                spawn.assert_not_called()
                scratch.assert_not_called()

    def _verified_run(self):
        record, files = synthetic_record()
        run = b._Run(self.root, record, files)
        run.__enter__()
        run.stage()
        for name in b.PREPLACEMENT:
            run.record_check(name, "PASS")
        run.place()
        for name in b.CHECKS - b.PREPLACEMENT:
            run.record_check(name, "PASS")
        run.complete()
        return run

    def test_query_verified_drift_denies_before_spawn(self):
        run = self._verified_run()
        try:
            (run.path / "SKILL.md").write_bytes(b"YUTA drift")
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query.subprocess, "run") as spawn:
                with self.assertRaises(b.Blocked):
                    query._execute(query.arguments(BASE), self.root, run.record, run.path)
                spawn.assert_not_called()
        finally:
            run.__exit__()

    def test_query_sanitized_spawn_spy_and_no_outputs(self):
        run = self._verified_run()
        try:
            def inert_spy(command, **kwargs):
                self.assertEqual(command[1:4], ["-B", "-E", "-s"])
                self.assertTrue(Path(command[0]).is_absolute())
                self.assertEqual(command[-1], "--json")
                self.assertIs(kwargs["shell"], False)
                self.assertNotIn("PYTHONPATH", kwargs["env"])
                self.assertEqual(set(kwargs["env"]),
                                 {"SystemRoot", "WINDIR", "SystemDrive", "TEMP", "TMP"})
                self.assertRegex(kwargs["env"]["SystemDrive"], r"^[A-Za-z]:\\$")
                self.assertNotIn("PYTHONHOME", kwargs["env"])
                self.assertEqual(Path(kwargs["env"]["TEMP"]), kwargs["cwd"])
                return subprocess.CompletedProcess(command, 0, b'{"results":["YUTA inert spy"]}', b"")
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query, "_global_paths", return_value=[]), patch.object(query.subprocess, "run", side_effect=inert_spy) as spawn:
                output, evidence = query._execute(query.arguments(BASE), self.root, run.record, run.path)
                self.assertEqual(output["results"], ["YUTA inert spy"])
                self.assertEqual(evidence["exitCode"], 0)
                self.assertTrue(evidence["scratchEmpty"])
                self.assertFalse(Path(evidence["scratchPath"]).exists())
                spawn.assert_called_once()
        finally:
            run.__exit__()

    def test_environment_closed_allowlist_ignores_parent_injection(self):
        expected = query._query_environment(self.root)
        injected = {key: "YUTA_TEST_SENTINEL" for key in (
            "SystemRoot", "WINDIR", "SystemDrive", "ProgramData", "LOCALAPPDATA",
            "APPDATA", "USERPROFILE", "HOME", "PATH", "PYTHONPATH", "PYTHONHOME",
            "VIRTUAL_ENV", "AWS_SECRET_ACCESS_KEY", "OPENAI_API_KEY", "DATABASE_URL")}
        with patch.dict(os.environ, injected, clear=True):
            actual = query._query_environment(self.root)
        self.assertEqual(actual, expected)
        self.assertEqual(set(actual),
                         {"SystemRoot", "WINDIR", "SystemDrive", "TEMP", "TMP"})
        self.assertNotIn("YUTA_TEST_SENTINEL", actual.values())
        self.assertNotIn("ProgramData", actual)  # B3 resolved without B4.
        self.assertEqual(actual["TEMP"], str(self.root))
        self.assertEqual(actual["TMP"], str(self.root))

    def test_system_drive_is_resolved_absolute_root(self):
        env = query._query_environment(self.root)
        self.assertRegex(env["SystemDrive"], r"^[A-Za-z]:\\$")
        self.assertTrue(Path(env["SystemDrive"]).is_absolute())
        self.assertTrue(Path(env["SystemDrive"]).is_dir())
        self.assertEqual(Path(env["SystemRoot"]).anchor, env["SystemDrive"])
        self.assertEqual(env["SystemRoot"], env["WINDIR"])
        self.assertFalse(any("%" in env[key] for key in
                             ("SystemRoot", "WINDIR", "SystemDrive")))

    def test_windows_path_unknown_fails_closed(self):
        with patch.object(query, "_windows_directory", side_effect=b.Blocked("WINDOWS_DIRECTORY_UNKNOWN")):
            with self.assertRaisesRegex(b.Blocked, "WINDOWS_DIRECTORY_UNKNOWN"):
                query._query_environment(self.root)

    def test_invalid_windows_paths_fail_closed(self):
        for value in ("", "%SystemDrive%\\Windows", "C:Windows", "\\Windows",
                      "\\\\server\\share\\Windows", "C:/Windows", "C:\\..\\Windows",
                      "C:\\Windows\\", "C:\\Windows:stream", "C:\\"):
            with self.subTest(value=value), patch.object(query, "_windows_directory", return_value=value):
                with self.assertRaises(b.Blocked):
                    query._query_environment(self.root)

    def test_missing_windows_directory_fails_closed(self):
        missing = str(self.root / "missing-windows")
        with patch.object(query, "_windows_directory", return_value=missing):
            with self.assertRaisesRegex(b.Blocked, "WINDOWS_DIRECTORY_MISSING"):
                query._query_environment(self.root)

    def test_invalid_environment_denied_before_query_spawn(self):
        run = self._verified_run()
        try:
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query, "_global_paths", return_value=[]), patch.object(query, "_windows_directory", return_value="%SystemDrive%\\Windows"), patch.object(query.subprocess, "run") as spawn:
                with self.assertRaises(b.Blocked):
                    query._execute(query.arguments(BASE), self.root, run.record, run.path)
                spawn.assert_not_called()
            self.assertFalse(list((self.root / b.STAGING).glob("query-*")))
        finally:
            run.__exit__()

    def test_actual_windows_python_environment_leaves_scratch_empty(self):
        cwd = self.root / "environment-smoke"
        cwd.mkdir()
        before = b.tree_snapshot(cwd)
        host = b.host_check(self.root)
        env = query._query_environment(cwd)
        result = subprocess.run([host["path"], "-B", "-E", "-s", "-c", "pass"],
                                cwd=cwd, env=env, shell=False, capture_output=True,
                                timeout=60, check=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, b"")
        self.assertEqual(result.stderr, b"")
        # Assert before any fixture cleanup; never erase output to manufacture PASS.
        b.same_tree(cwd, before)
        self.assertEqual(list(cwd.iterdir()), [])

    def test_query_transient_output_is_blocked_and_preserved(self):
        run = self._verified_run()
        created = []
        try:
            def inert_spy(command, **kwargs):
                output = kwargs["cwd"] / "MASTER.md"
                output.write_bytes(b"YUTA inert forbidden output")
                created.append(output)
                return subprocess.CompletedProcess(command, 0, b"{}", b"")
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query, "_global_paths", return_value=[]), patch.object(query.subprocess, "run", side_effect=inert_spy):
                with self.assertRaisesRegex(b.Blocked, "UNEXPECTED_QUERY_OUTPUT"):
                    query._execute(query.arguments(BASE), self.root, run.record, run.path)
            self.assertEqual(created[0].read_bytes(), b"YUTA inert forbidden output")
        finally:
            run.__exit__()

    def test_query_failure_records_actual_exit_and_hashes(self):
        run = self._verified_run()
        try:
            result = subprocess.CompletedProcess([], 7, b"YUTA failed output", b"YUTA error")
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query, "_global_paths", return_value=[]), patch.object(query.subprocess, "run", return_value=result):
                with self.assertRaises(query.QueryFailure) as caught:
                    query._execute(query.arguments(BASE), self.root, run.record, run.path)
                evidence = caught.exception.evidence
                self.assertEqual(evidence["exitCode"], 7)
                self.assertEqual(evidence["stdoutSha256"], b.sha(result.stdout))
                self.assertEqual(evidence["stderrSha256"], b.sha(result.stderr))
                self.assertFalse(evidence["timedOut"])
        finally:
            run.__exit__()

    def test_query_timeout_records_unknown_exit_and_rechecks(self):
        run = self._verified_run()
        try:
            timeout = subprocess.TimeoutExpired("YUTA inert command", 60, output=b"YUTA partial")
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query, "_global_paths", return_value=[]), patch.object(query.subprocess, "run", side_effect=timeout):
                with self.assertRaises(query.QueryFailure) as caught:
                    query._execute(query.arguments(BASE), self.root, run.record, run.path)
                self.assertIsNone(caught.exception.evidence["exitCode"])
                self.assertTrue(caught.exception.evidence["timedOut"])
                b.same_tree(run.path, run.snapshot)
        finally:
            run.__exit__()

    def test_receipt_unknown_key_and_missing_check_denied(self):
        run = self._verified_run()
        try:
            path = run.path / "installation.json"
            original = path.read_bytes()
            with patch.object(b, "validate_record", side_effect=lambda r: r):
                for key in ["unknown", "checks", "files", "state"]:
                    value = b.decode_json(original)
                    value[key] = {} if key in ("checks", "files") else "invalid"
                    path.write_bytes(b.canonical(value))
                    with self.assertRaises(b.Blocked):
                        b.verify_receipt(run.path, run.record)
            path.write_bytes(original)
        finally:
            run.__exit__()

    def test_reviewed_update_and_exact_restore(self):
        old = self._verified_run()
        old_snapshot = old.snapshot
        old.__exit__()
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as new:
            new.stage()
            for name in b.PREPLACEMENT:
                new.record_check(name, "PASS")
            auth = {"oldTreeSha256": b.sha(b.canonical(old_snapshot)),
                    "oldRecordSha256": b.sha(b.canonical(old.record)),
                    "newRecordSha256": b.sha(b.canonical(record)),
                    "oldAcceptancePacketSha256": old.record["acceptance"]["packetSha256"],
                    "newAcceptancePacketSha256": record["acceptance"]["packetSha256"],
                    "rollbackAuthorized": True, "approvalReference": "YUTA inert test approval"}
            bad = dict(auth, rollbackAuthorized=False)
            with self.assertRaises(b.Blocked):
                b.replace_reviewed(self.root, old.target, old_snapshot, new, bad)
            b.same_tree(old.target, old_snapshot)
            for field in ["oldTreeSha256", "oldRecordSha256", "newRecordSha256",
                          "oldAcceptancePacketSha256", "newAcceptancePacketSha256"]:
                with self.assertRaises(b.Blocked):
                    b.replace_reviewed(self.root, old.target, old_snapshot, new, dict(auth, **{field: "0" * 64}))
                b.same_tree(old.target, old_snapshot)
            backup = b.replace_reviewed(self.root, old.target, old_snapshot, new, auth)
            b.same_tree(backup, old_snapshot)
            self.assertEqual(b.decode_json((new.target / "installation.json").read_bytes())["state"], "pending")
            new.quarantine()
            b.restore_reviewed(self.root, backup, old_snapshot, auth)
            b.same_tree(old.target, old_snapshot)

    def test_rollback_unknown_state_preserved(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            backup = run.run / "backup"
            b.move_no_replace(self.root, run.path, backup, run.snapshot["identity"])
            auth = {"rollbackAuthorized": True, "oldTreeSha256": b.sha(b.canonical(run.snapshot))}
            (backup / "concurrent.txt").write_bytes(b"YUTA concurrent fixture")
            before = b.tree_snapshot(backup)
            with self.assertRaises(b.Blocked):
                b.restore_reviewed(self.root, backup, run.snapshot, auth)
            b.same_tree(backup, before)

    def test_rollback_racing_target_preserved(self):
        record, files = synthetic_record()
        with b._Run(self.root, record, files) as run:
            run.stage()
            backup = run.run / "backup"
            b.move_no_replace(self.root, run.path, backup, run.snapshot["identity"])
            run.target.mkdir()
            (run.target / "inert-competitor").write_bytes(b"YUTA competing fixture")
            before = b.tree_snapshot(run.target)
            auth = {"rollbackAuthorized": True, "oldTreeSha256": b.sha(b.canonical(run.snapshot))}
            with self.assertRaises(b.Blocked):
                b.restore_reviewed(self.root, backup, run.snapshot, auth)
            b.same_tree(run.target, before)
            b.same_tree(backup, run.snapshot)


class ResumeTests(unittest.TestCase):
    """Real Win32 guards/receipt writes on inert OS-temp fixtures only.

    Only the production artifact pin and child execution are substituted.
    Archive parsing, evidence loading, identities, lease, transition and M12
    run normally. Synthetic approvals are not approvals for the real target.
    """

    tearDown = WindowsTests.tearDown

    def setUp(self):
        WindowsTests.setUp(self)
        pin = patch.object(b, "validate_record", side_effect=lambda value: value)
        pin.start()
        self.addCleanup(pin.stop)
        self.record, self.files = synthetic_record()
        self.artifact = self.root / b.STAGING / "artifacts/inert.tgz"
        self.artifact.parent.mkdir(parents=True)
        raw = archive()
        self.artifact.write_bytes(raw)
        self.record.update(tarballSha256=b.sha(raw), compressedBytes=len(raw),
                           regularBytes=sum(map(len, fixtures().values())),
                           npmIntegrity="sha512-" + base64.b64encode(hashlib.sha512(raw).digest()).decode())
        for name in b._SOURCE_PATHS | {str(b._TASKS), str(b.RECORD),
                    "docs/reviews/ui-ux-pro-max-integration/02b-design-review.md",
                    "docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md"}:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b"YUTA INERT SOURCE\n")
        packet = self.root / self.record["acceptance"]["packet"]
        self.record["acceptance"]["packetSha256"] = b.sha(packet.read_bytes())
        self.acceptance = self.root / b.RECORD
        self.acceptance.write_bytes(json.dumps(self.record, indent=2).encode())
        for name, data in [("SKILL.md", self.files["SKILL.md"]), ("NOTICE.md", self.files["NOTICE.md"])]:
            (self.acceptance.parent / (name + ".template")).write_bytes(data)
        with b._Run(self.root, self.record, self.files) as run:
            run.stage()
            for name in b.PREPLACEMENT:
                run.record_check(name, "PASS")
            run.place()
            self.run_id, self.snapshot = run.run_id, run.snapshot
        self.target = self.root / b.TARGET
        self.original = (self.target / "installation.json").read_bytes()
        paths = {self.acceptance, self.artifact, self.root / b._TASKS,
                 self.root / b._CHANGE / "design.md", self.target / "installation.json",
                 self.root / "docs/reviews/ui-ux-pro-max-integration/02b-design-review.md", packet,
                 self.root / b.STAGING / self.run_id / "candidate",
                 self.root / b.STAGING / self.run_id / "quarantine"}
        for path in list(paths):
            paths.update(path.parents)
        api = b.Windows()
        identities = {}
        for path in paths:
            key = os.path.normcase(str(path))
            row = {"normalizedAbsolutePath": key}
            if path.exists():
                row.update(type="DIRECTORY" if path.is_dir() else "FILE", identity=api.inspect(path))
                if path.is_file():
                    row["sha256"] = b.sha(path.read_bytes())
            else:
                row.update(type="ABSENT", nearestExistingParent=os.path.normcase(str(path.parent)),
                           nearestParentIdentity=api.inspect(path.parent), intendedFinalComponent=path.name,
                           missingRelativePathFromNearestParent=path.name, parentPath=os.path.normcase(str(path.parent)),
                           containment="WITHIN_REPOSITORY", existingAncestorChainReparse=False,
                           absenceVerifiedBefore=True, absenceVerifiedAfter=True,
                           existingAncestorChain=[os.path.normcase(str(p)) for p in
                                                  [*reversed(path.parent.parents), path.parent]])
            identities[key] = row
        self.baseline = {"identityMap": identities, "identityMapSha256": b.sha(b.canonical(identities)),
                         "beforeAfterIdentityMapEqual": True, "captureStartedUtc": "2026-09-09T00:00:00Z",
                         "captureCompletedUtc": "2026-09-09T00:00:01Z", "historicalRunDirectoryIdentity": "NOT_RECORDED",
                         "originalRunCurrentState": "EXISTING_EXACT", "candidateCurrentState": "ABSENT",
                         "quarantineCurrentState": "ABSENT", "receiptRunId": self.run_id,
                         "receiptSha256": b.sha(self.original), "targetSnapshotSha256": b.sha(b.canonical(self.snapshot))}
        self.checkpoint = {"mode": "resume_pending", "root": str(self.root),
                           "artifactPath": self.artifact.relative_to(self.root).as_posix(),
                           "acceptancePath": b.RECORD.as_posix(), "runId": self.run_id,
                           "recordRawSha256": b.sha(self.acceptance.read_bytes()),
                           "recordCanonicalSha256": b.sha(b.canonical(self.record)),
                           "pendingReceiptSha256": b.sha(self.original), "targetSnapshot": self.snapshot,
                           "baseline": None, "m11": None, "completion": None,
                           "protectedFiles": {p: b.sha((self.root / p).read_bytes()) for p in b._SOURCE_PATHS},
                           "surroundings": b.fingerprint(b.protected_paths(self.root), [self.target]),
                           "interpreter": b.host_check(self.root)}
        binary = self.root / "inert-codex.exe"
        binary.write_bytes(b"INERT DATA NEVER EXECUTED")
        self.m11 = {"result": "PASS", "environment": self.checkpoint["surroundings"],
                    "binary": {"path": str(binary), "version": "codex-cli inert", "sha256": b.sha(binary.read_bytes())},
                    "argv": [str(binary), "exec", "--sandbox", "read-only", "--ephemeral", "--json",
                             "--color", "never", "-c", 'approval_policy="never"', "-c", "notify=[]", "-C", str(self.root), "-"],
                    "threadId": "00000000-0000-0000-0000-000000000001", "ephemeral": True,
                    "promptSha256": "1" * 64, "transcriptSha256": "2" * 64, "exitCode": 0,
                    "observations": {key: "PASS" for key in "ABCDEFG"},
                    "artifactRecordSha256": self.checkpoint["recordCanonicalSha256"],
                    "protectedFilesSha256": b.sha(b.canonical(self.checkpoint["protectedFiles"]))}
        self.completion = None
        self._persist()

    def _persist(self, approval_override=None):
        chunks = []
        def unit(marker, value):
            raw = b"```json\n" + b.canonical(value) + b"\n```\n"
            chunks.append(f"<!-- {marker}_BEGIN -->\n".encode() + raw + f"<!-- {marker}_END -->\n".encode())
            return {"marker": marker, "sha256": b.sha(raw)}
        self.checkpoint["baseline"] = unit("CURRENT_RESUME_IDENTITY_BASELINE", self.baseline)
        self.checkpoint["m11"] = unit("INERT_M11", self.m11)
        if self.completion is not None:
            self.checkpoint["completion"] = unit("INERT_COMPLETION", self.completion)
        cp = unit("INERT_RESUME_CHECKPOINT", self.checkpoint)
        approval = {"source": "explicit Control Tower approval", "decision": "APPROVED",
                    "operation": self.checkpoint["mode"], "checkpointSha256": cp["sha256"],
                    "baselineSha256": self.checkpoint["baseline"]["sha256"], "m11Sha256": self.checkpoint["m11"]["sha256"],
                    "environmentSha256": b.sha(b.canonical(self.checkpoint["surroundings"])),
                    "protectedFilesSha256": b.sha(b.canonical(self.checkpoint["protectedFiles"]))}
        if approval_override:
            approval.update(approval_override)
        self.reference = {"checkpoint": cp, "approval": unit("INERT_CONTROL_TOWER_APPROVAL", approval)}
        (self.root / b._TASKS).write_bytes(b"\n".join(chunks))

    def _resume(self):
        return b.resume_pending(self.root, self.artifact, self.acceptance, self.reference)

    def _assert_denied(self, reason=None):
        with self.assertRaisesRegex(b.Blocked, reason or ".*"):
            with self._resume():
                self.fail("Invalid checkpoint entered private verification")
        self.assertEqual((self.target / "installation.json").read_bytes(), self.original)

    def _spawn(self, command, **kwargs):
        self.assertFalse(kwargs["shell"])
        if "unittest" in command:
            return subprocess.CompletedProcess(command, 0, b"", b"\nRan 127 tests in 0.1s\n\nOK\n")
        return subprocess.CompletedProcess(command, 0, b'{"results":["INERT"]}', b"")

    def _completed(self):
        with patch.object(query, "_global_paths", return_value=[]), patch.object(subprocess, "run", side_effect=self._spawn):
            with self._resume() as owner:
                self.completion = owner._complete()
        self.checkpoint["mode"] = "verify_existing"
        self._persist()

    def _m12(self):
        return b.verify_existing(self.root, self.artifact, self.acceptance, self.reference)

    def test_current_baseline_authorized_context_and_expiry(self):
        with self._resume() as owner:
            self.assertNotIsInstance(owner, b._Run)
            self.assertEqual(owner.run_id, self.run_id)
            self.assertTrue(b._owns_resume(owner))
            b.verify_receipt(self.target, self.record, verification=owner)
            with self.assertRaisesRegex(b.Blocked, "PENDING_DENIED"):
                b.verify_receipt(self.target, self.record)
        self.assertFalse(b._owns_resume(owner))
        with self.assertRaises(b.Blocked):
            b.verify_receipt(self.target, self.record, verification=owner)

    def test_direct_or_fabricated_resume_context_denied(self):
        with self.assertRaises(b.Blocked):
            b._Resume()
        forged = object.__new__(b._Resume)
        forged.active, forged.path, forged.run_id = True, self.target, self.run_id
        with self.assertRaisesRegex(b.Blocked, "PENDING_DENIED"):
            b.verify_receipt(self.target, self.record, verification=forged)

    def test_m11_fail_despite_correct_artifact_and_a_to_g(self):
        self.m11["result"] = "FAIL"
        self._persist()
        self._assert_denied("M11_NOT_PASS")

    def test_m11_needs_review(self):
        self.m11["result"] = "NEEDS_REVIEW"
        self._persist()
        self._assert_denied("M11_NOT_PASS")

    def test_m11_pass_without_explicit_approval(self):
        self._persist({"decision": "APPROVED_WITH_ACCEPTED_PROCEDURAL_DEVIATION"})
        self._assert_denied("RESUME_NOT_AUTHORIZED")

    def test_m11_approval_wrong_unit(self):
        self._persist({"m11Sha256": "0" * 64})
        self._assert_denied("APPROVAL_BINDING")

    def test_m11_evidence_hash_drift(self):
        path = self.root / b._TASKS
        path.write_bytes(path.read_bytes().replace(b'"result":"PASS"', b'"result":"FAIL"'))
        self._assert_denied("EVIDENCE_HASH_MISMATCH")

    def test_m11_environment_mismatch(self):
        self.m11["environment"] = {}
        self._persist()
        self._assert_denied("M11_ENVIRONMENT_DRIFT")

    def test_current_environment_changed(self):
        (self.root / "inert-global-config").write_bytes(b"INERT CONCURRENT CONFIG")
        self._assert_denied("SIBLING_OR_GLOBAL_DRIFT")

    def test_codex_binary_changed(self):
        Path(self.m11["binary"]["path"]).write_bytes(b"INERT DIFFERENT BINARY")
        self._assert_denied("M11_BINARY_DRIFT")

    def test_m11_wrong_invocation(self):
        self.m11["argv"].remove("--ephemeral")
        self._persist()
        self._assert_denied("M11_INVOCATION")

    def test_raw_canonical_inequality_is_not_drift(self):
        self.assertNotEqual(self.checkpoint["recordRawSha256"], self.checkpoint["recordCanonicalSha256"])
        with self._resume() as owner:
            value = b.verify_receipt(self.target, self.record, verification=owner)
            self.assertEqual(value["artifactRecordSha256"], self.checkpoint["recordCanonicalSha256"])

    def test_raw_artifact_digest_cannot_replace_canonical_binding(self):
        self.checkpoint["recordCanonicalSha256"] = self.checkpoint["recordRawSha256"]
        self._persist()
        self._assert_denied("ARTIFACT_IDENTITY_DRIFT")

    def test_baseline_missing_identity(self):
        del self.baseline["identityMap"][os.path.normcase(str(self.root))]
        self.baseline["identityMapSha256"] = b.sha(b.canonical(self.baseline["identityMap"]))
        self._persist()
        self._assert_denied("BASELINE_PATH_SET")

    def test_baseline_unknown_native_identity(self):
        self.baseline["identityMap"][os.path.normcase(str(self.root))]["identity"] = [0, 0, 0, "UNKNOWN", 16]
        self.baseline["identityMapSha256"] = b.sha(b.canonical(self.baseline["identityMap"]))
        self._persist()
        self._assert_denied("BASELINE_NATIVE_ID_DRIFT")

    def test_no_historical_provenance_reconstruction(self):
        self.baseline["historicalRunDirectoryIdentity"] = "RECONSTRUCTED"
        self._persist()
        self._assert_denied("BASELINE_PROVENANCE")

    def test_original_run_replacement_denied(self):
        run = self.root / b.STAGING / self.run_id
        run.rename(run.with_name("retained-original"))
        run.mkdir()
        self._assert_denied()

    def test_missing_original_run_not_recreated(self):
        run = self.root / b.STAGING / self.run_id
        run.rmdir()
        self._assert_denied("MISSING_GUARD_ANCESTOR")
        self.assertFalse(run.exists())

    def test_candidate_not_regenerated_or_ignored(self):
        (self.root / b.STAGING / self.run_id / "candidate").mkdir()
        self._assert_denied("RECOVERY_DESTINATION_EXISTS")

    def test_quarantine_not_precreated_or_overwritten(self):
        (self.root / b.STAGING / self.run_id / "quarantine").mkdir()
        self._assert_denied("RECOVERY_DESTINATION_EXISTS")

    def test_unknown_checkpoint_field(self):
        self.checkpoint["force"] = True
        self._persist()
        self._assert_denied("CHECKPOINT_SCHEMA")

    def test_private_lease_rejects_second_owner_without_files(self):
        before = b.tree_snapshot(self.root)
        with self._resume():
            self._assert_denied("MUTATION_LEASE_BUSY")
        b.same_tree(self.root, before)

    def test_protected_source_changed_before_context(self):
        (self.root / "package.json").write_bytes(b"INERT DRIFT")
        self._assert_denied("PROTECTED_SOURCE_DRIFT")

    def test_source_drift_after_context_before_checks(self):
        with self._resume() as owner:
            (self.root / "package.json").write_bytes(b"INERT DRIFT")
            with self.assertRaisesRegex(b.Blocked, "PROTECTED_SOURCE_DRIFT"):
                owner._complete()
        self.assertEqual((self.target / "installation.json").read_bytes(), self.original)

    def test_synthetic_transition_exact_once_and_thirteen_checks(self):
        with patch.object(query, "_global_paths", return_value=[]), patch.object(subprocess, "run", side_effect=self._spawn):
            with self._resume() as owner:
                result = owner._complete()
                post = (self.target / "installation.json").read_bytes()
                value = b.decode_json(post)
                self.assertEqual(value["state"], "verified")
                self.assertEqual(set(value["checks"]), b.CHECKS)
                self.assertEqual(len(value["checks"]), 13)
                self.assertNotIn("M12", value["checks"])
                self.assertEqual(result["receiptPostimageSha256"], b.sha(post))
                self.assertEqual(post, b.canonical(value) + b"\n")
                self.assertNotIn("receiptPostimageSha256", value)
                with self.assertRaisesRegex(b.Blocked, "RECEIPT_TRANSITION"):
                    owner._complete()
                after = b.tree_snapshot(self.target)
                self.assertEqual(len(after["files"]), 70)
                for name in self.files:
                    self.assertEqual(after["files"][name], self.snapshot["files"][name])
        with self.assertRaises(b.Blocked):
            with self._resume():
                self.fail("Verified state resumed")

    def test_exclusive_receipt_blocks_other_opens(self):
        path = self.target / "installation.json"
        with b._exclusive_receipt(path):
            with self.assertRaises(b.Blocked):
                with b._exclusive_receipt(path):
                    self.fail("Concurrent writer accepted")
            with self.assertRaises(OSError):
                path.write_bytes(b"INERT CONCURRENT WRITE")
        self.assertEqual(path.read_bytes(), self.original)

    def test_concurrent_receipt_bytes_are_preserved(self):
        with self._resume() as owner:
            path = self.target / "installation.json"
            changed = self.original + b" "
            path.write_bytes(changed)
            with self.assertRaises(b.Blocked):
                owner._complete()
            self.assertEqual(path.read_bytes(), changed)

    def test_extra_71st_file_denied(self):
        (self.target / "unexpected").write_bytes(b"INERT")
        self._assert_denied("TREE_INVENTORY")

    def test_m12_verified_no_change_zero_write_or_spawn(self):
        self._completed()
        before = b.tree_snapshot(self.root)
        with patch.object(Path, "write_bytes", side_effect=AssertionError("M12 write")), \
             patch.object(Path, "mkdir", side_effect=AssertionError("M12 directory")), \
             patch.object(subprocess, "run", side_effect=AssertionError("M12 spawn")), \
             patch.object(query, "_execute", side_effect=AssertionError("M12 query")), \
             patch.object(b, "_exclusive_receipt", side_effect=AssertionError("M12 writable handle")):
            self.assertEqual(self._m12(), "VERIFIED_NO_CHANGE")
        b.same_tree(self.root, before)

    def test_m12_missing_smoke_not_repaired(self):
        self._completed()
        del self.completion["evidence"]["checks"]["M05"]
        self._persist()
        before = b.tree_snapshot(self.target)
        with self.assertRaisesRegex(b.Blocked, "SMOKE_CHECK_SET"):
            self._m12()
        b.same_tree(self.target, before)

    def test_m12_wrong_postimage_not_repaired(self):
        self._completed()
        self.completion["receiptPostimageSha256"] = "0" * 64
        self._persist()
        with self.assertRaisesRegex(b.Blocked, "POSTIMAGE_IDENTITY_DRIFT"):
            self._m12()

    def test_m12_file_native_identity_drift(self):
        self._completed()
        path = self.target / "SKILL.md"
        content = path.read_bytes()
        path.rename(self.root / "retained-original-skill")
        path.write_bytes(content)
        with self.assertRaisesRegex(b.Blocked, "TARGET_IDENTITY_DRIFT"):
            self._m12()

    def test_m12_old_receipt_check_set_denied(self):
        self._completed()
        path = self.target / "installation.json"
        value = b.decode_json(path.read_bytes())
        del value["checks"]["PRE_COMPLETION_INTEGRITY"]
        value["checks"]["M12"] = "PASS"
        path.write_bytes(b.canonical(value) + b"\n")
        with self.assertRaisesRegex(b.Blocked, "INCOMPLETE_VERIFICATION"):
            b.verify_receipt(self.target, self.record)

    def test_d17_failure_quarantines_verified_without_rollback(self):
        with patch.object(query, "_global_paths", return_value=[]), patch.object(subprocess, "run", side_effect=self._spawn):
            with self._resume() as owner:
                result = owner._complete()
                destination = self.root / b.STAGING / self.run_id / "quarantine"
                self.assertFalse(destination.exists())
                # Model a post-completion check failure without target drift.
                recovery = owner._quarantine_verified()
                self.assertEqual(recovery["status"], "NOT_INTEGRATED")
                self.assertFalse(self.target.exists())
                value = b.decode_json((destination / "installation.json").read_bytes())
                self.assertEqual(value["state"], "verified")
                self.assertEqual(b.sha((destination / "installation.json").read_bytes()), result["receiptPostimageSha256"])

    def test_d17_target_drift_blocks_and_preserves(self):
        with patch.object(query, "_global_paths", return_value=[]), patch.object(subprocess, "run", side_effect=self._spawn):
            with self._resume() as owner:
                owner._complete()
                (self.target / "SKILL.md").write_bytes(b"INERT DRIFT")
                with self.assertRaises(b.Blocked):
                    owner._quarantine_verified()
                self.assertTrue(self.target.exists())
                self.assertFalse((self.root / b.STAGING / self.run_id / "quarantine").exists())

    def test_pending_query_has_no_scratch_or_spawn(self):
        before = b.tree_snapshot(self.root)
        with patch.object(subprocess, "run") as spawn:
            with self.assertRaisesRegex(b.Blocked, "PENDING_DENIED"):
                query._execute(query.arguments(BASE), self.root, self.record, self.target)
            spawn.assert_not_called()
        b.same_tree(self.root, before)

    def test_baseline_absence_requires_recorded_parent_identity(self):
        row = next(r for r in self.baseline["identityMap"].values() if r["type"] == "ABSENT")
        row["nearestParentIdentity"] = [0, 0, 0, "UNKNOWN", 16]
        self.baseline["identityMapSha256"] = b.sha(b.canonical(self.baseline["identityMap"]))
        self._persist()
        self._assert_denied("ABSENCE_PARENT_DRIFT")

    def test_bound_unit_approval_is_not_whole_tasks_hash(self):
        path = self.root / b._TASKS
        path.write_bytes(path.read_bytes() + b"\nINERT APPENDED STATUS DOES NOT GRANT APPROVAL\n")
        with self._resume() as owner:
            self.assertTrue(owner.active)

    def test_duplicate_evidence_unit_rejected(self):
        path = self.root / b._TASKS
        path.write_bytes(path.read_bytes() * 2)
        self._assert_denied("EVIDENCE_UNIT_MISSING_OR_DUPLICATE")

    def test_actual_query_nonzero_blocks_receipt_transition(self):
        failed = subprocess.CompletedProcess([], 7, b"INERT FAILURE", b"INERT ERROR")
        with patch.object(query, "_global_paths", return_value=[]), patch.object(subprocess, "run", return_value=failed):
            with self._resume() as owner:
                with self.assertRaises(query.QueryFailure):
                    owner._complete()
        self.assertEqual((self.target / "installation.json").read_bytes(), self.original)

    def test_m13_failure_blocks_receipt_transition(self):
        def child(command, **kwargs):
            if "unittest" in command:
                return subprocess.CompletedProcess(command, 1, b"", b"FAILED (failures=1)")
            return self._spawn(command, **kwargs)
        with patch.object(query, "_global_paths", return_value=[]), patch.object(subprocess, "run", side_effect=child):
            with self._resume() as owner:
                with self.assertRaisesRegex(b.Blocked, "M13_FAILED"):
                    owner._complete()
        self.assertEqual((self.target / "installation.json").read_bytes(), self.original)

    def test_final_precompletion_source_drift_blocks_write(self):
        def child(command, **kwargs):
            result = self._spawn(command, **kwargs)
            if "unittest" in command:
                (self.root / "package.json").write_bytes(b"INERT CONCURRENT SOURCE")
            return result
        with patch.object(query, "_global_paths", return_value=[]), patch.object(subprocess, "run", side_effect=child):
            with self._resume() as owner:
                with self.assertRaisesRegex(b.Blocked, "PROTECTED_SOURCE_DRIFT"):
                    owner._complete()
        self.assertEqual((self.target / "installation.json").read_bytes(), self.original)

    def test_readonly_m12_does_not_acquire_mutation_lease(self):
        self._completed()
        with patch.object(b, "_mutation_lease", side_effect=AssertionError("M12 mutation lease")):
            self.assertEqual(self._m12(), "VERIFIED_NO_CHANGE")


def m12_attack(field, replacement):
    def test(self):
        self._completed()
        if field == "M13":
            self.completion["evidence"]["checks"][field]["stderr"] = replacement
        elif field == "binding":
            self.completion["evidence"][field] = replacement
        else:
            self.completion["evidence"]["checks"][field] = replacement
        self._persist()
        before = b.tree_snapshot(self.root)
        with self.assertRaises(b.Blocked), patch.object(subprocess, "run") as spawn:
            self._m12()
        spawn.assert_not_called()
        b.same_tree(self.root, before)
    return test


for name in sorted(b.CHECKS - {"M13"}):
    setattr(ResumeTests, "test_m12_rejects_unbound_" + name.lower(), m12_attack(name, "PASS"))
setattr(ResumeTests, "test_m12_rejects_old_source_binding", m12_attack("binding", "0" * 64))
setattr(ResumeTests, "test_m12_rejects_skipped_m13", m12_attack("M13", "Ran 127 tests in 0.1s\n\nOK (skipped=1)\n"))


class QueryTests(unittest.TestCase):
    def test_phase_a_command_modes_never_procure_or_install(self):
        for mode in ["install", "replace-reviewed"]:
            with patch.object(b, "read_record") as read, patch.object(b, "_Run") as stage:
                with self.assertRaisesRegex(b.Blocked, "PRE_PROCUREMENT_CHECKPOINT"):
                    b.main([mode])
                read.assert_not_called()
                stage.assert_not_called()

    def test_supported_argument_surface(self):
        for mode, value in [("--domain", "ux"), ("--stack", "nextjs")]:
            for count in [1, 10]:
                args = query.arguments(["YUTA inert query", mode, value, "--max-results", str(count)])
                command = query._argv(args, {"path": "C:/validated/python.exe"}, Path("C:/owned"))
                self.assertEqual(command[1:4], ["-B", "-E", "-s"])
                self.assertEqual(command[-1], "--json")

    def test_invalid_record_before_spawn(self):
        with patch.object(query.subprocess, "run") as spawn, patch.object(query.b, "read_record", side_effect=b.Blocked("drift")):
            with self.assertRaises(b.Blocked):
                query.main(["inert", "--domain", "ux", "--max-results", "3"])
            spawn.assert_not_called()


def query_attack(argv):
    def test(self):
        with patch.object(query.subprocess, "run") as spawn, patch.object(query.b, "read_record") as read:
            with self.assertRaises((SystemExit, b.Blocked)), contextlib.redirect_stderr(io.StringIO()):
                query.main(argv)
            spawn.assert_not_called()
            read.assert_not_called()
    return test


import contextlib
BASE = ["inert", "--domain", "ux", "--max-results", "3"]
for flag in ["--persist", "--force", "--output-dir", "--design-system", "--page", "--variance",
             "--motion", "--density", "--skip-check", "--script", "--global", "--unknown"]:
    setattr(QueryTests, "test_pre_spawn_" + flag[2:].replace("-", "_"), query_attack(BASE + [flag]))
for label, argv in {
    "both_modes": BASE + ["--stack", "nextjs"], "wrong_domain": ["inert", "--domain", "style", "--max-results", "3"],
    "wrong_stack": ["inert", "--stack", "react", "--max-results", "3"],
    "missing_mode": ["inert", "--max-results", "3"], "zero": BASE[:-1] + ["0"],
    "eleven": BASE[:-1] + ["11"], "unknown_query": BASE + ["another-query"],
    "duplicate": BASE + ["--max-results", "4"], "nul": ["inert\0", *BASE[1:]],
    "abbreviation": ["inert", "--dom", "ux", "--max-results", "3"],
}.items():
    setattr(QueryTests, "test_pre_spawn_" + label, query_attack(argv))


if __name__ == "__main__":
    unittest.main()
