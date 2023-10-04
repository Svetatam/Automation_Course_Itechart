import { Page, expect } from '@playwright/test'

class GamePage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

async compareDiscount(){
  
}




  async comparePrice() {
    
    // const salePrice2 = await this.page
    //   .locator(
    //     "(//div[@class='game_area_purchase_game_wrapper']//*[contains(@class, 'discount_final_price')])[1]"
    //   )
    //   .textContent()
    // await expect(`${salePrice2} USD`).toContain(salePrice2)
    
    // console.log(salePrice2)//потом убрать
    // console.log(salePrice2)// потом убрать
  }
}
export { GamePage }
