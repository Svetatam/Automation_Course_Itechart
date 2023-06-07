import { expect, Locator, Page } from '@playwright/test';




export class ProfilePage {
    
    readonly page: Page;
      
    constructor(page: Page) {
        this.page = page;
    }
    
    async waitForURL() {
        await this.page.waitForURL('https://demoqa.com/profile');
      }
      
      async getCookies() {
        return await this.page.context().cookies();
      }


      async goto(){
        await this.page.goto('https://demoqa.com/profile');
      }

      async clickBookStore(): Promise<void> {
        await this.page
          .getByRole('listitem')
          .filter({ hasText: /^Book Store$/ })
          .click();
      }



      
}



