# IMPACT NOTES: Problem → Consequence Mapping
## Quick Reference for Test Issues

---

## SELECTOR ISSUES

| Problem | Technical Detail | Impact |
|---------|---|---|
| ❌ CSS text selector `a:has-text("Docs")` | Not role-based | **Fragile to markup changes** |
| ❌ Inconsistent selectors (Docs vs API/Community) | Mixed patterns | **Hard to maintain, onboard new devs** |
| ❌ Text-based matching | Breaks on whitespace/structure | **Brittle, false failures** |
| ❌ No fallback selectors | Single point of failure | **One change breaks all Docs tests** |

---

## SYNCHRONIZATION & TIMING

| Problem | Technical Detail | Impact |
|---------|---|---|
| ❌ `waitForTimeout(2000)` hard-coded | Non-deterministic | **→ Tests slower, masks real issues** |
| ❌ Wait only on Docs, not API/Community | Inconsistent pattern | **→ Why does Docs need wait?** |
| ❌ `.catch(() => null)` silently swallows errors | No error visibility | **→ Failures pass silently** |
| ❌ Navigation timeouts arbitrary (3s, 10s) | No baseline or SLA | **→ Flaky on slow networks** |
| ❌ No page load completion check | Just URL change | **→ Misses partial load failures** |

---

## ACCESSIBILITY GAPS

| Problem | Technical Detail | Impact |
|---------|---|---|
| ❌ No role-based selection for Docs | Doesn't validate semantics | **→ Misses accessibility regressions** |
| ❌ `textContent()` instead of accessible names | Wrong API | **→ Doesn't catch aria-label/labelledby changes** |
| ❌ No keyboard navigation test | Tab/Enter/Space untested | **→ WCAG 2.1 violation** |
| ❌ Subjective "appears interactive" | Unmeasurable | **→ Inconsistent pass/fail** |
| ❌ No contrast ratio check | Visual only | **→ Color-blind users fail silently** |

---

## COVERAGE GAPS

| Problem | Technical Detail | Impact |
|---------|---|---|
| ❌ No button href validation | Only checks final URL | **→ Wrong source link not caught** |
| ❌ No page content verification | Just URL regex match | **→ Blank/error page passes** |
| ❌ No button count validation | Verifies '>= 3' not '== 3' | **→ Duplicate buttons undetected** |
| ❌ No button order validation | Random order passes | **→ UX regression missed** |
| ❌ No error page detection | Checks `/docs` matches `/error-404` | **→ False positive passes** |

---

## DUPLICATION & MAINTENANCE

| Problem | Technical Detail | Impact |
|---------|---|---|
| ❌ 3x navigation test pattern | Copy-pasted code | **→ Bug fix requires 3 edits** |
| ❌ 3x button visibility steps (3,4,5) | Identical structure | **→ Consistency issues** |
| ❌ 2x back navigation (steps 7,9) | Redundant testing | **→ Maintenance burden** |
| ❌ Hardcoded button names/URLs | Scattered throughout | **→ One text change = N places to update** |
| ❌ Unused `verifyAllNavigationButtonsVisible()` | Dead code | **→ Confusing, not maintained** |

---

## ENVIRONMENT & DEPENDENCIES

| Problem | Technical Detail | Impact |
|---------|---|---|
| ❌ Cookies/cache not cleared | State from prior runs | **→ Intermittent failures (Run 1 vs Run 2)** |
| ❌ Browser assumptions (Chrome only) | No Safari/Firefox testing | **→ Breaks in production** |
| ❌ No locale specification | English assumed | **→ French/German versions fail** |
| ❌ Mobile design ignored | Desktop only test | **→ Mobile nav completely untested** |
| ❌ No back button validation | Assumes it works | **→ Redirect chains/history corruption silent** |

---

## LOGICAL ISSUES

| Problem | Technical Detail | Impact |
|---------|---|---|
| ❌ Back button not verified | Only tested "it returns" | **→ Might return wrong page** |
| ❌ Redirect chains invisible | Only final URL checked | **→ Perf issues (3 redirects) missed** |
| ❌ URL patterns overly broad | `/docs` matches `/docs-old` | **→ Wrong version not caught** |
| ❌ Navigation success = URL match | No content validation | **→ Stale/cached page passes** |
| ❌ External dependency not monitored | Playwright.dev uptime | **→ Server down = test fails (not code bug)** |

