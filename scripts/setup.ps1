# setup.ps1
# Run once after cloning: .\scripts\setup.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent

Write-Host "🚀 Setting up AI code review pipeline..." -ForegroundColor Cyan

# --- папки ---
New-Item -ItemType Directory -Force -Path "$root\.claude\agents" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\.github" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\scripts" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\docs\adr" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\docs\architecture\diagrams" | Out-Null

Write-Host "✅ Folders created" -ForegroundColor Green

# --- CLAUDE.md ---
Set-Content "$root\CLAUDE.md" -Encoding UTF8 -Value @"
# Project Context

## Domain Rules
- Money = integers only (no floats)
- Eventual consistency is expected
- DB queries → parameterized only
- Validate Content-Type on all endpoints
- Retries → exponential backoff

## Ignore
- generated/**
- migrations/**

## Severity
BLOCK:
- SQL injection
- hardcoded secrets
- swallowed exceptions
- float money

WARN:
- magic numbers
- primitive obsession

IGNORE:
- missing docstrings
- formatting
- style
"@
Write-Host "✅ CLAUDE.md created" -ForegroundColor Green

# --- code-reviewer.md ---
Set-Content "$root\.claude\agents\code-reviewer.md" -Encoding UTF8 -Value @"
# code-reviewer

You are a strict code reviewer focused only on correctness and security.

## BLOCK these issues:
- correctness bugs (wrong logic, off-by-one, null refs)
- security issues (SQL injection, hardcoded secrets, XSS)
- swallowed exceptions (empty catch blocks)
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
Write-Host "✅ code-reviewer.md created" -ForegroundColor Green

# --- security-reviewer.md ---
Set-Content "$root\.claude\agents\security-reviewer.md" -Encoding UTF8 -Value @"
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
Write-Host "✅ security-reviewer.md created" -ForegroundColor Green

# --- correctness-reviewer.md ---
Set-Content "$root\.claude\agents\correctness-reviewer.md" -Encoding UTF8 -Value @"
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
Write-Host "✅ correctness-reviewer.md created" -ForegroundColor Green

# --- performance-reviewer.md ---
Set-Content "$root\.claude\agents\performance-reviewer.md" -Encoding UTF8 -Value @"
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
Write-Host "✅ performance-reviewer.md created" -ForegroundColor Green

# --- test-reviewer.md ---
Set-Content "$root\.claude\agents\test-reviewer.md" -Encoding UTF8 -Value @"
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
Write-Host "✅ test-reviewer.md created" -ForegroundColor Green

# --- intent-reviewer.md ---
Set-Content "$root\.claude\agents\intent-reviewer.md" -Encoding UTF8 -Value @"
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
Write-Host "✅ intent-reviewer.md created" -ForegroundColor Green

# --- PR Template ---
Set-Content "$root\.github\pull_request_template.md" -Encoding UTF8 -Value @"
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
Write-Host "✅ pull_request_template.md created" -ForegroundColor Green

# --- ADR template ---
Set-Content "$root\docs\adr\001-template.md" -Encoding UTF8 -Value @"
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
Write-Host "✅ ADR template created" -ForegroundColor Green

# --- prompts.md ---
Set-Content "$root\docs\prompts.md" -Encoding UTF8 -Value @"
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
Sources:
[paste sources here]

## PR Architecture Check
Does this PR change any architectural boundaries?
If yes, is there a corresponding ADR?
"@
Write-Host "✅ prompts.md created" -ForegroundColor Green

# --- README ---
if (-not (Test-Path "$root\README.md")) {
    Set-Content "$root\README.md" -Encoding UTF8 -Value @"
# ai.test.maintenance

## Setup
Run once after cloning:
.\scripts\setup.ps1

## Layers
- Layer 1: IDE agent (Claude Code / Cursor)
- Layer 2: pre-commit hook (local)
- Layer 3: CI reviewer (GitHub Actions)
"@
    Write-Host "✅ README.md created" -ForegroundColor Green
} else {
    Write-Host "⏭️  README.md already exists, skipping" -ForegroundColor Yellow
}

# --- копируем скрипт в scripts/ ---
Copy-Item $MyInvocation.MyCommand.Path "$root\scripts\setup.ps1" -Force

Write-Host ""
Write-Host "✅ All done!" -ForegroundColor Green   