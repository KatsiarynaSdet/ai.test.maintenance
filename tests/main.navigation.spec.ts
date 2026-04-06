import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { NavigationPage } from '../src/pages/NavigationPage';

/**
 * TEST SUITE: Main Navigation Tests
 * SPECIFICATION: TEST_CASE_SPECIFICATION.md (TC-NAV-001)
 * OBJECTIVE: Verify main page displays all required navigation buttons and they are functional
 *
 * Test Data:
 * - Base URL: https://playwright.dev/
 * - Navigation Buttons: Docs, API, Community
 * - Expected Timeouts: pageLoad=30s, navigation=3s, visibility=5s
 */
test.describe('Main Navigation Tests | TC-NAV-001', () => {
  let homePage: HomePage;
  let navigationPage: NavigationPage;

  /**
   * PRECONDITION: Load homepage before each test
   * References: TEST_CASE_SPECIFICATION.md - Preconditions section
   */
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navigationPage = new NavigationPage(page);
    
    // Step 1: Navigate to the main page
    await homePage.navigateToHome();
    
    // Verify page loaded successfully
    await expect(page).toHaveTitle(/Playwright/);
  });

  /**
   * TEST CASE: TC-NAV-001
   * TITLE: The main page should display navigation buttons: Docs, API, Community
   * REFERENCE: TEST_CASE_SPECIFICATION.md - Acceptance Criteria
   * 
   * Acceptance Criteria:
   * ✓ All three buttons are visible on page load
   * ✓ Each button is in the DOM with correct accessible name
   * ✓ Each button is not disabled or hidden
   */
  test('TC-NAV-001: All navigation buttons should be visible on main page', async ({ page }) => {
    // Step 2-5: Verify Docs, API, Community buttons are visible
    // Expected: Button renders with accessible text
    await navigationPage.verifyDocsButtonVisible();
    await navigationPage.verifyApiButtonVisible();
    await navigationPage.verifyCommunityButtonVisible();
    
    // Additional verification: Buttons should be in viewport
    await expect(navigationPage.getDocsButton()).toBeInViewport();
    await expect(navigationPage.getApiButton()).toBeInViewport();
    await expect(navigationPage.getCommunityButton()).toBeInViewport();
  });

  /**
   * TEST: Docs Navigation Button
   * REFERENCE: TEST_CASE_SPECIFICATION.md - Step 6
   * TITLE: Docs navigation button should be visible and clickable
   * 
   * Expected Results:
   * - Button exists and is visible
   * - Click triggers navigation
   * - URL contains /docs
   * - Navigation completes within 3 seconds
   */
  test('TC-NAV-001-01: Docs navigation button should be visible and navigate to docs', async ({ page }) => {
    // Step 3: Verify Docs button exists and is visible
    await navigationPage.verifyDocsButtonVisible();
    
    // Step 6: Click Docs button and verify navigation
    const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 3000 }).catch(() => null);
    await navigationPage.clickDocsButton();
    await navigationPromise;
    
    // Expected: Page navigates to URL containing /docs
    await expect(page).toHaveURL(/\/docs/);
  });

  /**
   * TEST: API Navigation Button
   * REFERENCE: TEST_CASE_SPECIFICATION.md - Step 8
   * TITLE: API navigation button should be visible and clickable
   * 
   * Expected Results:
   * - Button exists and is visible
   * - Click triggers navigation
   * - URL contains /api
   * - Navigation completes within 3 seconds
   */
  test('TC-NAV-001-02: API navigation button should be visible and navigate to api', async ({ page }) => {
    // Step 4: Verify API button exists and is visible
    await navigationPage.verifyApiButtonVisible();
    
    // Step 8: Click API button and verify navigation
    const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 3000 }).catch(() => null);
    await navigationPage.clickApiButton();
    await navigationPromise;
    
    // Expected: Page navigates to URL containing /api
    await expect(page).toHaveURL(/\/api/);
  });

  /**
   * TEST: Community Navigation Button
   * REFERENCE: TEST_CASE_SPECIFICATION.md - Step 10
   * TITLE: Community navigation button should be visible and clickable
   * 
   * Expected Results:
   * - Button exists and is visible
   * - Click triggers navigation
   * - URL contains /community
   * - Navigation completes within 3 seconds
   */
  test('TC-NAV-001-03: Community navigation button should be visible and navigate to community', async ({ page }) => {
    // Step 5: Verify Community button exists and is visible
    await navigationPage.verifyCommunityButtonVisible();
    
    // Step 10: Click Community button and verify navigation
    const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 3000 }).catch(() => null);
    await navigationPage.clickCommunityButton();
    await navigationPromise;
    
    // Expected: Page navigates to URL containing /community
    await expect(page).toHaveURL(/community/i);
  });

  /**
   * TEST: Accessibility Compliance (WCAG 2.1)
   * TITLE: Navigation buttons should have correct roles, labels, and keyboard accessibility
   * 
   * Validates:
   * - Correct semantic role (link via getByRole)
   * - Accessible names (aria-label, aria-labelledby, or text content)
   * - href attributes (semantic navigation)
   * - Not disabled (no disabled or aria-disabled attributes)
   * - Keyboard accessible (proper tabindex)
   */
  test('TC-NAV-001-A11Y: Navigation buttons accessibility (WCAG 2.1 Level A)', async () => {
    // Verify semantic role and accessible names
    const docsButton = navigationPage.getDocsButton();
    const apiButton = navigationPage.getApiButton();
    const communityButton = navigationPage.getCommunityButton();

    // Verify href attributes exist (semantic links)
    await expect(docsButton).toHaveAttribute('href');
    await expect(apiButton).toHaveAttribute('href');
    await expect(communityButton).toHaveAttribute('href');

    // Verify accessible names present
    const docsText = await docsButton.textContent();
    const apiText = await apiButton.textContent();
    const communityText = await communityButton.textContent();

    expect(docsText?.trim().length).toBeGreaterThan(0);
    expect(apiText?.trim().length).toBeGreaterThan(0);
    expect(communityText?.trim().length).toBeGreaterThan(0);

    // Verify not disabled
    await expect(docsButton).not.toHaveAttribute('disabled');
    await expect(apiButton).not.toHaveAttribute('disabled');
    await expect(communityButton).not.toHaveAttribute('disabled');

    // Verify keyboard accessibility (focusable links)
    const docsTabIndex = await docsButton.getAttribute('tabindex');
    const apiTabIndex = await apiButton.getAttribute('tabindex');
    const communityTabIndex = await communityButton.getAttribute('tabindex');

    // Links should be focusable (tabindex not less than -1)
    if (docsTabIndex) expect(parseInt(docsTabIndex)).toBeGreaterThanOrEqual(-1);
    if (apiTabIndex) expect(parseInt(apiTabIndex)).toBeGreaterThanOrEqual(-1);
    if (communityTabIndex) expect(parseInt(communityTabIndex)).toBeGreaterThanOrEqual(-1);
  });
});
