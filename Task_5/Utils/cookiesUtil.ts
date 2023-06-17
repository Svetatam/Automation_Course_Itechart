import { Page } from '@playwright/test'

class CookiesUtil {
  static async getCookies(page: Page) {
    return await page.context().cookies()
  }
}

export { CookiesUtil }
