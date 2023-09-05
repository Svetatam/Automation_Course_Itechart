import { Page } from '@playwright/test'

class ProfilePage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  // async hoverOverCategories() {
  //   await this.page.hover('text="Categories"')
    
  // }
  // async clickAction() {
  //   await this.page
  //     .locator('#genre_flyout')
  //     .getByRole('link', { name: ' Action ', exact: true })
  //     .click()
  // }


  // async clickNewTrending() {
  //   await this.page
  //   .locator('#SaleSection_13268')
  //   .getByText('New & Trending')
  //   .click()
  // }


  // async waitForURL() {
  //   await this.page.waitForURL('https://store.steampowered.com/')
  // }
  // async waitForSecondURL() {
  //   await this.page.waitForURL(
  //     'https://store.steampowered.com/category/action/'
  //   )
  // }

  async waitForThirdURL() {
    await this.page.waitForURL(
      'https://store.steampowered.com/app/1649240/Returnal/'
    )
  }
}
export { ProfilePage }
