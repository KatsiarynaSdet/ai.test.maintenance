## CI Demo

Playwright tests are executed in GitHub Actions with parallelization.

🔗 Latest report:
https://katsiarynasdet.github.io/ai.test.maintenance/

## What is implemented

- CI pipeline with GitHub Actions
- Parallel Playwright execution (workers: 3)
- HTML reporting via GitHub Pages 
- Failure notifications via Microsoft Teamscat READ.md
- Dependency security scan (yarn audit)

## Setup
Run once after cloning:
``````powershell
.\scripts\setup.ps1
``````
Installs CLAUDE.md, code-reviewer agent, and PR template.
## Slack Reporting

QA reports are sent to Slack #qa-reports channel via webhook.

### Setup
1. Create a Slack App at api.slack.com/apps
2. Enable Incoming Webhooks
3. Add webhook URL to .env:
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

### Send a report
   .\scripts\send-report.ps1 -message "your message"

### Examples
   # Send retro
   .\scripts\send-report.ps1 -message ":mag: *AI Code Review Retro* ..."

   # Send test results
   .\scripts\send-report.ps1 -message ":white_check_mark: All 21 tests passed"

   # Send alert
   .\scripts\send-report.ps1 -message ":x: 3 tests failed"

## AI Code Review Pipeline

Multi-layer AI code review pipeline using Claude Code.

### Layers
- Layer 1: IDE agent (Claude Code) - interactive review
- Layer 2: pre-commit hook - blocks bad commits locally
- Layer 3: CI reviewer - reviews every PR

### Agents
Specialist subagents in .claude/agents/:
- security-reviewer - SQL injection, secrets, XSS
- correctness-reviewer - logic bugs, edge cases
- performance-reviewer - N+1 queries
- test-reviewer - missing coverage
- intent-reviewer - does code match the ticket?

### Metrics
Track per PR: TP / FP / Nice-to-have / Time to merge
