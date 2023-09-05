import { Page } from '@playwright/test'

class NewTrending {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async isAgeVerificationRequired() {
    const ageCheckFrame = await this.page.$('iframe.agegate_iframe')
    return !!ageCheckFrame
  }

  async completeAgeVerification() {
    if (await this.isAgeVerificationRequired()) {
      await this.page.waitForLoadState('domcontentloaded')
      const ageCheckFrame = await this.page.$('iframe.agegate_iframe')
      if (ageCheckFrame) {
        const ageYearSelector = 'select#ageYear'
        await ageCheckFrame.fill(ageYearSelector, '1980')
        await this.page.click('#view_product_page_btn')
        await this.page.waitForNavigation()
      }
    }
  }
}

export { NewTrending }
