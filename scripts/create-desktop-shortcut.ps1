$WshShell = New-Object -comObject WScript.Shell
$Desktop = [System.Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut("$Desktop\Sarani UK Website & CCTV.lnk")
$Shortcut.TargetPath = "e:\ANTIGRAVITY\website\START-SARANI-WEBSITE.bat"
$Shortcut.WorkingDirectory = "e:\ANTIGRAVITY\website"
$Shortcut.Description = "Start Sarani.uk Website, CCTV streams, and Cloudflare Tunnel"
$Shortcut.Save()
Write-Host "✦ Desktop Shortcut created successfully: $Desktop\Sarani UK Website & CCTV.lnk" -ForegroundColor Green