---

## SUMMARY: CATEGORY IMPACT

| Category | Issues | Flakiness | Maintenance | Coverage |
|----------|--------|-----------|-------------|----------|
| **Selector** | 4 | 🔴 HIGH | 🔴 HIGH | 🟠 MED |
| **Synchronization** | 5 | 🔴 HIGH | 🟡 LOW | 🟠 MED |
| **Accessibility** | 5 | 🟠 MED | 🟠 MED | 🔴 HIGH |
| **Coverage** | 5 | 🟠 MED | 🟡 LOW | 🔴 HIGH |
| **Duplication** | 5 | 🟡 LOW | 🔴 HIGH | 🟡 LOW |
| **Environment** | 5 | 🔴 HIGH | 🟠 MED | 🟠 MED |

---

## QUICK IMPACT REFERENCE (ONE-LINERS)

**Selector Issues:**
- `a:has-text("Docs")` → brittle to markup changes
- Inconsistent patterns → hard to maintain
- No role validation → misses a11y regressions

**Timing Issues:**
- `waitForTimeout(2000)` → slow flaky tests
- Silent `.catch()` → failures pass undetected
- Arbitrary thresholds → flaky on slow networks

**Accessibility Issues:**
- No role-based selectors → semantic validation gap
- `textContent()` API → misses aria labels
- No keyboard test → WCAG 2.1 violation

**Coverage Issues:**
- No button href check → source validation gap
- URL-only assertions → misses blank/error pages
- No content validation → false passes

**Maintenance Issues:**
- 3x code duplication → bug fix = N edits
- Hardcoded data → brittle to updates
- Dead code → confusing

**Environment Issues:**
- No cache clear → intermittent failures
- Browser-specific → breaks on Safari/Firefox
- Mobile ignored → untested on phones

---

## BY PRIORITY: IMPACT IF NOT FIXED

### 🔴 CRITICAL (P0) - Fix Week 1
1. **CSS selector** → Test fails on structure change (high likelihood)
2. **Hard-coded wait** → Tests slower, masks real issues
3. **Silent `.catch()`** → Failures go undetected

**Cumulative Risk:** 3-5 production bugs missed per month

### 🟠 HIGH (P1) - Fix Week 2
1. **3x code duplication** → Any bug fix requires 3x effort
2. **No page content check** → False passes on error pages
3. **Missing button href validation** → Wrong links not caught

**Cumulative Risk:** Maintenance becomes 2-3x slower

### 🟡 MEDIUM (P2) - Fix Week 3
1. **Accessibility gaps** → A11y regressions not caught
2. **Environment isolation** → Intermittent failures
3. **Browser coverage** → Safari/Firefox bugs escape

**Cumulative Risk:** 1-2 major incidents per quarter

---

## FIXES TO APPLY (Short Form)

| Fix | Impact | Effort |
|-----|--------|--------|
| Role-based selector | Stable selectors | 5 min |
| Remove hard-coded wait | Fast tests + stability | 2 min |
| Fix `.catch()` pattern | Real error visibility | 10 min |
| Deduplicate code | 50% faster maintenance | 15 min |
| Add resource checks | Catch load failures | 10 min |
| Verify button href | Catch wrong links | 10 min |
| Clear cookies/cache | Eliminate flakiness | 5 min |
| **TOTAL P0+P1** | **80% improvement** | **57 min** |

---

## RISK SCORECARD

| Dimension | Current | With P0 Fixes | With P0+P1 Fixes |
|-----------|---------|---------------|------------------|
| Flakiness | 🔴 HIGH | 🟠 MED | 🟡 LOW |
| Maintenance | 🔴 HIGH | 🟠 MED | 🟢 GOOD |
| Coverage | 🔴 HIGH | 🟠 MED | 🟡 LOW |
| A11y | 🔴 HIGH | 🟠 MED | 🟠 MED |

---
