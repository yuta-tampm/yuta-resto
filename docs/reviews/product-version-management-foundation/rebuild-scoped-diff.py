"""Rebuild the Product Release implementation diff without Pointage edits."""

from difflib import unified_diff
from hashlib import sha256
from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).with_name("implementation-scoped.diff")
PATHS = [
    "apps/backoffice/src/components/backoffice/backoffice-frame.tsx",
    "apps/backoffice/test/product-release-footer.test.tsx",
    "apps/web/src/components/marketing/MarketingShell.tsx",
    "docs/MODULE_REGISTRY.md",
    "docs/PRODUCT_KNOWLEDGE.md",
    "docs/README.md",
    "docs/features/product-release/README.md",
    "packages/core/src/index.ts",
    "packages/core/src/product-release.ts",
    "packages/core/test/product-release.test.ts",
]
NEW_PATHS = {
    "apps/backoffice/test/product-release-footer.test.tsx",
    "docs/features/product-release/README.md",
    "packages/core/src/product-release.ts",
    "packages/core/test/product-release.test.ts",
}
PREIMAGE_HASHES = {
    "docs/PRODUCT_KNOWLEDGE.md": "33c7498883a1c8405612aeedbe6e1ab906abcd096860153b1aa77a17963a3f67",
    "docs/MODULE_REGISTRY.md": "9c454d370e50e6c5950d03a9614ee14699d42640aa05e9e3bbbae6320457c764",
}


def committed(revision: str, path: str) -> bytes:
    return subprocess.check_output(["git", "show", f"{revision}:{path}"], cwd=ROOT)


def remove_section(content: bytes, start: bytes, end: bytes) -> bytes:
    first = content.index(start)
    last = content.index(end, first)
    return content[:first] + content[last:]


def before_product_change(path: str, current: bytes) -> bytes:
    if path in NEW_PATHS:
        assert current == committed("fc63fef5", path), path
        return b""
    if path == "docs/PRODUCT_KNOWLEDGE.md":
        return remove_section(current, b"### Product Release identity", b"### Public website")
    if path == "docs/MODULE_REGISTRY.md":
        return remove_section(
            current, b"### Product-wide shared foundation", b"### Cloud and public capabilities"
        )
    if path == "docs/README.md":
        lines = current.splitlines(keepends=True)
        matching = [i for i, line in enumerate(lines) if b"features/product-release/README.md" in line]
        assert len(matching) == 1
        return b"".join(line for i, line in enumerate(lines) if i != matching[0])
    assert current == committed("fc63fef5", path), path
    return committed("fc63fef5^", path)


def lines(content: bytes) -> list[str]:
    return content.decode("utf-8").replace("\r\n", "\n").splitlines(keepends=True)


def main() -> None:
    chunks = []
    for path in PATHS:
        current = (ROOT / path).read_bytes()
        old = before_product_change(path, current)
        if path in PREIMAGE_HASHES:
            assert sha256(old).hexdigest() == PREIMAGE_HASHES[path], path
        body = "".join(
            unified_diff(
                lines(old),
                lines(current),
                fromfile="/dev/null" if path in NEW_PATHS else f"a/{path}",
                tofile=f"b/{path}",
                n=3,
            )
        )
        assert body, path
        chunks.append(f"diff --git a/{path} b/{path}\n" + body)
    OUT.write_bytes("".join(chunks).encode("utf-8"))
    print(f"{OUT.relative_to(ROOT)} sha256={sha256(OUT.read_bytes()).hexdigest()}")


if __name__ == "__main__":
    main()
