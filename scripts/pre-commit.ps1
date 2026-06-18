# Step 1: ESLint — fast, free
Write-Host "Running ESLint..." -ForegroundColor Cyan
npx eslint src/ tests/ --max-warnings 0
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ESLint failed. Fix errors before committing." -ForegroundColor Red
    Write-Host "Run: npm run lint:fix" -ForegroundColor Yellow
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
$RESULT = $DIFF | claude --agent code-reviewer --print 2>$null
Write-Host $RESULT
if ($RESULT -match "BLOCK") {
    Write-Host "❌ Commit blocked by Claude. Fix issues or skip with: git commit --no-verify" -ForegroundColor Red
    exit 1
}
Write-Host "✅ LGTM - commit allowed" -ForegroundColor Green
exit 0