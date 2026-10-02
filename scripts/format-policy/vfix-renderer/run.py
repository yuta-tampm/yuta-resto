"""Bounded V-FIX experiment entrypoint; never writes repository inputs."""
from __future__ import annotations
import ast
import hashlib
import importlib.metadata
import json
import locale
import os
from pathlib import Path
import platform
import re
import sys

ROOT = Path("/input")
WORK = Path("/work")
PREFIX = "apps/backoffice/test/fixtures/personnel-contract-evaluation"
SOURCE = "apps/backoffice/scripts/generate-personnel-contract-evaluation-corpus.py"
TASKS = "openspec/changes/repository-format-policy-and-baseline-remediation/tasks.md"


def require(condition, code):
    if not condition:
        raise RuntimeError(code)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def composite(value, sorted_keys=False):
    return digest(json.dumps(value, sort_keys=sorted_keys, ensure_ascii=False,
                             separators=(",", ":")).encode("utf-8"))


def pairs(items):
    result = {}
    for key, value in items:
        require(key not in result, "DUPLICATE_JSON_KEY")
        result[key] = value
    return result


def read_json(data):
    return json.loads(data, object_pairs_hook=pairs)


def raw(path):
    require(path.is_file() and not path.is_symlink(), "UNSAFE_OR_MISSING_FILE")
    return path.read_bytes()


def inventory():
    result = []
    for version in ("v1", "v2"):
        base = ROOT / PREFIX / version
        for path in sorted(base.iterdir()):
            require(path.suffix in (".json", ".pdf"), "UNEXPECTED_OUTPUT_MEMBER")
            data = raw(path)
            result.append({"path": path.relative_to(ROOT).as_posix(),
                           "type": "MANIFEST" if path.suffix == ".json" else "PDF",
                           "sha256": digest(data), "bytes": len(data)})
    return sorted(result, key=lambda row: row["path"])


def supply_from_evidence(expected):
    text = raw(ROOT / TASKS).decode("utf-8")
    candidates = []
    for block in re.findall(r"\x60{3}json\n(.*?)\n\x60{3}", text, re.S):
        try:
            value = read_json(block)
        except (ValueError, RuntimeError):
            continue
        if composite(value, True) == expected:
            candidates.append(value)
    require(len(candidates) == 1, "SUPPLY_EVIDENCE_BINDING")
    return candidates[0]


def preflight():
    binding_bytes = raw(Path("/opt/vfix/environment.json"))
    require(digest(binding_bytes) ==
            "b509b938ca0ed7674a422981b14f7948944d8484fcd62649de3c6f2c61762f46",
            "ENVIRONMENT_BINDING_DRIFT")
    binding = read_json(binding_bytes)
    require(set(binding) == {
        "schemaVersion", "platform", "baseImageDigest", "supplyClosureSha256",
        "reportlabInspectionClosureSha256", "python", "artifacts", "font",
        "repertoireSha256", "generatorClosureSha256", "corpusClosureSha256",
        "expectedOutputClosureSha256", "controls"}, "ENVIRONMENT_SCHEMA")
    require(binding["schemaVersion"] == 1, "ENVIRONMENT_VERSION")
    require(platform.system() == "Linux" and platform.machine() == "x86_64",
            "PLATFORM_MISMATCH")
    require(os.getcwd() == "/work" and os.geteuid() != 0, "WORKER_BOUNDARY")
    require(locale.setlocale(locale.LC_ALL, "") == "C", "LOCALE_MISMATCH")
    require(os.environ.get("TZ") == "UTC" and
            os.environ.get("PYTHONHASHSEED") == "0" and sys.flags.utf8_mode == 1,
            "AMBIENT_ENVIRONMENT")
    require(not os.environ.get("PYTHONPATH"), "PYTHONPATH_INJECTION")
    require(platform.python_version() == binding["python"]["version"],
            "PYTHON_VERSION")
    require(digest(raw(Path(sys.executable).resolve())) ==
            binding["python"]["executableSha256"], "PYTHON_BINARY")
    require(digest(raw(Path("/usr/local/lib/libpython3.12.so.1.0"))) ==
            binding["python"]["libpythonSha256"], "LIBPYTHON_BINARY")
    supply = supply_from_evidence(binding["supplyClosureSha256"])
    site = Path("/usr/local/lib/python3.12/site-packages")
    for row in supply["pillowNative"]:
        require(digest(raw(site / row["path"])) == row["sha256"],
                "PILLOW_NATIVE_DRIFT")
    for row in supply["baseLibraries"]:
        require(digest(raw(Path(row["path"]))) == row["sha256"],
                "BASE_NATIVE_DRIFT")
    for name, version in (("pillow", "12.3.0"), ("reportlab", "4.4.9"),
                          ("charset-normalizer", "3.4.4")):
        require(importlib.metadata.version(name) == version, "PACKAGE_VERSION")
    font = site / binding["font"]["path"]
    require(digest(raw(font)) == binding["font"]["sha256"], "FONT_DRIFT")
    require(digest(raw(site / binding["font"]["licensePath"])) ==
            binding["font"]["licenseSha256"], "FONT_LICENSE_DRIFT")
    source = raw(ROOT / SOURCE)
    require(composite({SOURCE: digest(source)}, True) ==
            binding["generatorClosureSha256"], "GENERATOR_DRIFT")
    expected = inventory()
    require(len(expected) == 122 and composite(
        {row["path"]: row["sha256"] for row in expected}, True) ==
            binding["expectedOutputClosureSha256"], "EXPECTED_OUTPUT_DRIFT")
    corpus = [row for row in expected if "/v1/" in row["path"] and
              not row["path"].endswith(("wg2-adversarial-05.pdf",
                                        "wg2-adversarial-09.pdf"))]
    require(len(corpus) == 59 and composite(
        {row["path"]: row["sha256"] for row in corpus}, True) ==
            binding["corpusClosureSha256"], "CORPUS_DRIFT")
    return binding, font, source, expected


