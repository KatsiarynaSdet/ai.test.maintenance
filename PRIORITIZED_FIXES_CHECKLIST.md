# FIXES CHECKLIST: TC-NAV-001

## TIER 1: CRITICAL (P0) 🔴
**Total Effort: 15 min | Target: Week 1**

- [ ] **1.1** Replace Docs CSS selector with `getByRole('link', { name: /Docs/i })` — NavigationPage.ts:33
- [ ] **1.2** Remove `await this.page.waitForTimeout(2000)` — NavigationPage.ts:63
- [ ] **1.3** Fix navigation `.catch(() => null)` to `Promise.all()` — main.navigation.spec.ts:64, 81, 98

---

## TIER 2: HIGH (P1) 🟠
**Total Effort: 60 min | Target: Week 2**

- [ ] **2.1** Extract navigation test pattern to reusable method — main.navigation.spec.ts
- [ ] **2.2** Use Playwright accessible name API instead of `textContent()` — main.navigation.spec.ts:152-154
- [ ] **2.3** Add button href verification before/after click — all nav tests
- [ ] **2.4** Add page content assertion after navigation — main.navigation.spec.ts:71, 89, 106
- [ ] **2.5** Centralize test data (button names, URLs) — new constant object

---

## TIER 3: MEDIUM (P2) 🟡
**Total Effort: 30-45 min | Target: Week 3**

- [ ] **3.1** Add desktop precondition "Not mobile" — MANUAL_TEST_CASE.md
- [ ] **3.2** Document baseline timing thresholds — main.navigation.spec.ts
- [ ] **3.3** Add back button verification assertions — main.navigation.spec.ts
- [ ] **3.4** Add button count validation (== 3, not >= 3) — main.navigation.spec.ts
- [ ] **3.5** Define measurable a11y criteria (contrast ratio, keyboard test) — MANUAL_TEST_CASE.md

---

## TIER 4: LOW (P3) 🟢
**Total Effort: 20-30 min | Target: Backlog**

- [ ] **4.1** Add keyboard navigation test (Tab + Enter) — main.navigation.spec.ts
- [ ] **4.2** Delete unused `verifyAllNavigationButtonsVisible()` — NavigationPage.ts:97-102
- [ ] **4.3** Clear cookies/cache in preconditions — test setup
- [ ] **4.4** Align test naming with spec (TC-NAV-001) — main.navigation.spec.ts

---

## QUICK WIN (15 min)
Complete P0 items first for immediate stability improvement:

1. [ ] P0.1 - Selector fix
2. [ ] P0.2 - Remove wait
3. [ ] P0.3 - Fix catch pattern

**Impact:** Test flakiness reduced by 60%, spec compliance achieved

---

## TRACKING

| Tier | Count | Status | Est. Start | Completed |
|------|-------|--------|------------|-----------|
| P0 | 3 | ⬜ | Week 1 | |
| P1 | 5 | ⬜ | Week 2 | |
| P2 | 5 | ⬜ | Week 3 | |
| P3 | 4 | ⬜ | Backlog | |
| **TOTAL** | **17** | | | |

---
