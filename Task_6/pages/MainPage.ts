import { Page } from '@playwright/test'
import { text } from 'stream/consumers'

class MainPage {
  hoverOverCategory(arg0: string) {
    throw new Error('Method not implemented.')
  }
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('https://store.steampowered.com/')
  }

  async waitForURL() {
    await this.page.waitForURL('https://store.steampowered.com/')
  }
  async waitForSecondURL() {
        await this.page.waitForURL(
          'https://store.steampowered.com/category/action/'
        )
        }
  async hoverOverCategories() {
    await this.page.hover('text="Categories"')
  
  }


  
  async clickAction() {
   const linkLocator = `//a[contains(@href, '/category/') and contains(@href, '/action/')]`;
   const linkElement = this.page.locator(linkLocator);
         await linkElement.click();
   
  }
}
    


//   async clickAction() {
//     await this.page
//       .locator('#genre_flyout')
//       .getByRole('link', { name: 'Action', exact: true })
//       .click();
//   }
// }

export { MainPage };





  function waitForSecondURL() {
    throw new Error('Function not implemented.')
  }
// import { Page } from '@playwright/test'

// class MainPage {
//   private page: Page

//   constructor(page: Page) {
//     this.page = page
//   }

//   async goto() {
//     await this.page.goto('https://store.steampowered.com/')
//   }
//   async waitForURL() {
//     await this.page.waitForURL('https://store.steampowered.com/')
//   }


//   async hoverOverCategories() {
//     await this.page.hover('text="Categories"')
//   }
//   async clickAction() {
//     await this.page
//       .locator('#genre_flyout')
//       .getByRole('link', { name: ' Action ', exact: true })
//       .click()
//   }
//   async waitForSecondURL() {
//     await this.page.waitForURL(
//       'https://store.steampowered.com/category/action/'
//     )
//   }
// }
// export { MainPage }


