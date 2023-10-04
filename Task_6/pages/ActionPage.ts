import { Page, expect } from '@playwright/test'

class ActionPage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }
  // Scroll to the New & Trending tab
  async scrollTo() {
    await this.page.evaluate(async () => {
      const tab = document.querySelector('#SaleSection_13268')
      if (tab) tab.scrollIntoView()
    })
  }

  async waitForSelector() {
    await this.page
      .locator(
        'div.saleitembrowser_SaleItemBrowserHeaderContainer__MBp9.Panel.Focusable > div > div:nth-child(2)'
      )
      .click()
    await this.page.waitForLoadState('load')
  }

  async findMaxDiscount() {
    const discountElements = await this.page
      .locator(
        '.facetedbrowse_FacetedBrowseItems_NO-IP .Discounted>div[class*="StoreSaleDiscountBox"]'
      )
      .allInnerTexts()

    // Убираем знак '-' и '%'
    const discounts = discountElements.map((text) => {
      const cleanedText = text.replace('-', '').replace('%', '')
      return parseFloat(cleanedText)
    })

    // Сортируем скидки в убывающем порядке
    discounts.sort((a, b) => b - a)

    // Максимальная скидка
    const maxDiscount = discounts[0]

    console.log(discountElements) // это для себя,потом убрать
    console.log(`Максимальная скидка: ${maxDiscount}%`) // это для себя, потом убрать

    let xpathLocatorTitle
    // Проверяем, есть ли скидки
    if (discountElements.length > 0) {
      // Если есть скидки, выбираем игру с максимальной скидкой
      xpathLocatorTitle = `(//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'${maxDiscount}')]/ancestor::div[@class='ImpressionTrackedElement']//div[contains(@class, 'StoreSaleWidgetTitle')]/parent::a)[1]`
      // await page.locator(xpathLocatorTitle).click();
    } else {
      // Если скидок нет, выбираем игру с максимальной ценой
      
      const prices = discountElements.map((text) => {
        const cleanedText = text.replace(/[^0-9.]/g, '') // Удаляем все символы, кроме цифр и точки
        return parseFloat(cleanedText)
      })
      const maxPrice = Math.max(...prices)

      xpathLocatorTitle = `//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'${maxPrice}')]/ancestor::div[@class='ImpressionTrackedElement']//div[contains(@class, 'StoreSaleWidgetTitle')]/parent::a`
    }
    // Выполняем клик на выбранной игре
    await this.page.locator(xpathLocatorTitle).click()



    const salePrice = await this.page
      .locator(
        `(//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'${maxDiscount}')]/following-sibling::div/div[contains(@class, 'StoreSalePriceBox')])[1]`
      )
      .textContent()

    const gameLink = await this.page
      .locator(xpathLocatorTitle)
      .getAttribute('href')

    await this.page.goto(gameLink, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })
    const discountElement2 = this.page.locator(
      '//*[@id="game_area_purchase_section_add_to_cart_172495"]/div[2]/div/div[1]/div[1]'
    )

    await expect(discountElement2).toHaveText(`-${maxDiscount}%`)
    const salePrice2 = await this.page
    .locator(
      "(//div[@class='game_area_purchase_game_wrapper']//*[contains(@class, 'discount_final_price')])[1]"
    )
    .textContent()
  await expect(`${salePrice} USD`).toContain(salePrice2)
  
  console.log(salePrice)//потом убрать
  console.log(salePrice2)// потом убрать
  }
}
export { ActionPage }
