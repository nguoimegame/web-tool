# Script to generate base58 encoding pages for Astro (subfolder structure)

$pages = @(
    @{Name="Base58 Encode"; Tool="Encode"; JsFile="base58.js?v=7"; Folder="base58"; SubFolder="encode"},
    @{Name="Base58 Decode"; Tool="Decode"; JsFile="base58.js?v=7"; Folder="base58"; SubFolder="decode"},
    @{Name="File to Base58"; Tool="Encode"; JsFile="base58.js?v=7"; Folder="base58/encode"; SubFolder="file"},
    @{Name="Base58 to File"; Tool="Decode"; JsFile="base58.js?v=7"; Folder="base58/decode"; SubFolder="file"}
)

foreach ($page in $pages) {
    $folderPath = "src\pages\$($page.Folder)\$($page.SubFolder)"
    New-Item -Path $folderPath -ItemType Directory -Force | Out-Null
    
    $filePath = Join-Path $folderPath "index.astro"
    
    $description = if ($page.Tool -eq "Encode") {
        "Encode text or file to Base58. Free online Base58 encoding tool."
    } else {
        "Decode Base58 to text or file. Free online Base58 decoding tool."
    }
    
    $inputSettings = if ($page.Tool -eq "Encode") { "true" } else { "false" }
    $outputSettings = if ($page.Tool -eq "Decode") { "true" } else { "false" }
    $activePage = "$($page.Folder)/$($page.SubFolder)/"
    
    $content = @"
---
import EncodingPage from '../../../components/EncodingPage.astro';

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
    hasInputSettings={$inputSettings}
    hasOutputSettings={$outputSettings}
    hasFormatSettings={false}
/>
"@
    
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Created: $filePath"
}

Write-Host ""
Write-Host "Done! Created $($pages.Count) Base58 encoding pages."
