// pages/NavigationPageRefactored.ts
import { expect, Locator, Page } from '@playwright/test';

export type NavigationItemKey = 'docs' | 'api' | 'nodejs' | 'community';
type NavigationItemType = 'link' | 'dropdown';

type NavigationItemConfig = {
  name: RegExp;
  type: NavigationItemType;
  hrefFragment?: string;
};

export class NavigationPage {
  private static readonly NAV_ITEMS: Record<NavigationItemKey, NavigationItemConfig> = {
    docs: {
      name: /^Docs$/i,
      type: 'link',
      hrefFragment: '/docs',
    },
    api: {
      name: /^API$/i,
      type: 'link',
      hrefFragment: '/api',
    },
    nodejs: {
      name: /^Node\.js$/i,
      type: 'dropdown',
    },
    community: {
      name: /^Community$/i,
      type: 'link',
      hrefFragment: 'community',
    },
  };

  constructor(private readonly page: Page) {}

  private get mainNavigation(): Locator {
    return this.page.getByRole('navigation', { name: 'Main' });
  }

  getNavButton(key: NavigationItemKey): Locator {
    const item = NavigationPage.NAV_ITEMS[key];

    return item.type === 'link'
      ? this.mainNavigation.getByRole('link', { name: item.name }).first()
      : this.mainNavigation.getByRole('button', { name: item.name }).first();
  }

  getDocsButton(): Locator {
    return this.getNavButton('docs');
  }

  getApiButton(): Locator {
    return this.getNavButton('api');
  }

  getNodeJsButton(): Locator {
    return this.getNavButton('nodejs');
  }

  getCommunityButton(): Locator {
    return this.getNavButton('community');
  }

  async clickNavButton(key: NavigationItemKey): Promise<void> {
    await this.getNavButton(key).click();
  }

  async verifyNavButtonReady(key: NavigationItemKey): Promise<void> {
    const button = this.getNavButton(key);

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await expect(button).not.toHaveAttribute('aria-disabled', 'true');
    await expect(button).not.toHaveAttribute('disabled', '');
  }

  async verifyNavButtonVisible(key: NavigationItemKey): Promise<void> {
    const button = this.getNavButton(key);
    const item = NavigationPage.NAV_ITEMS[key];

    await this.verifyNavButtonReady(key);
    await expect(button).toBeInViewport();

    if (item.type === 'link' && item.hrefFragment) {
      await expect(button).toHaveAttribute(
        'href',
        new RegExp(this.escapeForRegex(item.hrefFragment), 'i'),
      );
    }
  }

  async verifyAllNavigationButtonsVisible(): Promise<void> {
    for (const key of Object.keys(NavigationPage.NAV_ITEMS) as NavigationItemKey[]) {
      await this.verifyNavButtonVisible(key);
    }
  }

  private escapeForRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}