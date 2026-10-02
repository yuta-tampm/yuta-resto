"""Only supported non-persistent query surface; stdout is data, never code."""

from __future__ import annotations

import argparse
import ctypes
from datetime import datetime, timezone
import json
import ntpath
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

import bootstrap as b


def arguments(argv):
    parser = argparse.ArgumentParser(allow_abbrev=False)
    parser.add_argument("query")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--domain", choices=["ux"])
    group.add_argument("--stack", choices=["nextjs"])
    parser.add_argument("--max-results", required=True, type=int, choices=range(1, 11))
    # Reject repeated options as well as unknowns; no last-value-wins policy.
    for option in ("--domain", "--stack", "--max-results"):
        b.require(sum(x == option or x.startswith(option + "=") for x in argv) <= 1,
                  "DUPLICATE_QUERY_ARGUMENT")
    args = parser.parse_args(argv)
    b.require(0 < len(args.query.strip()) <= 2048 and
              not any(ord(ch) < 32 for ch in args.query), "INVALID_QUERY")
    return args


def _argv(args, interpreter, target):
    mode = ["--domain", args.domain] if args.domain else ["--stack", args.stack]
    return [interpreter["path"], "-B", "-E", "-s", str(target / "scripts/search.py"),
            args.query, *mode, "--max-results", str(args.max_results), "--json"]


def _fingerprint(paths):
    return b.fingerprint(paths)


def _global_paths():
    user = Path.home()
    codex = Path(os.environ.get("CODEX_HOME", user / ".codex"))
    return [codex / "config.toml", codex / "skills", user / ".agents/skills",
            Path(os.environ.get("PROGRAMDATA", "C:/ProgramData")) / "codex"]


def _windows_directory():
    b.require(os.name == "nt", "UNSUPPORTED_HOST_OR_PYTHON")
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.GetWindowsDirectoryW.argtypes = [ctypes.c_wchar_p, ctypes.c_uint]
    kernel.GetWindowsDirectoryW.restype = ctypes.c_uint
    buffer = ctypes.create_unicode_buffer(32768)
    size = kernel.GetWindowsDirectoryW(buffer, len(buffer))
    b.require(0 < size < len(buffer), "WINDOWS_DIRECTORY_UNKNOWN")
    return buffer.value


def _query_environment(cwd):
    # Resolve OS runtime paths from Windows, never inherit the parent environment.
    # Missing SystemDrive makes this host's Python startup create a literal
    # %SystemDrive% cache tree in cwd even for "-c pass".
    windows = _windows_directory()
    b.require(isinstance(windows, str) and "%" not in windows,
              "WINDOWS_DIRECTORY_INVALID")
    drive, tail = ntpath.splitdrive(windows)
    b.require(re.fullmatch(r"[A-Za-z]:", drive) is not None
              and tail.startswith("\\") and len(tail) > 1
              and ntpath.normpath(windows) == windows, "WINDOWS_DIRECTORY_INVALID")
    b.safe_name(tail[1:].replace("\\", "/"))
    system_drive = drive + "\\"
    b.require(Path(windows).is_dir() and Path(system_drive).is_dir(),
              "WINDOWS_DIRECTORY_MISSING")
    b.require(cwd.is_absolute() and cwd.is_dir(), "INVALID_QUERY_SCRATCH")
    return {"SystemRoot": windows, "WINDIR": windows, "SystemDrive": system_drive,
            "TEMP": str(cwd), "TMP": str(cwd)}


class QueryFailure(b.Blocked):
    def __init__(self, reason, evidence):
        self.evidence = evidence
        super().__init__(json.dumps({"error": reason, "evidence": evidence}))


def _execute(args, root, record, target, verification=None):
    # All of this precedes any spawn or scratch creation.
    with b.Guard(root, [target / "installation.json", target / "scripts/search.py"]) as guard:
        receipt = b.verify_receipt(target, record, verification=verification)
        before = b.tree_snapshot(target)
        globals_before = _fingerprint(_global_paths())
        siblings_before = b.fingerprint([root / ".agents/skills"], [root / b.TARGET])
        interpreter = b.host_check(root, receipt["interpreter"]["path"])
        command = _argv(args, interpreter, target)
        scratch_parent = root / b.STAGING
        b.require(scratch_parent.is_dir(), "MISSING_OWNED_SCRATCH_PARENT")
        with b.Guard(root, [scratch_parent / "query-scratch"]):
            # Unique owned cwd, never an archive-provided path.
            cwd = Path(tempfile.mkdtemp(prefix="query-", dir=scratch_parent))
            owned_identity = guard.api.inspect(cwd)
            try:
                environment = _query_environment(cwd)
                guard.recheck()
                started = datetime.now(timezone.utc).isoformat()
                timed_out = False
                try:
                    result = subprocess.run(command, cwd=cwd, env=environment, shell=False,
                                            capture_output=True, timeout=60, check=False)
                    exit_code, stdout, stderr = result.returncode, result.stdout, result.stderr
                except subprocess.TimeoutExpired as error:
                    timed_out = True
                    exit_code, stdout, stderr = None, error.stdout or b"", error.stderr or b""
                evidence = {"utc": started, "argv": command, "interpreter": interpreter,
                            "environmentKeys": sorted(environment),
                            "scratchPath": str(cwd), "scratchIdentity": owned_identity,
                            "exitCode": exit_code, "timedOut": timed_out,
                            "stdoutSha256": b.sha(stdout), "stderrSha256": b.sha(stderr),
                            "receiptSha256": b.sha((target / "installation.json").read_bytes()),
                            "artifactRecordSha256": b.sha(b.canonical(record))}
                try:
                    # Includes timeout/nonzero outcomes; never label them PASS.
                    b.same_tree(target, before)
                    b.require(_fingerprint(_global_paths()) == globals_before, "GLOBAL_MUTATION")
                    b.require(b.fingerprint([root / ".agents/skills"], [root / b.TARGET]) ==
                              siblings_before, "SIBLING_MUTATION")
                    evidence["scratchEmpty"] = not any(cwd.iterdir())
                    b.require(evidence["scratchEmpty"], "UNEXPECTED_QUERY_OUTPUT")
                    b.require(not timed_out, "QUERY_TIMEOUT")
                    b.require(exit_code == 0, "QUERY_FAILED")
                    b.require(len(stdout) <= 2 * 1024 * 1024, "QUERY_OUTPUT_BOUND")
                    output = b.decode_json(stdout)
                    b.require(isinstance(output, (dict, list)), "QUERY_JSON_SHAPE")
                except b.Blocked as error:
                    raise QueryFailure(str(error), evidence) from error
                return output, evidence
            finally:
                # Do not recursively remove unexpected output or concurrent data.
                if guard.api.inspect(cwd) == owned_identity and not any(cwd.iterdir()):
                    cwd.rmdir()


def main(argv=None):
    args = arguments(sys.argv[1:] if argv is None else argv)
    root = Path(__file__).resolve().parents[2]
    record = b.read_record(root, root / b.RECORD)
    output, evidence = _execute(args, root, record, root / b.TARGET)
    print(json.dumps({"classification": "DESIGN_REFERENCE", "output": output, "evidence": evidence}))


if __name__ == "__main__":
    try:
        main()
    except (b.Blocked, OSError, ValueError, subprocess.TimeoutExpired) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
