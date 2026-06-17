$DIFF = git diff --cached --unified=3
if (-not $DIFF) {
    Write-Host "No staged changes, skipping review."
    exit 0
}
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "WARNING: claude not found, skipping review."
    exit 0
}
Write-Host "Running Claude code review..."
$RESULT = $DIFF | claude --agent code-reviewer --print 2>$null
Write-Host $RESULT
if ($RESULT -match "BLOCK") {
    Write-Host "Commit blocked. Fix issues or skip with: git commit --no-verify"
    exit 1
}
Write-Host "LGTM - commit allowed"
exit 0