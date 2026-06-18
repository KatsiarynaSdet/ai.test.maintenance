// main.navigation.refactored.spec.ts
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { NavigationPage, NavigationItemKey } from '../src/pages/NavigationPageRefactored';

type LinkNavigationKey = Extract<NavigationItemKey, 'docs' | 'api' | 'mcp'>;

type NavigationExpectation = {
  key: LinkNavigationKey;
  expectedHrefFragment: string;
  expectedUrlPattern: RegExp;
  expectedHeading?: RegExp;
};

const LINK_NAV_KEYS: LinkNavigationKey[] = ['docs', 'api', 'mcp'];

const NAVIGATION_EXPECTATIONS: NavigationExpectation[] = [
  {
    key: 'docs',
    expectedHrefFragment: '/docs',
    expectedUrlPattern: /\/docs(\/|$)/i,
    expectedHeading: /Installation/i,
  },
  {
    key: 'api',
    expectedHrefFragment: '/api',
    expectedUrlPattern: /\/api(\/|$)/i,
    expectedHeading: /Playwright Library/i,
  },
  {
    key: 'mcp',
    expectedHrefFragment: 'mcp',
    expectedUrlPattern: /mcp/i,
    expectedHeading: /Playwright MCP/i,
  },
];

test.describe('Main Navigation Tests | TC-NAV-001', () => {
  let homePage: HomePage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navigationPage = new NavigationPage(page);

    await homePage.navigateToHome();
    await expect(page).toHaveTitle(/Playwright/i);
  });

  test('TC-NAV-001: All navigation buttons should be visible on main page', async () => {
    await navigationPage.verifyAllNavigationButtonsVisible();

    for (const key of LINK_NAV_KEYS) {
      const link = navigationPage.getNavButton(key);
      await expect(link).toHaveAttribute('href');
    }

    await expect(navigationPage.getNodeJsButton()).toBeInViewport();
    await expect(navigationPage.getNodeJsButton()).toBeVisible();
    await expect(navigationPage.getNodeJsButton()).toBeEnabled();
  });

  for (const item of NAVIGATION_EXPECTATIONS) {
    test(`TC-NAV-001-${item.key.toUpperCase()}: ${item.key} navigation should open the expected destination`, async ({ page }) => {
      await verifyNavigation(page, navigationPage, item);
    });
  }

  test('TC-NAV-001-A11Y: Navigation buttons should expose semantic links and basic keyboard accessibility', async () => {
    for (const key of LINK_NAV_KEYS) {
      await expectLinkToBeAccessible(navigationPage.getNavButton(key));
    }

    const nodeJsButton = navigationPage.getNodeJsButton();
    await expect(nodeJsButton).toBeVisible();
    await expect(nodeJsButton).toBeEnabled();
    await expect(nodeJsButton).not.toHaveAttribute('aria-disabled', 'true');
    await expect(nodeJsButton).not.toHaveAttribute('disabled', '');

    await navigationPage.getDocsButton().focus();
    await expect(navigationPage.getDocsButton()).toBeFocused();
  });
});

async function verifyNavigation(
  page: Page,
  navigationPage: NavigationPage,
  item: NavigationExpectation,
): Promise<void> {
  const button = navigationPage.getNavButton(item.key);

  await navigationPage.verifyNavButtonReady(item.key);

  const href = await button.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).toContain(item.expectedHrefFragment);

  await Promise.all([
    page.waitForURL(item.expectedUrlPattern),
    navigationPage.clickNavButton(item.key),
  ]);

  await expect(page).toHaveURL(item.expectedUrlPattern);
  
  const url = page.url();
  expect(url).not.toMatch(/^https?:\/\/[^\/]+\/(error|404|403|50[0-9])/i);
  expect(page).not.toHaveURL(/\/error\//);;

  if (item.expectedHeading) {
    await expect(page.getByRole('heading').first()).toContainText(item.expectedHeading);
  }
}

async function expectLinkToBeAccessible(link: ReturnType<NavigationPage['getNavButton']>): Promise<void> {
  await expect(link).toBeVisible();
  await expect(link).toBeEnabled();
  await expect(link).toHaveAttribute('href');
  await expect(link).not.toHaveAttribute('aria-disabled', 'true');
  await expect(link).not.toHaveAttribute('disabled', '');
}

