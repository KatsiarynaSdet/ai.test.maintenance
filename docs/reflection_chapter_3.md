# Reflection — Chapter 2 (Short)

## Summary
AI detects **explicit issues (spec, patterns)**.  
Humans detect **context, risks, and long-term impact**.  
Best results = **hybrid review**.

---

## What AI Catches Well
- Spec violations (selectors, waits, error handling)
- Code duplication
- Inconsistent patterns
- Non-standard API usage

---

## What AI Misses
- Context & assumptions (redirects, history issues)
- Environment (browser, cache, CI)
- Performance/SLA reasoning
- Maintenance cost
- Deep accessibility (keyboard, aria)
- Coverage gaps (href, error pages)

---

## Key Differences
- **AI:** “Does it work now?”
- **Human:** “What can break later?”

---

## Most Common Problems
1. Selectors & waits (flakiness)
2. Code duplication
3. Coverage gaps
4. Missing accessibility
5. State/environment issues

---

## Lessons
### Use AI for:
- Spec compliance
- Pattern detection
- Duplication

### Use Humans for:
- Context & assumptions
- Edge cases
- Maintenance & risk

---

## Best Approach
- AI → fast scan (60–70%)
- Human → deep review (30–40%)
- Together → **~95% coverage**

---

## Conclusion
Main gaps in tests:
- Edge cases
- Accessibility
- Environment behavior

Main risk:
- Duplication + hardcoded data

→ Fix with structured + hybrid review process


## Improved prompt
Refactor this Playwright test for clarity, low flakiness, and maintainability.

Constraints:

* Use semantic locators (`getByRole`, etc.)
* No hard-coded waits
* No silent error handling
* Keep behavior unchanged

Guidelines:

* Remove duplication (extract helpers if needed)
* Validate real outcomes (not just URL)
* Centralize repeated data
* Keep tests short and readable
* Add only meaningful edge-case assertions
* Prefer measurable assertions (no vague checks)
* Highlight a11y gaps if relevant

Output:

1. Issues (grouped by severity)
2. Refactoring plan
3. Improved code
4. Rationale (brief)
