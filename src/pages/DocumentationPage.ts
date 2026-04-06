import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Playwright documentation pages
 * Handles interactions with the docs and getting started sections
 */
export class DocumentationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the installation/intro page
   */
  async navigateToInstallation() {
    await this.goto('/docs/intro');
  }

  /**
   * Verify the Installation page title
   */
  async verifyInstallationPageLoaded() {
    await expect(this.page).toHaveTitle(/Installation/);
  }

  /**
   * Verify 'Writing tests' link is visible in sidebar
   */
  async verifyWritingTestsLinkVisible() {
    const writingTestsLink = this.page.getByRole('link', { name: 'Writing tests', exact: true });
    await expect(writingTestsLink).toBeVisible();
  }

  /**
   * Click on 'Writing tests' link
   */
  async clickWritingTestsLink() {
    await this.page.getByRole('link', { name: 'Writing tests', exact: true }).click();
  }

  /**
   * Verify 'Generating tests' link is visible
   */
  async verifyGeneratingTestsLinkVisible() {
    const generatingTestsLink = this.page.getByRole('link', {
      name: 'Generating tests',
    });
    await expect(generatingTestsLink).toBeVisible();
  }

  /**
   * Verify the Playwright Test section is visible
   */
  async verifyPlaywrightTestSectionVisible() {
    const testSection = this.page.getByRole('button', { name: 'Playwright Test' });
    await expect(testSection).toBeVisible();
  }

  /**
   * Get all navigation link names from the sidebar
   */
  async getNavigationLinkCount(): Promise<number> {
    const links = await this.page.getByRole('link').count();
    return links;
  }

  /**
   * Verify the Getting Started section is expanded
   */
  async verifyGettingStartedSectionExpanded() {
    const gettingStartedButton = this.page.getByRole('button', {
      name: 'Getting Started',
    });
    await expect(gettingStartedButton).toHaveAttribute('aria-expanded', 'true');
  }
}
