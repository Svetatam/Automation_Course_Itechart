import { Page } from '@playwright/test'

class MainPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('https://store.steampowered.com/')
  }
async waitForURL() {
  await this.page.waitForURL('https://store.steampowered.com/')
}
async hoverOverCategories() {
  await this.page.hover('text="Categories"')
  
}
async clickAction() {
  await this.page
    .locator('#genre_flyout')
    .getByRole('link', { name: ' Action ', exact: true })
    .click()
}
async waitForSecondURL() {
  await this.page.waitForURL(
    'https://store.steampowered.com/category/action/'
  )
}
}
export { MainPage }
