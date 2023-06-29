import { Page } from '@playwright/test'

class CookiesUtil {
  static async GetCookies(page: Page) {
    return await page.context().cookies()
  }
  static async GetCookieValue(page: Page, cookieName: string) {
    const cookies = await page.context().cookies()
    const cookie = cookies.find((c) => c.name === cookieName)
    return cookie ? cookie.value : null
  }

  static async GetUserID(page: Page) {
    return await CookiesUtil.GetCookieValue(page, 'userID')
  }

  static async GetToken(page: Page) {
    return await CookiesUtil.GetCookieValue(page, 'token')
  }
}

export { CookiesUtil }
