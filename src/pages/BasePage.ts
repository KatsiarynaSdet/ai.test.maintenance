import { Page, expect } from '@playwright/test';

/**
 * Base page class containing common page operations
 * All page objects should extend this class
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL path
   */
  async goto(path: string = '') {
    await this.page.goto(path);
  }

  /**
   * Verify the page title
   */
  async verifyPageTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Verify the page URL contains a specific string
   */
  async verifyUrlContains(urlPart: string) {
    await expect(this.page).toHaveURL(new RegExp(urlPart));
  }

  /**
   * Get the page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Close the page
   */
  async closePage() {
    await this.page.close();
  }
}
