import { Page } from '@playwright/test'

class ActionPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }
  // Scroll to the New & Trending tab
  async scrollTo() {
    await this.page.evaluate(async () => {
      const tab = document.querySelector('#SaleSection_13268')
      if (tab) tab.scrollIntoView()
    })
  }
}
export { ActionPage }
