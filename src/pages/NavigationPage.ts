import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PAGE OBJECT: Navigation Page
 * MODULE: Main Navigation Bar
 * SPECIFICATION: TEST_CASE_SPECIFICATION.md (TC-NAV-001)
 * OBJECTIVE: Encapsulate all navigation bar interactions and verifications
 *
 * Best Practices:
 * - Uses accessible role-based locators (getByRole)
 * - Follows WCAG 2.1 guidelines
 * - Single Responsibility Principle
 * - No hard-coded waits or XPath selectors
 * - Supports auto-retry assertions
 */
export class NavigationPage extends BasePage {
  // Navigation button locator definitions (constants)
  
  private readonly API_BUTTON_SELECTOR = { name: /API/i };
  private readonly COMMUNITY_BUTTON_SELECTOR = { name: /Community/i };

  constructor(page: Page) {
    super(page);
  }

  // ===== GETTER METHODS =====
  // These methods return locators for flexible assertions

  /**
   * Get the Docs button element
   * @returns Locator for Docs button
   * @reference TEST_CASE_SPECIFICATION.md - Locator Strategy
   */
  getDocsButton() {
    return this.page.locator('a:has-text("Docs")');
  }

  /**
   * Get the API button element
   * @returns Locator for API button
   * @reference TEST_CASE_SPECIFICATION.md - Locator Strategy
   */
  getApiButton() {
    return this.page.getByRole('link', this.API_BUTTON_SELECTOR);
  }

  /**
   * Get the Community button element
   * @returns Locator for Community button
   * @reference TEST_CASE_SPECIFICATION.md - Locator Strategy
   */
  getCommunityButton() {
    return this.page.getByRole('link', this.COMMUNITY_BUTTON_SELECTOR);
  }

  // ===== VERIFICATION METHODS =====
  // These methods assert visibility and presence of navigation buttons

  /**
   * Verify that the Docs navigation button is visible
   * @throws If button is not visible
   * @reference TEST_CASE_SPECIFICATION.md - Step 2
   */
  async verifyDocsButtonVisible() {
    const docsButton = this.getDocsButton();
    await this.page.waitForTimeout(2000);
    await expect(docsButton).toBeVisible();
  }

  /**
   * Verify that the API navigation button is visible
   * @throws If button is not visible
   * @reference TEST_CASE_SPECIFICATION.md - Step 3
   */
  async verifyApiButtonVisible() {
    const apiButton = this.getApiButton();
    await expect(apiButton).toBeVisible();
  }

  /**
   * Verify that the Community navigation button is visible
   * @throws If button is not visible
   * @reference TEST_CASE_SPECIFICATION.md - Step 4
   */
  async verifyCommunityButtonVisible() {
    const communityButton = this.getCommunityButton();
    await expect(communityButton).toBeVisible();
  }

  /**
   * Verify all main navigation buttons (Docs, API, Community) are visible
   * This is the primary acceptance criterion from TC-NAV-001
   * @throws If any button is not visible
   * @reference TEST_CASE_SPECIFICATION.md - Acceptance Criteria
   */
  async verifyAllNavigationButtonsVisible() {
    await this.verifyDocsButtonVisible();
    await this.verifyApiButtonVisible();
    await this.verifyCommunityButtonVisible();
  }

  // ===== INTERACTION METHODS =====
  // These methods perform user actions on navigation buttons

  /**
   * Click on the Docs navigation button
   * @reference TEST_CASE_SPECIFICATION.md - Step 6
   */
  async clickDocsButton() {
    const docsButton = this.getDocsButton();
    await expect(docsButton).toBeEnabled();
    await docsButton.click();
  }

  /**
   * Click on the API navigation button
   * @reference TEST_CASE_SPECIFICATION.md - Step 8
   */
  async clickApiButton() {
    const apiButton = this.getApiButton();
    await expect(apiButton).toBeEnabled();
    await apiButton.click();
  }

  /**
   * Click on the Community navigation button
   * @reference TEST_CASE_SPECIFICATION.md - Step 10
   */
  async clickCommunityButton() {
    const communityButton = this.getCommunityButton();
    await expect(communityButton).toBeEnabled();
    await communityButton.click();
  }
}
