import { expect, test } from '@playwright/test'

import { MainPage } from '../pages/MainPage'
import { NewTrending } from '../pages/newTrendingPage'
import { DownloadUtil } from '../utils/downloadUtil'
import { ActionPage } from '..//pages/ActionPage'

test('TestSteam', async ({ page }) => {
  const mainPage = new MainPage(page)
  const actionPage = new ActionPage(page)
  const newTrending = new NewTrending(page)
  const downloadUtil = new DownloadUtil(page)

  // 1 Перейти на https://store.steampowered.com/
  await test.step('Go to Steam Store', async () => {
    await mainPage.goto()
    await mainPage.waitForURL()
  })

  //2 В меню навести мышь на Categories > кликнуть Action.
  await test.step('Hover over Categories and click Action', async () => {
    await mainPage.hoverOverCategories()
    await mainPage.clickAction()
    await mainPage.waitForSecondURL()
  })
  const priceSelector =
    'div.facetedbrowse_FacetedBrowseItems_NO-IP div.salepreviewwidgets_StoreSalePriceBox_Wh0L8'
  const discountSelector =
    'div.facetedbrowse_FacetedBrowseItems_NO-IP div.salepreviewwidgets_StoreSaleDiscountBox_2fpFv'
  // const gamesWithDiscount = await page.$$(discountSelector)

  await test.step('Select game with maximum discount or maximum price', async () => {
    //3. На вкладке New and Trending выбрать игру из условия максимальной скидки (только на первой странице).
    // Если скидки отсутствуют, то выбрать игру с максимальной ценой

    await page.goto(
      'https://store.steampowered.com/category/action/?flavor=contenthub_newandtrending'
    )
  })

  // Scroll to the New & Trending tab
  await test.step('Scroll to the New & Trending tab', async () => {
    await actionPage.scrollTo()
  })

  await page
    .locator(
      'div.saleitembrowser_SaleItemBrowserHeaderContainer__MBp9.Panel.Focusable > div > div:nth-child(2)'
    )
    .click()

  // Wait for the tab to load
  await test.step('Wait for the tab to load', async () => {
    await page.waitForTimeout(3000)
  })

  //Поиск игры с максимальной скидкой или ценой
  await test.step('Select game with maximum discount or maximum price', async () => {
    const gamesWithDiscount = await page.$$(discountSelector)

    if (gamesWithDiscount.length > 0) {
      // There are games with discounts

      const gameDiscounts = await Promise.all(
        gamesWithDiscount.map(async (game) => {
          const discountText = await game.innerText()
          return parseInt(discountText.replace('-', '').replace('%', ''))
        })
      )
      const maxDiscount = Math.max(...gameDiscounts)
      const maxDiscountIndex = gameDiscounts.indexOf(maxDiscount)

      // Создаем селектор для выбранной игры
      const MaxDiscountVariable = maxDiscount.toString()
      const gameLinkSelector =
        "//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'" +
        MaxDiscountVariable +
        "')]/ancestor::div[@class='ImpressionTrackedElement']//div[contains(@class, 'StoreSaleWidgetTitle')]/parent::a"

      // Находим ссылку на выбранную игру
      const selectedGameLink = await gamesWithDiscount[maxDiscountIndex].$(
        gameLinkSelector
      )

      if (selectedGameLink) {
        // Кликаем на ссылку и ожидаем перехода
        await selectedGameLink.click()
        await page.waitForTimeout(2000)
        await expect(page).toHaveURL(
          'https://store.steampowered.com/app/538030/Xenonauts_2/'
        )
      } else {
        // Обработка ошибки
        console.log(JSON.stringify(selectedGameLink))
        console.log(JSON.stringify(gamesWithDiscount))
        console.log(JSON.stringify(maxDiscountIndex))
        console.log(JSON.stringify(gameLinkSelector))
        console.error('Failed to click')
      }
    } else {
      // Нет игр со скидками, выбираем игру с максимальной ценой
      const gamePrices = await page.$$eval(priceSelector, (elements) =>
        elements.map((element) => {
          const priceText = element.textContent
          if (priceText) {
            const price = parseFloat(
              priceText.replace(',', '.').replace('€', '')
            )
            return price
          }
          return 0
        })
      )

      const maxPriceIndex = gamePrices.indexOf(Math.max(...gamePrices))

      // Создаем селектор для игры с максимальной ценой
      const maxPriceGameLinkSelector =
        "//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'" +
        maxPriceIndex +
        "')]/ancestor::div[@class='ImpressionTrackedElement']//div[contains(@class, 'StoreSaleWidgetTitle')]/parent::a"

      // Находим ссылку на игру с максимальной ценой
      const selectedMaxPriceGameLink = await page.$(maxPriceGameLinkSelector)

      if (selectedMaxPriceGameLink) {
        // Кликаем на ссылку
        await selectedMaxPriceGameLink.click()
      } else {
        // Обработка ошибки
        console.error('Failed to find game element.')
      }
    }
  })

  // Check for age verification

  await test.step('Check age verification', async () => {
    await newTrending.completeAgeVerification()
  })

  // 3 Скачать Setup файл

  await test.step('Download Setup file', async () => {
    await downloadUtil.downloadSetupFile(page)
  })

  // 4 Переименовать скачанный файл – добавить к имени текущий timestamp()
  await test.step('Rename downloaded file', async () => {
    const downloadPath =
      'C:\\Users\\s.tamashevich\\Desktop\\Automation_Course_Itechart\\Task_6\\userFiles'

    await downloadUtil.renameLatestFile(downloadPath)
  })
})
