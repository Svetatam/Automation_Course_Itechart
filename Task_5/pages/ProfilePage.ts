import { Page } from '@playwright/test'
import { CookiesUtil } from './cookiesUtil'
import { UserUtil } from './userUtil'

class ProfilePage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async waitForURL() {
    await this.page.waitForURL('https://demoqa.com/profile')
  }

  async clickBookStore() {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: /^Book Store$/ })
      .click()
  }
}
export { ProfilePage }
