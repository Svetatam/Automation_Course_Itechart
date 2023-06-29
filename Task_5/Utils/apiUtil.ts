import { Page } from '@playwright/test'
class ApiUtil {
  static async GetUserDetails(page: Page, userID, token) {
    const response = await page.request.get(
      `https://demoqa.com/Account/v1/User/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.json()
  }

  static async BlockImages(page: Page) {
    await page.route('**/*.{png,jpg,webp,gif,svg,ICO, TIFF, EPS}', (route) =>
      route.abort()
    )
  }
}
export { ApiUtil }
