import { Page } from '@playwright/test'
class ApiUtil {
  static async getUserDetails(page: Page, userID, token) {
    const responseAPI = await page.request.get(
      `https://demoqa.com/Account/v1/User/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return responseAPI
  }

  static async blockImages(page: Page) {
    await page.route('**/*.{png,jpg,webp,gif,svg,ICO, TIFF, EPS}', (route) =>
      route.abort()
    )
  }
}
export { ApiUtil }
