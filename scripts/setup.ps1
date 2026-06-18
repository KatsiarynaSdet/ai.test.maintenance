# setup.ps1
# Run once after cloning: .\scripts\setup.ps1
# Or from root: .\setup.ps1
#
# NOTE: this file must keep its UTF-8 BOM. Windows PowerShell 5.1 reads BOM-less
# .ps1 files using the system ANSI codepage, which mangles the literal arrow (->)
# and em-dash (-) characters embedded in the heredocs below into mojibake before
# they're written out. (The generated *output* files stay UTF-8 without BOM via
# Write-Utf8File/Append-Utf8File below.)

# --- helpers: always write real UTF-8 without BOM and with LF line endings ---
function Write-Utf8File {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Value,
        [switch]$NoNewline
    )

    $directory = Split-Path -Parent $Path
    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Force -Path $directory | Out-Null
    }

    $normalized = $Value -replace "`r`n", "`n" -replace "`r", "`n"
    if (-not $NoNewline -and -not $normalized.EndsWith("`n")) {
        $normalized += "`n"
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $normalized, $utf8NoBom)
}

function Append-Utf8File {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Value
    )

    $normalized = $Value -replace "`r`n", "`n" -replace "`r", "`n"
    if (-not $normalized.EndsWith("`n")) {
        $normalized += "`n"
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::AppendAllText($Path, $normalized, $utf8NoBom)
}

# --- reliably compute the project root ---
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path -Parent $scriptPath
$root = if ((Split-Path -Leaf $scriptDir) -eq "scripts") {
    Split-Path -Parent $scriptDir
} else {
    $scriptDir
}

Write-Host "Root: $root" -ForegroundColor Gray
Write-Host "Setting up AI code review pipeline..." -ForegroundColor Cyan

# --- check dependencies ---
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "WARNING: claude not found. Install: npm install -g @anthropic-ai/claude-code" -ForegroundColor Yellow
}

