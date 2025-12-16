# Script to fix activePage and reverseLink in all encoding pages

$files = Get-ChildItem -Path "src\pages" -Filter "*.astro" -Recurse

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    if ($content -match 'activePage = "(.+?)\.astro"') {
        $oldActivePage = $matches[1] + ".astro"
        $newActivePage = $matches[1]
        $content = $content -replace [regex]::Escape("activePage = `"$oldActivePage`""), "activePage = `"$newActivePage`""
        Write-Host "Fixed activePage in: $($file.Name)"
    }
    
    if ($content -match 'reverseLink = "(.+?)\.html"') {
        $oldReverseLink = $matches[1] + ".html"
        $newReverseLink = $matches[1]
        $content = $content -replace [regex]::Escape("reverseLink = `"$oldReverseLink`""), "reverseLink = `"$newReverseLink`""
        Write-Host "Fixed reverseLink in: $($file.Name)"
    }
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
}

Write-Host "`nDone! Fixed activePage and reverseLink in all pages."
