import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';

test.describe('Playwright Homepage Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('should display homepage title', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/i);
  });

  test('should display homepage hero heading', async () => {
    await homePage.verifyMainHeadingVisible();
    const headingText = await homePage.getMainHeadingText();
    expect(headingText).toContain('Playwright');
  });

  test('should display Get started link on homepage', async () => {
    await homePage.verifyGetStartedLinkVisible();
  });

  test('should navigate to docs intro from Get started link', async ({ page }) => {
    await homePage.clickGetStartedLink();
    await expect(page).toHaveURL(/\/docs\/intro/);
  });
});

