import { Page } from '@playwright/test'
import { CookiesUtil } from './cookiesUtil'

class UserUtil {
  static async getCookieValue(page: Page, cookieName: string) {
    const cookies = await page.context().cookies()
    const cookie = cookies.find((c) => c.name === cookieName)
    return cookie ? cookie.value : null
  }

  static async getUserID(page: Page) {
    return await UserUtil.getCookieValue(page, 'userID')
  }

  static async getToken(page: Page) {
    return await UserUtil.getCookieValue(page, 'token')
  }
}

export { UserUtil }
