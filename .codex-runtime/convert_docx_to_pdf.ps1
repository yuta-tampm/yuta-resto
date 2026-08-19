$ErrorActionPreference = 'Stop'

$docxPath = (Resolve-Path -LiteralPath 'artifacts\investor\YUTA_investor_infrastructure_cost_report_2026-08.docx').Path
$pdfPath = Join-Path (Split-Path -Parent $docxPath) 'YUTA_investor_infrastructure_cost_report_2026-08.pdf'

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $document = $word.Documents.Open($docxPath, $false, $true)
    try {
        $document.ExportAsFixedFormat($pdfPath, 17)
    }
    finally {
        $document.Close($false)
    }
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}

Write-Output $pdfPath
