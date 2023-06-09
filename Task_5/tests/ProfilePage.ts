import { Page, Cookie } from '@playwright/test';

class ProfilePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  
  async waitForURL(): Promise<void> {
    await this.page.waitForURL('https://demoqa.com/profile');
  }

  async getCookies() {
    return await this.page.context().cookies();
  }

  
  async clickBookStore(): Promise<void> {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: /^Book Store$/ })
      .click();
  }

  async getUserID() {
    const cookies = await this.page.context().cookies();
    const userIDCookie = cookies.find((c) => c.name === 'userID');
    return userIDCookie ? userIDCookie.value : null;
  }

  async getToken(){
    const cookies = await this.page.context().cookies();
    const tokenCookie = cookies.find((c) => c.name === 'token');
    return tokenCookie ? tokenCookie.value : null;
  }

  async getUserDetails(userID, token) {
    const responseAPI = await this.page.request.get(
      `https://demoqa.com/Account/v1/User/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return responseAPI;
  }
}
export { ProfilePage };