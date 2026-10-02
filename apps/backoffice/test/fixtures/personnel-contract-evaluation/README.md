# Personnel contract evaluation fixtures

This directory contains repository-owned, entirely fictional PDF fixtures for
Wave G offline evaluation. It contains no copied contract template, real person,
restaurant, address, signature, salary, bank value, identity number, employee
metadata, or production identifier.

`v1/manifest.json` is the machine-readable answer authority. Its hashes, page
counts, fixture distribution, strict result compatibility, safe abstention, and
high-confidence rejection behavior are covered by
`test/personnel-contract-evaluation-corpus.test.ts`.

The fixed distribution is 20 digital-text files, 15 clear image-only scans, 15
degraded scans, and 10 ambiguous/adversarial files. Every PDF has two pages.

Regenerate the fixed sixty-document corpus from `apps/backoffice` with:

```powershell
python -m pip install -r scripts/requirements-contract-evaluation.txt
python scripts/generate-personnel-contract-evaluation-corpus.py
```

The generator uses a fixed seed and invariant PDF metadata. Regeneration must
produce the same manifest hashes on the same supported rendering stack. Review
rendered pages before accepting any generator or dependency change.

These fixtures are not connected to the restaurant UI or Documents storage.
Do not replace them with uploaded personnel files. Phase 4 may transmit only an
explicitly approved fixture from this corpus.
