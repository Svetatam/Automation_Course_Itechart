import { Page } from '@playwright/test'

class LoginPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('https://store.steampowered.com/')
  }
}

export { LoginPage }
