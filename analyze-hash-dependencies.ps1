# Script to analyze all hash HTML files and extract their JS dependencies

$hashFiles = Get-ChildItem -Path "d:\WorkSpace\all-web-tools" -Filter "*.html" | 
    Where-Object { $_.Name -match "^(md|sha|keccak|blake|ripemd|shake|double_sha)" -and $_.Name -notmatch "file|checksum" }

$results = @()

foreach ($file in $hashFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract algorithm name
    if ($content -match 'window\.method\s*=\s*(\w+)') {
        $algorithm = $matches[1]
    } else {
        $algorithm = "unknown"
    }
    
    # Extract main JS file
    if ($content -match "src:\s*'(https?://[^']+)'[^}]*window\.method") {
        $jsFile = $matches[1]
        $isExternal = $true
    } elseif ($content -match "src:\s*'(js/[^']+)'[^}]*window\.method") {
        $jsFile = $matches[1]
        $isExternal = $false
    } else {
        $jsFile = "unknown"
        $isExternal = $false
    }
    
    $results += [PSCustomObject]@{
        FileName = $file.Name
        Algorithm = $algorithm
        JSFile = $jsFile
        IsExternal = $isExternal
    }
}

Write-Host "`n=== Hash Algorithm JS Dependencies ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize

# Group by external vs local
Write-Host "`n=== External CDN Libraries ===" -ForegroundColor Yellow
$results | Where-Object IsExternal -eq $true | Format-Table -AutoSize

Write-Host "`n=== Local JS Files ===" -ForegroundColor Green
$results | Where-Object IsExternal -eq $false | Format-Table -AutoSize
