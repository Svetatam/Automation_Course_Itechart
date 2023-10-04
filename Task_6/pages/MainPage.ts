import { Page } from '@playwright/test'
// import { text } from 'stream/consumers'

class MainPage {
  hoverOverCategory() {
    throw new Error('Method not implemented.')
  }
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
  async waitForSecondURL() {
    await this.page.waitForURL(
      'https://store.steampowered.com/category/action/'
    )
  }
  async hoverOverCategories() {
    await this.page.hover('text="Categories"')
  }

  async clickAction() {
    
    const linkLocator = `a.popup_menu_item:text("Action")`
    const linkElement = this.page.locator(linkLocator).first()
    await linkElement.click()
  }
}



export { MainPage }


