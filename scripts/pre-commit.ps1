# Step 1: ESLint — fast, free
Write-Host "Running ESLint..." -ForegroundColor Cyan
npx eslint src/ tests/ --max-warnings 0
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ESLint failed. Fix errors before committing." -ForegroundColor Red
    Write-Host "Run: npm run lint:fix" -ForegroundColor Yellow
    & "$PSScriptRoot\send-report.ps1" -message ":x: ESLint failed on pre-commit. Run: npm run lint:fix"
    exit 1
}
Write-Host "✅ ESLint passed" -ForegroundColor Green

# Step 2: Claude code-reviewer — deeper analysis
$DIFF = git diff --cached --unified=3
if (-not $DIFF) {
    Write-Host "No staged changes, skipping Claude review."
    exit 0
}
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "WARNING: claude not found, skipping review." -ForegroundColor Yellow
    exit 0
}

Write-Host "Running Claude code review..." -ForegroundColor Cyan
$AGENT_PROMPT = Get-Content ".claude/agents/code-reviewer.md" -Raw
$PROMPT = "$AGENT_PROMPT`n`nReview this diff:`n`n$DIFF"
$RESULT = $PROMPT | claude --print 2>$null

try {
    $CLEAN = $RESULT -replace '```json', '' -replace '```', ''
    $CLEAN = $CLEAN.Trim()
    $JSON = $CLEAN | ConvertFrom-Json

    if ($JSON.verdict -eq "BLOCK") {
        $issues = ($JSON.issues | Where-Object { $_.severity -eq "BLOCK" } | ForEach-Object { "• $($_.message)" }) -join "`n"
        Write-Host "❌ Commit blocked:" -ForegroundColor Red
        $JSON.issues | Where-Object { $_.severity -eq "BLOCK" } | ForEach-Object {
            Write-Host "  - $($_.message)" -ForegroundColor Red
        }
        & "$PSScriptRoot\send-report.ps1" -message ":x: Commit blocked by Claude review:`n$issues"
        exit 1
    }

    Write-Host "✅ LGTM - commit allowed" -ForegroundColor Green
    & "$PSScriptRoot\send-report.ps1" -message ":white_check_mark: Pre-commit passed. ESLint + Claude review: LGTM"
    exit 0

} catch {
    Write-Host "⚠️ Could not parse Claude response, blocking commit." -ForegroundColor Red
    Write-Host $RESULT
    & "$PSScriptRoot\send-report.ps1" -message ":warning: Could not parse Claude response. Commit blocked."
    exit 1
}