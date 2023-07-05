import { Page } from '@playwright/test'

class ProfilePage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async hoverOverCategories() {
    await this.page.hover('text=Categories')
  }
  async clickAction() {
    await this.page
      .locator('#genre_flyout')
      .getByRole('link', { name: 'Action', exact: true })
      .click()
  }

  async waitForURL() {
    await this.page.waitForURL('https://store.steampowered.com/')
  }
  //https://store.steampowered.com/category/action/
  async waitForSecondURL() {
    await this.page.waitForURL(
      'https://store.steampowered.com/category/action/'
    )
  }
}
export { ProfilePage }
