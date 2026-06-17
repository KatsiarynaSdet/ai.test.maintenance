# scripts/send-report.ps1
# Usage: .\scripts\send-report.ps1 -message "your message"

param(
    [string]$message = "QA Pipeline report"
)

# загружаем .env
Get-Content .env | ForEach-Object {
    if ($_ -match '^(.+?)=(.+)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}

$webhookUrl = $env:SLACK_WEBHOOK_URL

if (-not $webhookUrl) {
    Write-Host "❌ SLACK_WEBHOOK_URL not found in .env" -ForegroundColor Red
    exit 1
}

$body = @{
    text = $message
} | ConvertTo-Json

Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType 'application/json'
Write-Host "✅ Sent to Slack" -ForegroundColor Green