import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get mainHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  private get getStartedLink() {
    return this.page.getByRole('link', { name: 'Get started' });
  }

  async navigateToHome() {
    await this.goto('/');
  }

  async clickGetStartedLink() {
    await expect(this.getStartedLink).toBeVisible();
    await this.getStartedLink.click();
  }

  async verifyMainHeadingVisible() {
    await expect(this.mainHeading).toBeVisible();
  }

  async verifyGetStartedLinkVisible() {
    await expect(this.getStartedLink).toBeVisible();
  }

  async getMainHeadingText(): Promise<string | null> {
    return this.mainHeading.textContent();
  }
}