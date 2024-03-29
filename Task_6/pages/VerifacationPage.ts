import { Page } from '@playwright/test'

class VerifacationPage {
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
        
        const ageYearSelector = 'select#ageYear' //селектор для элемента выбора года 
        await ageCheckFrame.fill(ageYearSelector, '1980') //Заполняет поле выбора года  '1980'.
        await this.page.click('#view_product_page_btn') //Кликает на View Page
        await this.page.waitForURL('https://store.steampowered.com/app/1649240/Returnal/') 
      }
    }
  }
}

export { VerifacationPage }
