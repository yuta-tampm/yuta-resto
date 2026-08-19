from pathlib import Path

import pypdfium2 as pdfium


pdf_path = Path(r"D:\working\yuta\yuta-resto\artifacts\investor\YUTA_investor_infrastructure_cost_report_2026-08.pdf")
output_dir = Path(r"D:\working\yuta\yuta-resto\.codex-runtime\investor-report-word-render-3")
output_dir.mkdir(parents=True, exist_ok=True)

document = pdfium.PdfDocument(pdf_path)
for index in range(len(document)):
    page = document[index]
    bitmap = page.render(scale=2.0)
    image = bitmap.to_pil()
    image.save(output_dir / f"page-{index + 1}.png")
    page.close()

print(len(document))