# --- load .env at the start ---
if (Test-Path "$root\.env") {
    Get-Content "$root\.env" | ForEach-Object {
        if ($_ -match '^([^#].+?)=(.+)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
    Write-Host "OK: .env loaded" -ForegroundColor Green
} else {
    Write-Host "WARNING: .env not found - create it:" -ForegroundColor Yellow
    Write-Host "   ANTHROPIC_API_KEY=sk-ant-..." -ForegroundColor Gray
    Write-Host "   SLACK_WEBHOOK_URL=https://hooks.slack.com/..." -ForegroundColor Gray
}

# --- create folders ---
@(
    ".claude\agents",
    ".claude\skills",
    ".github",
    "scripts",
    "docs\adr",
    "docs\architecture\diagrams",
    ".githooks"
) | ForEach-Object {
    New-Item -ItemType Directory -Force -Path "$root\$_" | Out-Null
}
Write-Host "OK: Folders created" -ForegroundColor Green

# --- CLAUDE.md ---
Write-Utf8File "$root\CLAUDE.md" @"
# Project Context

## Domain Rules
- Money = integers only (no floats)
- Eventual consistency is expected
- DB queries → parameterized only
- Validate Content-Type on all endpoints
- Retries → exponential backoff

## External test sites
- tests/documentation.spec.ts targets external site playwright.dev — hardcoded URL is intentional

## Ignore
- generated/**
- migrations/**

## Severity
BLOCK:
- SQL injection
- hardcoded secrets
- swallowed exceptions (including .catch(() => null) in tests)
- float money

WARN:
- magic numbers
- primitive obsession

IGNORE:
- missing docstrings
- formatting
- style
"@
Write-Host "OK: CLAUDE.md created" -ForegroundColor Green

# --- agents ---
$agents = @{
    "code-reviewer" = @"
# code-reviewer

You are a strict code reviewer focused only on correctness and security.

## BLOCK these issues:
- correctness bugs (wrong logic, off-by-one, null refs)
- security issues (SQL injection, hardcoded secrets, XSS)
- swallowed exceptions (empty catch blocks, .catch(() => null) in tests)
- float used for money

## IGNORE completely:
- formatting
- style
- naming conventions
- test coverage
- architecture suggestions

## Output format
Respond ONLY with valid JSON, no markdown, no explanation:

{
  "verdict": "BLOCK" | "LGTM",
  "issues": [
    {
      "severity": "BLOCK" | "WARN",
      "message": "description of the issue"
    }
  ]
}
"@
    "security-reviewer" = @"
# security-reviewer

You are a security specialist. Focus ONLY on security vulnerabilities.

## FOCUS on:
- SQL injection
- hardcoded secrets and API keys
- authentication and authorization flaws
- insecure dependencies
- XSS vulnerabilities

## OUT OF SCOPE:
- style
- performance
- naming conventions

## Model tier: strong

## Output format
Respond ONLY with valid JSON:

{
  "verdict": "BLOCK" | "LGTM",
  "issues": [
    {
      "severity": "BLOCK" | "WARN",
      "category": "security",
      "message": "description"
    }
  ]
}
"@
    "correctness-reviewer" = @"
# correctness-reviewer

You are a correctness specialist. Focus ONLY on logic bugs.

## FOCUS on:
- logic bugs
- edge cases not handled
- off-by-one errors
- null/undefined references
- swallowed exceptions

## OUT OF SCOPE:
- style
- naming conventions
- performance

## Model tier: strong

## Output format
Respond ONLY with valid JSON:

{
  "verdict": "BLOCK" | "LGTM",
  "issues": [
    {
      "severity": "BLOCK" | "WARN",
      "category": "correctness",
      "message": "description"
    }
  ]
}
"@
    "performance-reviewer" = @"
# performance-reviewer

You are a performance specialist. Focus ONLY on performance issues.

## FOCUS on:
- O(n2) algorithms
- N+1 database queries
- unnecessary memory allocations
- blocking operations

## OUT OF SCOPE:
- security
- intent
- style

## Model tier: mid

## Output format
Respond ONLY with valid JSON:

{
  "verdict": "WARN" | "LGTM",
  "issues": [
    {
      "severity": "WARN",
      "category": "performance",
      "message": "description"
    }
  ]
}
"@
    "test-reviewer" = @"
# test-reviewer

You are a test coverage specialist. Focus ONLY on test gaps.

## FOCUS on:
- coverage of new branches
- missing edge cases in tests
- untested error paths

## OUT OF SCOPE:
- implementation quality
- style
- performance

## Model tier: mid

## Output format
Respond ONLY with valid JSON:

{
  "verdict": "WARN" | "LGTM",
  "issues": [
    {
      "severity": "WARN",
      "category": "tests",
      "message": "description"
    }
  ]
}
"@
    "intent-reviewer" = @"
# intent-reviewer

You are an intent specialist. Focus ONLY on whether code matches the linked issue.

## FOCUS on:
- does the code match what the issue/ticket describes?
- are there unrelated changes in this PR?
- is the scope correct?

## OUT OF SCOPE:
- everything else

## Model tier: strong

## Input required:
- linked issue description
- PR diff

## Output format
Respond ONLY with valid JSON:

{
  "verdict": "BLOCK" | "LGTM",
  "issues": [
    {
      "severity": "BLOCK" | "WARN",
      "category": "intent",
      "message": "description"
    }
  ]
}
"@
}

$agents.GetEnumerator() | ForEach-Object {
    Write-Utf8File "$root\.claude\agents\$($_.Key).md" $_.Value
    Write-Host "OK: $($_.Key).md created" -ForegroundColor Green
}

# --- skills ---
Write-Utf8File "$root\.claude\skills\analyze-test-results.md" @"
# analyze-test-results

## When to apply
When asked to analyze test results, failures, or test output.

## Procedure
1. Count total, passed, failed tests
2. Group failures by error type
3. Identify patterns (3+ tests failing for same reason = pattern)
4. Suggest root cause for each pattern
5. Recommend fix priority: BLOCK first, then WARN

## Output format
Summary → Patterns → Recommendations
"@

Write-Utf8File "$root\.claude\skills\generate-test-cases.md" @"
# generate-test-cases

## When to apply
When asked to generate, create, or write test cases from requirements, tickets, or specs.

## Procedure
1. Identify happy path
2. Identify edge cases
3. Identify negative cases
4. Map each test to requirement ID
5. Generate Playwright TypeScript code following existing patterns in tests/

## Rules
- Never use .catch(() => null)
- Always use explicit assertions
- Follow page object pattern from src/pages/
"@

Write-Utf8File "$root\.claude\skills\review-pr.md" @"
# review-pr

## When to apply
When asked to review, check, or inspect code before committing or creating a PR.

## Procedure
1. Check for BLOCK issues from CLAUDE.md
2. Check for swallowed exceptions
3. Check test coverage of new code
4. Verify intent matches commit message
5. Return verdict: BLOCK or LGTM with reasons
"@

Write-Utf8File "$root\.claude\skills\generate-adr.md" @"
# generate-adr

## When to apply
When asked to create an ADR, document a decision, or record an architectural choice.

## Procedure
1. Ask: what problem are we solving?
2. Ask: what alternatives were considered?
3. Fill template from docs/adr/001-template.md
4. Add AI review questions at the end

## Output
Save to docs/adr/NNN-title.md where NNN is next number
"@

Write-Host "OK: Skills created" -ForegroundColor Green

# --- PR Template ---
Write-Utf8File "$root\.github\pull_request_template.md" @"
## AI Pre-Review
- [ ] Ran Layer 1 (IDE)
- [ ] Layer 2 passed locally
- [ ] Layer 3 reviewed
- [ ] Findings addressed or justified

## Architecture Changes
- [ ] No architectural boundaries changed
- [ ] ADR created/updated in docs/adr/
- [ ] Architecture diagram updated in docs/architecture/diagrams/

## Layer 3 Summary
<!-- What CI reviewer found -->

## What I Want Human Eyes On
<!-- What AI missed or didn't understand -->
"@
Write-Host "OK: pull_request_template.md created" -ForegroundColor Green

# --- ADR template ---
Write-Utf8File "$root\docs\adr\001-template.md" @"
# ADR 001: [Title]

## Context
What is the problem or situation that requires a decision?

## Decision
What did we decide to do?

## Consequences
What are the positive and negative consequences of this decision?

## Open Questions
- [ ] Question 1
- [ ] Question 2

## AI Review
Run in new Claude session:
- What questions should I have answered before this decision?
- Attack this decision — what could go wrong?
"@
Write-Host "OK: ADR template created" -ForegroundColor Green

# --- prompts.md ---
Write-Utf8File "$root\docs\prompts.md" @"
# AI Workflow Prompts

## ADR Review
Read this ADR and tell me:
1. What questions should I have answered before making this decision?
2. Attack this decision — what are the weakest points?
3. What alternatives did I not consider?

## Architecture Diagram
Based on the following sources, generate a Mermaid diagram.
Focus on ONE boundary only.
After generating, verify each element exists in the sources.
Sources: [paste sources here]

## PR Architecture Check
Does this PR change any architectural boundaries?
If yes, is there a corresponding ADR?
"@
Write-Host "OK: prompts.md created" -ForegroundColor Green

# --- README ---
if (-not (Test-Path "$root\README.md")) {
    Write-Utf8File "$root\README.md" @"
# ai.test.maintenance

## Setup
Run once after cloning:
.\scripts\setup.ps1

## Layers
- Layer 1: IDE agent (Claude Code / Cursor)
- Layer 2: pre-commit hook (local)
- Layer 3: CI reviewer (GitHub Actions)
"@
    Write-Host "OK: README.md created" -ForegroundColor Green
} else {
    Write-Host "SKIP: README.md already exists" -ForegroundColor Yellow
}

# --- .gitattributes: protect hook files and generated markdown from CRLF/BOM issues ---
$gitattributesPath = "$root\.gitattributes"
$gitattributesBlock = @"
.githooks/* text eol=lf
*.sh text eol=lf
*.md text eol=lf
*.ps1 text eol=lf
"@

if (Test-Path $gitattributesPath) {
    $currentAttributes = Get-Content $gitattributesPath -Raw
    foreach ($line in ($gitattributesBlock -split "`n")) {
        if ($line.Trim() -and $currentAttributes -notmatch [regex]::Escape($line.Trim())) {
            Append-Utf8File $gitattributesPath $line
        }
    }
} else {
    Write-Utf8File $gitattributesPath $gitattributesBlock
}
Write-Host "OK: .gitattributes updated" -ForegroundColor Green

# --- pre-commit hook ---
$hookWrapper = @"
#!/bin/sh
powershell.exe -ExecutionPolicy Bypass -File scripts/pre-commit.ps1
"@
Write-Utf8File "$root\.githooks\pre-commit" $hookWrapper -NoNewline
Write-Host "OK: .githooks/pre-commit created" -ForegroundColor Green

# Use repository-local hooks folder instead of .git/hooks, so the hook can be versioned.
if (Get-Command git -ErrorAction SilentlyContinue) {
    Push-Location $root
    try {
        git config core.hooksPath .githooks
        git add .githooks/pre-commit 2>$null
        git update-index --chmod=+x .githooks/pre-commit 2>$null
        Write-Host "OK: git core.hooksPath set to .githooks" -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

# --- copy into scripts/ ---
if ($scriptDir -ne "$root\scripts") {
    Copy-Item $scriptPath "$root\scripts\setup.ps1" -Force
    Write-Host "OK: setup.ps1 copied to scripts/" -ForegroundColor Green
}

Write-Host ""
Write-Host "OK: All done!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Add ANTHROPIC_API_KEY to .env" -ForegroundColor Gray
Write-Host "  2. Add SLACK_WEBHOOK_URL to .env" -ForegroundColor Gray
Write-Host "  3. Install Claude Code: npm install -g @anthropic-ai/claude-code" -ForegroundColor Gray
