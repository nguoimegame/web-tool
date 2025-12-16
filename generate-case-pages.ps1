# Script to generate case conversion pages for Astro

$pages = @(
    @{Name="lower case"; Folder="case"; SubFolder="lower"; JsFile="case.js?v=1"},
    @{Name="UPPER CASE"; Folder="case"; SubFolder="upper"; JsFile="case.js?v=1"},
    @{Name="lowerCamelCase"; Folder="case"; SubFolder="lower-camel"; JsFile="case.js?v=1"},
    @{Name="UpperCamelCase"; Folder="case"; SubFolder="upper-camel"; JsFile="case.js?v=1"},
    @{Name="snake_case"; Folder="case"; SubFolder="snake"; JsFile="case.js?v=1"},
    @{Name="kebab-case"; Folder="case"; SubFolder="kebab"; JsFile="case.js?v=1"},
    @{Name="CONSTANT_CASE"; Folder="case"; SubFolder="constant"; JsFile="case.js?v=1"}
)

foreach ($page in $pages) {
    $folderPath = "src\pages\$($page.Folder)\$($page.SubFolder)"
    New-Item -Path $folderPath -ItemType Directory -Force | Out-Null
    
    $filePath = Join-Path $folderPath "index.astro"
    
    $content = @"
---
import EncodingPage from '../../../components/EncodingPage.astro';

const title = "Convert to $($page.Name)";
const description = "Convert text to $($page.Name). Free online case conversion tool.";
const toolName = "Convert";
const jsFile = "$($page.JsFile)";
const activePage = "$($page.Folder)/$($page.SubFolder)/";
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
}

Write-Host "Done! Created $($pages.Count) case conversion pages."
