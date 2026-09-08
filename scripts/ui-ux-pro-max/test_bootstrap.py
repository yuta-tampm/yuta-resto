"""Inert YUTA fixtures only. No member is executed; no real artifact is read.

Windows tests create owned OS scratch directories, never the repository skill
target. Test doubles exercise receipt/parser mechanics, not installed-tool QA.
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
                self.assertEqual(set(kwargs["env"]) - {"SystemRoot", "WINDIR", "TEMP", "TMP"}, set())
                self.assertEqual(Path(kwargs["env"]["TEMP"]), kwargs["cwd"])
                return subprocess.CompletedProcess(command, 0, b'{"results":["YUTA inert spy"]}', b"")
            with patch.object(b, "validate_record", side_effect=lambda r: r), patch.object(query, "_global_paths", return_value=[]), patch.object(query.subprocess, "run", side_effect=inert_spy) as spawn:
                output, evidence = query._execute(query.arguments(BASE), self.root, run.record, run.path)
                self.assertEqual(output["results"], ["YUTA inert spy"])
                self.assertEqual(evidence["exitCode"], 0)
                spawn.assert_called_once()
        finally:
            run.__exit__()

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
