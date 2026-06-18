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
  private readonly MCP_BUTTON_SELECTOR = { name: 'MCP', exact: true };
  private readonly DOCS_BUTTON_VISIBLE_TIMEOUT_MS = 2000;

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
  getMCPButton() {
    return this.page.getByRole('link', this.MCP_BUTTON_SELECTOR);
  }

  getCommunityButton() {
    return this.getMCPButton();
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
    await this.page.waitForTimeout(this.DOCS_BUTTON_VISIBLE_TIMEOUT_MS);
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
   * Verify that the MCP navigation button is visible
   * @throws If button is not visible
   * @reference TEST_CASE_SPECIFICATION.md - Step 4
   */
  async verifyMCPButtonVisible() {
    const MCPButton = this.getMCPButton();
    await expect(MCPButton).toBeVisible();
  }

  async verifyCommunityButtonVisible() {
    await this.verifyMCPButtonVisible();
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
    await this.verifyMCPButtonVisible();
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
   * Click on the MCP navigation button
   * @reference TEST_CASE_SPECIFICATION.md - Step 10
   */
  async clickMCPButton() {
    const MCPButton = this.getMCPButton();
    await expect(MCPButton).toBeEnabled();
    await MCPButton.click();
  }

  async clickCommunityButton() {
    await this.clickMCPButton();
  }
}
