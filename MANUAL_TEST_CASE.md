# MANUAL TEST CASE: TC-NAV-001
## Navigation Buttons Verification

| **Test Case ID** | TC-NAV-001 |
| **Title** | Navigation buttons (Docs, API, Community) are visible and functional |
| **Priority** | Critical |
| **Type** | Functional / Manual |
| **Environment** | Production (https://playwright.dev/) |
| **Duration** | 5-7 minutes |
| **Preconditions** | Browser installed; internet available; no extensions interfering |

---

## Test Steps

| # | Action | Expected Result | Pass |
|---|--------|---|---|
| **1** | Navigate to `https://playwright.dev/` | Page loads (<10s), title contains "Playwright", nav bar visible | ⬜ |
| **2** | Scroll down page | Nav bar remains visible (sticky/fixed position) | ⬜ |
| **3** | Verify "Docs" button in nav bar | Button visible, readable, not disabled, appears clickable | ⬜ |
| **4** | Verify "API" button in nav bar | Button visible, readable, not disabled, appears clickable | ⬜ |
| **5** | Verify "Community" button in nav bar | Button visible, readable, not disabled, appears clickable | ⬜ |
| **6** | Click "Docs" button | URL contains `/docs`, page loads (<3s), content displays, no 404 error | ⬜ |
| **7** | Click browser back button | Returns to homepage (URL matches `playwright.dev/`), nav bar intact | ⬜ |
| **8** | Click "API" button | URL contains `/api`, page loads (<3s), content displays, no 404 error | ⬜ |
| **9** | Click browser back button | Returns to homepage (URL matches `playwright.dev/`), nav bar intact | ⬜ |
| **10** | Click "Community" button | URL contains `/community`, page loads (<3s), content displays, no 404 error | ⬜ |

---

### Step 9: Navigate Back to Homepage

| Item | Details |
|------|---------|
| **Action** | Use browser back button (←) or navigate directly to `https://playwright.dev/` |
| **Expected Result** | <ul><li>Browser returns to the Playwright homepage</li><li>Navigation bar is visible again with all three buttons</li><li>Homepage content is fully loaded</li><li>URL shows `https://playwright.dev/` (or similar base URL)</li></ul> |
| **Notes** | Click browser back button or use keyboard shortcut (Alt+Left Arrow on Windows, Cmd+[ on Mac) |
| **Pass Criteria** | Successfully returns to homepage with navigation bar visible |

---

### Step 10: Click "Community" Button and Verify Navigation

| Item | Details |
|------|---------|
| **Action** | Click on the "Community" button with mouse or keyboard (Tab + Enter) |
| **Expected Result** | <ul><li>Page navigation is triggered without delay or error</li><li>Browser URL changes to a page containing `/community` in the URL path</li><li>New page loads completely within 3 seconds</li><li>Page displays relevant community content (links, forum, Discord, chat channels, etc.)</li><li>Browser back button is available and functional</li><li>No error page (404, 500) is displayed</li></ul> |
| **Notes** | <ul><li>Watch the browser address bar (URL) to confirm navigation</li><li>If page takes longer than 3 seconds, note as a performance issue but not a failure</li><li>Expected URL destinations: `https://playwright.dev/community/...` or similar</li></ul> |
| **Pass Criteria** | Successfully navigates to a valid community page within 3 seconds |

---

## Acceptance Criteria

**TEST PASSES IF ALL of the following are TRUE:**

- ✓ Step 1: Homepage loads successfully with HTTP 200 status
- ✓ Steps 2-5: All three navigation buttons ("Docs", "API", "Community") are clearly visible and appear interactive
- ✓ Step 6: Clicking "Docs" button navigates to a valid documentation page with `/docs` in URL
- ✓ Step 8: Clicking "API" button navigates to a valid API reference page with `/api` in URL
- ✓ Step 10: Clicking "Community" button navigates to a valid community page with `/community` in URL
- ✓ All navigation completions within 3 seconds (excluding any network delays)
- ✓ Back navigation works correctly after each click

**TEST FAILS IF ANY of the following occur:**

- ✗ Homepage fails to load or displays error (404, 500, etc.)
- ✗ Any navigation button is missing, hidden, or disabled
- ✗ Clicking any button does not trigger navigation
- ✗ Navigation takes longer than 5 seconds (significant delay)
- ✗ Destination URL does not contain expected path segment
- ✗ Destination page shows error or loads incorrectly
- ✗ Browser back button fails to return to homepage

---

## Test Results Template

| Item | Result |
|------|--------|
| **Overall Test Result** | ⬜ Pass / ⬜ Fail / ⬜ Blocked |
| **Test Executed By** | (Tester Name) |
| **Execution Date** | (Date) |
| **Execution Time** | (Duration) |
| **Browser & Version** | (e.g., Chrome 120.0.6099.225) |
| **Operating System** | (e.g., Windows 11, macOS 14.2, Ubuntu 22.04) |
| **Network Conditions** | (e.g., Stable, 50 Mbps) |

---

## Detailed Step Results

| Step | Expected Result | Actual Result | Status | Notes |
|------|---|---|---|---|
| 1 | Page loads successfully | | ⬜ Pass / ⬜ Fail | |
| 2 | Navigation bar visible | | ⬜ Pass / ⬜ Fail | |
| 3 | Docs button visible | | ⬜ Pass / ⬜ Fail | |
| 4 | API button visible | | ⬜ Pass / ⬜ Fail | |
| 5 | Community button visible | | ⬜ Pass / ⬜ Fail | |
---

## Acceptance Criteria

**PASS if:**
- ✓ All 3 buttons (Docs, API, Community) visible and clickable
- ✓ Each button navigates to correct URL (contains /docs, /api, /community)
- ✓ Navigation loads within 3 seconds
- ✓ Back button returns to homepage
- ✓ No error pages (404, 500) displayed
- ✓ Destination content is visible (not blank/loading)

**FAIL if:**
- ✗ Any button missing, hidden, or disabled
- ✗ Navigation fails or times out (>3s)
- ✗ Destination URL doesn't contain expected path
- ✗ Back button doesn't return to homepage
- ✗ Error page (404, 500) displayed
- ✗ Page content not visible after navigation

---

## Test Results

| Metric | Value |
|--------|-------|
| **Overall Result** | ⬜ Pass / ⬜ Fail |
| **Tester** | |
| **Date** | |
| **Duration** | |
| **Browser** | (e.g., Chrome 120) |
| **OS** | (e.g., Windows 11) |

---

## Step-by-Step Results

| Step | Pass | Notes |
|------|------|-------|
| 1 - Homepage load | ⬜ | |
| 2 - Nav bar sticky | ⬜ | |
| 3 - Docs visible | ⬜ | |
| 4 - API visible | ⬜ | |
| 5 - Community visible | ⬜ | |
| 6 - Docs navigation | ⬜ | Load time: ___ |
| 7 - Back to home | ⬜ | |
| 8 - API navigation | ⬜ | Load time: ___ |
| 9 - Back to home | ⬜ | |
| 10 - Community navigation | ⬜ | Load time: ___ |

---

## Issues Found

| Priority | Description | Actual Behavior |
|----------|---|---|
| 🔴 Critical | | |
| 🟠 High | | |
| 🟡 Medium | | |

---

## Tester Notes

```
[Additional observations, anomalies, or environmental notes]
```

---

## Sign-Off

Tester: _________________________ Date: _______

QA Lead: ________________________ Date: _______

---

## Related Information

- Automated test: [main.navigation.spec.ts](tests/main.navigation.spec.ts)
- Page objects: [NavigationPage.ts](tests/pages/NavigationPage.ts)
- Hidden issues: [HIDDEN_ISSUES_AND_EDGE_CASES.md](HIDDEN_ISSUES_AND_EDGE_CASES.md)
- Review analysis: [TEST_REVIEW_ANALYSIS.md](TEST_REVIEW_ANALYSIS.md)
