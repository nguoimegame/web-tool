# Script to update all hash pages with correct JS file paths (external CDN or local)

$mapping = @{
    # SHA1
    'sha1.astro' = @{Algorithm='sha1'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha1/0.7.0/sha1.min.js'}
    
    # SHA2 (SHA224, SHA256, Double SHA256)
    'sha224.astro' = @{Algorithm='sha224'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.11.0/sha256.min.js'}
    'sha256.astro' = @{Algorithm='sha256'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.11.0/sha256.min.js'}
    'double_sha256.astro' = @{Algorithm='double_sha256'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.11.0/sha256.min.js'}
    
    # SHA2-512 (SHA384, SHA512, SHA512/224, SHA512/256)
    'sha384.astro' = @{Algorithm='sha384'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha512/0.9.0/sha512.min.js'}
    'sha512.astro' = @{Algorithm='sha512'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha512/0.9.0/sha512.min.js'}
    'sha512_224.astro' = @{Algorithm='sha512_224'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha512/0.9.0/sha512.min.js'}
    'sha512_256.astro' = @{Algorithm='sha512_256'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha512/0.9.0/sha512.min.js'}
    
    # SHA3
    'sha3_224.astro' = @{Algorithm='sha3_224'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    'sha3_256.astro' = @{Algorithm='sha3_256'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    'sha3_384.astro' = @{Algorithm='sha3_384'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    'sha3_512.astro' = @{Algorithm='sha3_512'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    
    # Keccak
    'keccak_224.astro' = @{Algorithm='keccak_224'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    'keccak_256.astro' = @{Algorithm='keccak_256'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    'keccak_384.astro' = @{Algorithm='keccak_384'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    'keccak_512.astro' = @{Algorithm='keccak_512'; JsFile='https://cdnjs.cloudflare.com/ajax/libs/js-sha3/0.9.3/sha3.min.js'}
    
    # MD (already using HashPage component)
    'md4.astro' = @{Algorithm='md4'; JsFile='md4.min.js'}
    'md5.astro' = @{Algorithm='md5'; JsFile='md5.min.js'}
}

$pagesDir = "src\pages"
$updated = 0

foreach ($fileName in $mapping.Keys) {
    $filePath = Join-Path $pagesDir $fileName
    
    if (Test-Path $filePath) {
        $config = $mapping[$fileName]
        $content = Get-Content -Path $filePath -Raw
        
        # Update jsFile
        $content = $content -replace 'jsFile="[^"]*"', "jsFile=`"$($config.JsFile)`""
        
        # Update algorithmName (case sensitive)
        $content = $content -replace 'algorithmName="[^"]*"', "algorithmName=`"$($config.Algorithm)`""
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $fileName -> $($config.Algorithm) using $($config.JsFile)" -ForegroundColor Green
        $updated++
    }
}

Write-Host "`nDone! Updated $updated hash pages with correct JS dependencies." -ForegroundColor Cyan
