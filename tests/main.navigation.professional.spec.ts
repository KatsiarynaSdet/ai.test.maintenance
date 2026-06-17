import { test, expect, Page, Locator } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { NavigationPage, NavigationItemKey } from '../src/pages/NavigationPageRefactored';

type LinkNavigationKey = Extract<NavigationItemKey, 'docs' | 'api' | 'mcp'>;

type NavigationExpectation = {
  requirementId: string;
  key: LinkNavigationKey;
  expectedAccessibleName: RegExp;
  expectedHrefFragment: string;
  expectedUrlPattern: RegExp;
  expectedHeading?: RegExp;
};

const LINK_NAV_KEYS: LinkNavigationKey[] = ['docs', 'api', 'mcp'];
const ALL_NAV_KEYS: NavigationItemKey[] = ['docs', 'api', 'nodejs', 'mcp'];

const NAVIGATION_EXPECTATIONS: NavigationExpectation[] = [
  {
    requirementId: 'TC-NAV-001',
    key: 'docs',
    expectedAccessibleName: /docs/i,
    expectedHrefFragment: '/docs',
    expectedUrlPattern: /\/docs(\/|$)/i,
    expectedHeading: /Installation/i,
  },
  {
    requirementId: 'TC-NAV-001',
    key: 'api',
    expectedAccessibleName: /api/i,
    expectedHrefFragment: '/api',
    expectedUrlPattern: /\/api(\/|$)/i,
    expectedHeading: /Playwright Library/i,
  },
  {
    requirementId: 'TC-NAV-001',
    key: 'mcp',
    expectedAccessibleName: /^MCP$/,
    expectedHrefFragment: '/mcp',
    expectedUrlPattern: /\/mcp(\/|$)/i,
    expectedHeading: /Playwright MCP/i,
  },
];

test.describe('Main navigation | TC-NAV-001', () => {
  let homePage: HomePage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navigationPage = new NavigationPage(page);

    await homePage.navigateToHome();
    await expect(page).toHaveTitle(/Playwright/i);
  });

  test('TC-NAV-001 | renders all primary navigation controls with actionable states', async () => {
    // Traceability:
    // - TC-NAV-001.1: primary navigation controls are rendered on the home page
    // - TC-NAV-001.2: link-based navigation exposes valid href targets
    // - TC-NAV-001.3: CTA navigation control is visible, enabled, and actionable
    for (const key of ALL_NAV_KEYS) {
      await navigationPage.verifyNavButtonReady(key);
    }

    for (const key of LINK_NAV_KEYS) {
      const link = navigationPage.getNavButton(key);
      await expect(link, `TC-NAV-001: ${key} link should expose a non-empty href`).toHaveAttribute('href', /.+/);
    }

    await expect(navigationPage.getNavButton('nodejs')).toBeInViewport();
    await expect(navigationPage.getNavButton('nodejs')).toBeVisible();
    await expect(navigationPage.getNavButton('nodejs')).toBeEnabled();
  });

  for (const item of NAVIGATION_EXPECTATIONS) {
    test(`${item.requirementId} | ${item.key} navigation opens the expected destination`, async ({ page }) => {
      await verifyNavigation(page, navigationPage, item);
    });
  }

  test('TC-NAV-001 | navigation controls expose semantic names and predictable keyboard order', async ({ page }) => {
    // Traceability:
    // - TC-NAV-001.4: link controls expose accessible link semantics
    // - TC-NAV-001.5: keyboard users can move through navigation in the intended order
    for (const key of LINK_NAV_KEYS) {
      const item = NAVIGATION_EXPECTATIONS.find((expectation) => expectation.key === key);
      if (!item) {
        throw new Error(`Missing expectation data for navigation key: ${key}`);
      }

      await expectLinkToBeAccessible(
        navigationPage.getNavButton(key),
        item.expectedAccessibleName,
      );
    }

    const nodeJsButton = navigationPage.getNavButton('nodejs');
    await expect(nodeJsButton).toBeVisible();
    await expect(nodeJsButton).toBeEnabled();
    await expect(nodeJsButton).not.toHaveAttribute('aria-disabled', 'true');
    await expect(nodeJsButton).not.toHaveAttribute('disabled', '');

    await navigationPage.getNavButton('docs').focus();
    await expect(navigationPage.getNavButton('docs')).toBeFocused();
  });

  test('TC-NAV-001 | edge case: navigation links are not hidden or disabled before interaction', async () => {
    // Edge coverage for hidden/disabled state regressions on primary navigation.
    for (const key of ALL_NAV_KEYS) {
      const control = navigationPage.getNavButton(key);
      await expect(control, `TC-NAV-001: ${key} should not be hidden`).toBeVisible();
      await expect(control, `TC-NAV-001: ${key} should not be aria-hidden`).not.toHaveAttribute('aria-hidden', 'true');
      await expect(control, `TC-NAV-001: ${key} should not be disabled`).not.toHaveAttribute('aria-disabled', 'true');
      await expect(control, `TC-NAV-001: ${key} should not have a disabled attribute`).not.toHaveAttribute('disabled', '');
    }
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
  expect(
    href,
    `${item.requirementId}: ${item.key} should expose an href before navigation`,
  ).toBeTruthy();
  expect(
    href,
    `${item.requirementId}: ${item.key} should target the expected route fragment`,
  ).toContain(item.expectedHrefFragment);

  await expect(
    button,
    `${item.requirementId}: ${item.key} should expose the correct accessible name`,
  ).toHaveAccessibleName(item.expectedAccessibleName);

  await Promise.all([
    page.waitForURL(item.expectedUrlPattern),
    navigationPage.clickNavButton(item.key),
  ]);

  await expect(page).toHaveURL(item.expectedUrlPattern);
  await expect(page.locator('main')).toBeVisible();

  if (item.expectedHeading) {
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(item.expectedHeading);
  }
}

async function expectLinkToBeAccessible(
  link: ReturnType<NavigationPage['getNavButton']>,
  expectedAccessibleName: RegExp,
): Promise<void> {
  await expect(link).toBeVisible();
  await expect(link).toBeEnabled();
  await expect(link).toHaveAttribute('href', /.+/);
  await expect(link).toHaveAccessibleName(expectedAccessibleName);
  await expect(link).not.toHaveAttribute('aria-disabled', 'true');
  await expect(link).not.toHaveAttribute('disabled', '');
}

