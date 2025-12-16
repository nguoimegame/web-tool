# Script to generate encryption/decryption and cryptography pages for Astro

# Encryption/Decryption pages
$cryptoPages = @(
    # AES
    @{Name="AES Encryption"; Folder="aes"; SubFolder="encrypt"; JsFile="crypto-js.js?v=5"; Type="Encrypt"},
    @{Name="AES Decryption"; Folder="aes"; SubFolder="decrypt"; JsFile="crypto-js.js?v=5"; Type="Decrypt"},
    
    # DES
    @{Name="DES Encryption"; Folder="des"; SubFolder="encrypt"; JsFile="crypto-js.js?v=5"; Type="Encrypt"},
    @{Name="DES Decryption"; Folder="des"; SubFolder="decrypt"; JsFile="crypto-js.js?v=5"; Type="Decrypt"},
    
    # Triple DES
    @{Name="Triple DES Encryption"; Folder="triple-des"; SubFolder="encrypt"; JsFile="crypto-js.js?v=5"; Type="Encrypt"},
    @{Name="Triple DES Decryption"; Folder="triple-des"; SubFolder="decrypt"; JsFile="crypto-js.js?v=5"; Type="Decrypt"},
    
    # RC4
    @{Name="RC4 Encryption"; Folder="rc4"; SubFolder="encrypt"; JsFile="crypto-js.js?v=5"; Type="Encrypt"},
    @{Name="RC4 Decryption"; Folder="rc4"; SubFolder="decrypt"; JsFile="crypto-js.js?v=5"; Type="Decrypt"},
    
    # RSA
    @{Name="RSA Key Generator"; Folder="rsa"; SubFolder="key-generator"; JsFile="rsa.js?v=3"; Type="Generate"},
    @{Name="RSA Sign Message"; Folder="rsa"; SubFolder="sign"; JsFile="rsa.js?v=3"; Type="Sign"},
    @{Name="RSA Verify Signature"; Folder="rsa"; SubFolder="verify"; JsFile="rsa.js?v=3"; Type="Verify"},
    @{Name="RSA Encryption"; Folder="rsa"; SubFolder="encrypt"; JsFile="rsa.js?v=3"; Type="Encrypt"},
    @{Name="RSA Decryption"; Folder="rsa"; SubFolder="decrypt"; JsFile="rsa.js?v=3"; Type="Decrypt"},
    
    # ECDSA
    @{Name="ECDSA Key Generator"; Folder="ecdsa"; SubFolder="key-generator"; JsFile="ecdsa.js?v=3"; Type="Generate"},
    @{Name="ECDSA Sign Message"; Folder="ecdsa"; SubFolder="sign"; JsFile="ecdsa.js?v=3"; Type="Sign"},
    @{Name="ECDSA Verify Signature"; Folder="ecdsa"; SubFolder="verify"; JsFile="ecdsa.js?v=3"; Type="Verify"}
)

foreach ($page in $cryptoPages) {
    $folderPath = "src\pages\$($page.Folder)\$($page.SubFolder)"
    New-Item -Path $folderPath -ItemType Directory -Force | Out-Null
    
    $filePath = Join-Path $folderPath "index.astro"
    
    $description = switch ($page.Type) {
        "Encrypt" { "This online tool helps you encrypt text or a file using $($page.Name -replace ' Encryption', ''). Supports various modes and padding schemes." }
        "Decrypt" { "This online tool helps you decrypt text or a file using $($page.Name -replace ' Decryption', ''). Supports various modes and padding schemes." }
        "Generate" { "Generate $($page.Name -replace ' Key Generator', '') key pairs online. Free cryptographic key generator tool." }
        "Sign" { "Sign messages using $($page.Name -replace ' Sign Message', ''). Free online digital signature tool." }
        "Verify" { "Verify $($page.Name -replace ' Verify Signature', '') signatures. Free online signature verification tool." }
    }
    
    $activePage = "$($page.Folder)/$($page.SubFolder)/"
    
    $content = @"
---
import EncodingPage from '../../../components/EncodingPage.astro';

const title = "$($page.Name)";
const description = "$description";
const toolName = "$($page.Type)";
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
Write-Host "Done! Created $($cryptoPages.Count) cryptography pages."
Write-Host "Total: AES(2) + DES(2) + Triple-DES(2) + RC4(2) + RSA(5) + ECDSA(3) = 16 pages"
