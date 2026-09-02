$ScriptDir = Split-Path -Parent $PSScriptRoot
$WshShell = New-Object -comObject WScript.Shell
$Desktop = [System.Environment]::GetFolderPath('Desktop')

# 1. Desktop Shortcut
$DesktopShortcut = $WshShell.CreateShortcut("$Desktop\Sarani UK Website & CCTV.lnk")
$DesktopShortcut.TargetPath = "$ScriptDir\START-SARANI-WEBSITE.bat"
$DesktopShortcut.WorkingDirectory = "$ScriptDir"
$DesktopShortcut.Description = "Start Sarani.uk Website, CCTV streams, and Cloudflare Tunnel"
$DesktopShortcut.Save()

# 2. Workspace Shortcut
$FolderShortcut = $WshShell.CreateShortcut("$ScriptDir\START-SARANI-WEBSITE - Shortcut.lnk")
$FolderShortcut.TargetPath = "$ScriptDir\START-SARANI-WEBSITE.bat"
$FolderShortcut.WorkingDirectory = "$ScriptDir"
$FolderShortcut.Description = "Start Sarani.uk Website, CCTV streams, and Cloudflare Tunnel"
$FolderShortcut.Save()

Write-Host "✦ Desktop Shortcut created successfully: $Desktop\Sarani UK Website & CCTV.lnk" -ForegroundColor Green
