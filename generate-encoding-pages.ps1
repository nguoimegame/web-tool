# Script to generate encoding/decoding pages for Astro

$pages = @(
    # Base64
    @{Name="Base64 Encode"; Tool="Encode"; JsFile="base64.js?v=6"; Path="base64_encode.astro"; Reverse="base64_decode.html"; InputSettings=$true; FormatSettings=$true},
    @{Name="Base64 Decode"; Tool="Decode"; JsFile="base64.js?v=6"; Path="base64_decode.astro"; Reverse="base64_encode.html"; OutputSettings=$true; FormatSettings=$true},
    @{Name="File to Base64"; Tool="Encode"; JsFile="base64.js?v=6"; Path="base64_encode_file.astro"; Reverse="base64_decode_file.html"; FormatSettings=$true},
    @{Name="Base64 to File"; Tool="Decode"; JsFile="base64.js?v=6"; Path="base64_decode_file.astro"; Reverse="base64_encode_file.html"; FormatSettings=$true},
    
    # Base58
    @{Name="Base58 Encode"; Tool="Encode"; JsFile="base58.js?v=7"; Path="base58_encode.astro"; Reverse="base58_decode.html"; InputSettings=$true},
    @{Name="Base58 Decode"; Tool="Decode"; JsFile="base58.js?v=7"; Path="base58_decode.astro"; Reverse="base58_encode.html"; OutputSettings=$true},
    @{Name="File to Base58"; Tool="Encode"; JsFile="base58.js?v=7"; Path="base58_encode_file.astro"; Reverse="base58_decode_file.html"},
    @{Name="Base58 to File"; Tool="Decode"; JsFile="base58.js?v=7"; Path="base58_decode_file.astro"; Reverse="base58_encode_file.html"},
    
    # Base32
    @{Name="Base32 Encode"; Tool="Encode"; JsFile="base32.js?v=4"; Path="base32_encode.astro"; Reverse="base32_decode.html"; InputSettings=$true},
    @{Name="Base32 Decode"; Tool="Decode"; JsFile="base32.js?v=4"; Path="base32_decode.astro"; Reverse="base32_encode.html"; OutputSettings=$true},
    @{Name="File to Base32"; Tool="Encode"; JsFile="base32.js?v=4"; Path="base32_encode_file.astro"; Reverse="base32_decode_file.html"},
    @{Name="Base32 to File"; Tool="Decode"; JsFile="base32.js?v=4"; Path="base32_decode_file.astro"; Reverse="base32_encode_file.html"},
    
    # Hex
    @{Name="Hex Encode"; Tool="Encode"; JsFile="hex.js?v=3"; Path="hex_encode.astro"; Reverse="hex_decode.html"; InputSettings=$true},
    @{Name="Hex Decode"; Tool="Decode"; JsFile="hex.js?v=3"; Path="hex_decode.astro"; Reverse="hex_encode.html"; OutputSettings=$true},
    @{Name="File to Hex"; Tool="Encode"; JsFile="hex.js?v=3"; Path="hex_encode_file.astro"; Reverse="hex_decode_file.html"},
    @{Name="Hex to File"; Tool="Decode"; JsFile="hex.js?v=3"; Path="hex_decode_file.astro"; Reverse="hex_encode_file.html"},
    
    # HTML
    @{Name="HTML Encode"; Tool="Encode"; JsFile="html.js?v=4"; Path="html_encode.astro"; Reverse="html_decode.html"; InputSettings=$false},
    @{Name="HTML Decode"; Tool="Decode"; JsFile="html.js?v=4"; Path="html_decode.astro"; Reverse="html_encode.html"; InputSettings=$false},
    
    # URL
    @{Name="URL Encode"; Tool="Encode"; JsFile="url.js?v=3"; Path="url_encode.astro"; Reverse="url_decode.html"; InputSettings=$false},
    @{Name="URL Decode"; Tool="Decode"; JsFile="url.js?v=3"; Path="url_decode.astro"; Reverse="url_encode.html"; InputSettings=$false}
)

$pagesDir = "src\pages"

foreach ($page in $pages) {
    $filePath = Join-Path $pagesDir $page.Path
    
    $description = if ($page.Tool -eq "Encode") {
        "Encode text or file to $($page.Name -replace ' Encode| to .*', ''). Free online $($page.Name -replace ' Encode| to .*', '') encoding tool."
    } else {
        "Decode $($page.Name -replace ' Decode|.* to ', '') to text or file. Free online $($page.Name -replace ' Decode|.* to ', '') decoding tool."
    }
    
    $inputSettings = if ($page.InputSettings -eq $true) { "true" } else { "false" }
    $outputSettings = if ($page.OutputSettings -eq $true) { "true" } else { "false" }
    $formatSettings = if ($page.FormatSettings -eq $true) { "true" } else { "false" }
    
    $content = @"
---
import EncodingPage from '../components/EncodingPage.astro';

const title = "$($page.Name)";
const description = "$description";
const toolName = "$($page.Tool)";
const jsFile = "$($page.JsFile)";
const activePage = "$($page.Path)";
const reverseLink = "$($page.Reverse)";
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
    hasFormatSettings={$formatSettings}
/>
"@
    
    Set-Content -Path $filePath -Value $content -Encoding UTF8
}

Write-Host "Done! Created $($pages.Count) encoding/decoding pages."
