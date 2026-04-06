# Navigation Tests — One Pager

## Status
Working but NOT spec-compliant. Overall: MEDIUM risk.

## Critical Issues (Fix Now)
- Non-standard selectors → brittle
- Hard waits (waitForTimeout) → flakiness
- Errors swallowed (.catch) → false positives

## Key Risks
- Flaky tests
- Weak validation (URL-only)
- High maintenance (duplication, hardcoding)
- Accessibility gaps

## Coverage Gaps
- No href validation
- No page content checks
- Broad URL matching
- No back navigation validation
- No keyboard/a11y tests

## Architecture Issues
- 3x duplicated test flow
- Scattered test data
- Inconsistent patterns

## Action Plan
### P0 (Immediate)
- Fix selectors
- Remove hard waits
- Fix navigation handling

### P1 (Short-term)
- Reuse navigation logic
- Validate href + content
- Centralize test data

### P2+
- Add environment + a11y + edge validations

## Outcome
After fixes: stable, maintainable, high-confidence tests
