# Script to generate data tools pages for Astro (JSON, XML, SQL, QR Code, Syntax Highlight, CRC)

$pages = @(
    # JSON
    @{Name="JSON Formatter"; Folder="json"; SubFolder="formatter"; JsFile="json.js?v=6"; Tool="Format"},
    @{Name="JSON Minifier"; Folder="json"; SubFolder="minifier"; JsFile="json.js?v=6"; Tool="Minify"},
    @{Name="JSON Validator"; Folder="json"; SubFolder="validator"; JsFile="json.js?v=6"; Tool="Validate"},
    @{Name="JSON Viewer"; Folder="json"; SubFolder="viewer"; JsFile="json.js?v=6"; Tool="View"},
    
    # XML
    @{Name="XML Formatter"; Folder="xml"; SubFolder="formatter"; JsFile="xml.js?v=3"; Tool="Format"},
    @{Name="XML Minifier"; Folder="xml"; SubFolder="minifier"; JsFile="xml.js?v=3"; Tool="Minify"},
    @{Name="XML Validator"; Folder="xml"; SubFolder="validator"; JsFile="xml.js?v=3"; Tool="Validate"},
    
    # SQL
    @{Name="SQL Formatter"; Folder="sql"; SubFolder="formatter"; JsFile="sql.js?v=1"; Tool="Format"},
    
    # QR Code
    @{Name="QR Code Generator"; Folder="qr-code"; SubFolder="generator"; JsFile="qrcode.js?v=5"; Tool="Generate"},
    @{Name="QR Code"; Folder="qr-code"; SubFolder=""; JsFile="qrcode.js?v=5"; Tool="Generate"},
    
    # Syntax Highlight
    @{Name="Syntax Highlight"; Folder="syntax-highlight"; SubFolder=""; JsFile="syntax-highlight.js?v=2"; Tool="Highlight"},
    
    # CRC
    @{Name="CRC Calculator"; Folder="crc"; SubFolder=""; JsFile="crc.js?v=1"; Tool="Calculate"}
)

foreach ($page in $pages) {
    if ($page.SubFolder -ne "") {
        $folderPath = "src\pages\$($page.Folder)\$($page.SubFolder)"
    } else {
        $folderPath = "src\pages\$($page.Folder)"
    }
    
    New-Item -Path $folderPath -ItemType Directory -Force | Out-Null
    
    $filePath = Join-Path $folderPath "index.astro"
    
    # Generate description
    $description = switch ($page.Folder) {
        "json" { "Free online JSON $($page.Tool.ToLower())ter. Format, minify, validate or view JSON data." }
        "xml" { "Free online XML $($page.Tool.ToLower())ter. Format, minify or validate XML documents." }
        "sql" { "Free online SQL formatter. Format and beautify SQL queries." }
        "qr-code" { "Generate QR codes from text or URLs. Free online QR code generator." }
        "syntax-highlight" { "Syntax highlighting for code. Supports multiple programming languages." }
        "crc" { "Calculate CRC checksums. Free online CRC calculator tool." }
    }
    
    $activePage = if ($page.SubFolder -ne "") {
        "$($page.Folder)/$($page.SubFolder)/"
    } else {
        "$($page.Folder)/"
    }
    
    $pathDepth = ($activePage -split "/" | Where-Object { $_ -ne "" }).Count
    $importPath = if ($pathDepth -eq 2) { "../../../components/EncodingPage.astro" } else { "../../components/EncodingPage.astro" }
    
    $content = @"
---
import EncodingPage from '$importPath';

const title = "$($page.Name)";
const description = "$description";
const toolName = "$($page.Tool)";
const jsFile = "$($page.JsFile)";
const activePage = "$activePage";
const reverseLink = "";
---

<EncodingPage 
    title={title}
    description={description}
    toolName={toolName}
    jsFile={jsFile}
    activePage={activePage}
    reverseLink={reverseLink}
    hasInputSettings={false}
    hasOutputSettings={false}
    hasFormatSettings={false}
/>
"@
    
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Created: $filePath"
}

Write-Host ""
Write-Host "Done! Created $($pages.Count) data tool pages."
Write-Host "Total: JSON(4) + XML(3) + SQL(1) + QR(2) + Syntax(1) + CRC(1) = 12 pages"