def render(font, source):
    from PIL import ImageFont
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    pdfmetrics.registerFont(TTFont("VFixScanRoman", str(font)))
    tree = ast.parse(source, filename=str(ROOT / SOURCE))
    # Only destination assignments change; v2 still reads reviewed v1 inputs.
    main = next(node for node in tree.body
                if isinstance(node, ast.FunctionDef) and node.name == "main")
    replaced = set()
    for node in main.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1:
            target = node.targets[0]
            if isinstance(target, ast.Name) and target.id in ("OUTPUT", "TEMP"):
                directory = "output" if target.id == "OUTPUT" else "tmp"
                node.value = ast.parse(
                    f'Path("/work/{directory}") / corpus_version', mode="eval").body
                replaced.add(target.id)
    require(replaced == {"OUTPUT", "TEMP"}, "GENERATOR_DESTINATION_CONTRACT")
    ast.fix_missing_locations(tree)
    namespace = {"__name__": "vfix_source", "__file__": str(ROOT / SOURCE)}
    exec(compile(tree, str(ROOT / SOURCE), "exec"), namespace)
    namespace["find_font"] = lambda size: ImageFont.truetype(str(font), size=size)
    for version in ("v1", "v2"):
        sys.argv = [SOURCE, "--corpus-version", version]
        namespace["main"]()


def run():
    binding, font, source, expected = preflight()
    require(not (WORK / "output").exists() and not (WORK / "tmp").exists(),
            "SCRATCH_NOT_FRESH")
    render(font, source)
    rows = []
    actual_paths = sorted(p.relative_to(WORK / "output").as_posix()
                          for p in (WORK / "output").rglob("*") if p.is_file())
    expected_paths = sorted(row["path"].removeprefix(PREFIX + "/")
                            for row in expected)
    for row in expected:
        path = WORK / "output" / row["path"].removeprefix(PREFIX + "/")
        data = raw(path) if path.exists() else None
        observed = digest(data) if data is not None else None
        rows.append({"path": row["path"], "type": row["type"],
                     "expectedSha256": row["sha256"], "generatedSha256": observed,
                     "expectedSize": row["bytes"],
                     "generatedSize": len(data) if data is not None else None,
                     "rawByteMatch": observed == row["sha256"],
                     "taxonomy": None if observed == row["sha256"] else "UNKNOWN"})
    require(inventory() == expected, "POST_INPUT_DRIFT")
    matches = sum(row["rawByteMatch"] for row in rows)
    result = {"expectedCount": 122, "generatedCount": len(actual_paths),
              "missing": sorted(set(expected_paths) - set(actual_paths)),
              "extra": sorted(set(actual_paths) - set(expected_paths)),
              "exactMatchCount": matches, "mismatchCount": 122 - matches,
              "outputSetSha256": composite([
                  {"path": row["path"], "type": row["type"],
                   "sha256": row["generatedSha256"], "bytes": row["generatedSize"]}
                  for row in rows]), "rows": rows}
    result["status"] = "PASS" if matches == 122 and not result["extra"] else "FAIL"
    print(json.dumps(result, separators=(",", ":")))
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    try:
        sys.exit(run())
    except Exception as exc:
        print(json.dumps({"status": "FAIL", "code": str(exc)}, separators=(",", ":")))
        sys.exit(2)
