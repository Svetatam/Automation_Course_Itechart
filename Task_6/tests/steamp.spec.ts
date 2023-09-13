import { expect, test } from '@playwright/test'

import { MainPage } from '../pages/MainPage'
import { NewTrending } from '../pages/NewTrendingPage'
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
    const gamesWithDiscount = await page.$$(discountSelector) //выполняет поиск всех элементов на странице, которые соответствуют селектору discountSelector и сохраняет их в массив gamesWithDiscount.

    if (gamesWithDiscount.length > 0) { //Проверяет, есть ли элементы с скидками на странице (если длина массива gamesWithDiscount больше нуля).
      // There are games with discounts

      const gameDiscounts = await Promise.all(//Создает массив gameDiscounts, который будет содержать значения скидок для каждой игры.
        gamesWithDiscount.map(async (game) => {//Итерируется по массиву gamesWithDiscount и для каждой игры выполняет следующее:
          const discountText = await game.innerText()//Считывает текст из элемента game (информация о скидке).
          return parseInt(discountText.replace('-', '').replace('%', ''))//Преобразует текст с информацией о скидке в число, удаляя символы "-" и "%".
        // })Завершает операцию map и возвращает массив числовых значений скидок в gameDiscounts.
        })
      )
      const maxDiscount = Math.max(...gameDiscounts)//Находит максимальное значение скидки в массиве gameDiscounts.
      const maxDiscountIndex = gameDiscounts.indexOf(maxDiscount)//Находит индекс максимальной скидки в массиве gameDiscounts.

      // Создаем селектор для выбранной игры
      const MaxDiscountVariable = maxDiscount.toString()//Преобразует максимальное значение скидки в строку.
      const gameLinkSelector =
        "//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'" +
        MaxDiscountVariable +
        "')]/ancestor::div[@class='ImpressionTrackedElement']//div[contains(@class, 'StoreSaleWidgetTitle')]/parent::a"//Создает XPath-селектор для поиска ссылки на выбранную игру на основе максимальной скидки.

      // Находим ссылку на выбранную игру
      const selectedGameLink = await gamesWithDiscount[maxDiscountIndex].$(//Выполняет поиск элемента, соответствующего выбранной игре, используя созданный селектор.
        gameLinkSelector
      )

      if (selectedGameLink) {//Проверяет, был ли найден элемент ссылки.
        
        await selectedGameLink.click()// Кликаем на ссылку и ожидаем перехода
        await page.waitForTimeout(2000)
        await expect(page).toHaveURL(//Проверяет, что URL текущей страницы соответствует ожидаемому URL.
          'https://store.steampowered.com/app/538030/Xenonauts_2/'
        )
      } else {//Если ссылка не была найдена, выполняется в случае ошибки.
        // Обработка ошибки
        console.log(JSON.stringify(selectedGameLink))//Выводит информацию о найденной ссылке (или null) в консоль для отладки.
        console.log(JSON.stringify(gamesWithDiscount))//Выводит информацию о массиве игр с скидками в консоль для отладки.
        console.log(JSON.stringify(maxDiscountIndex))//Выводит информацию о индексе максимальной скидки в консоль для отладки.
        console.log(JSON.stringify(gameLinkSelector))//Выводит информацию о созданном XPath-селекторе в консоль для отладки.
        console.error('Failed to click')//Выводит сообщение об ошибке в консоль, если не удалось выполнить клик на ссылке.
      }
    } else {//Если на странице не было найдено ни одной игры с скидкой (предыдущий if вернул false), то выполняется код в этой части блока 
      // Нет игр со скидками, выбираем игру с максимальной ценой
      const gamePrices = await page.$$eval(priceSelector, (elements) =>//Эта строка выполняет поиск всех элементов на странице, которые соответствуют селектору priceSelector, и сохраняет их в массив gamePrices.
        elements.map((element) => {//Итерируется по каждому элементу из массива elements (элементы с ценами) и выполняет следующее:
          const priceText = element.textContent//Считывает текст из элемента element, который представляет собой информацию о цене
          if (priceText) {//Проверяет, есть ли текст о цене (если нет, то элемент игнорируется).
            const price = parseFloat(
              priceText.replace(',', '.').replace('€', '')//Преобразует текст цены в число с плавающей точкой, удаляя символы , и €.
            )
            return price
          }
          return 0 //и формирует массив gamePrices, содержащий числовые значения цен.
        })
      )

      const maxPriceIndex = gamePrices.indexOf(Math.max(...gamePrices))//Находит индекс элемента с максимальной ценой в массиве gamePrices

      // Создаем селектор для игры с максимальной ценой
      const maxPriceGameLinkSelector =//Создает XPath-селектор для поиска ссылки на игру с максимальной ценой. Селектор формируется на основе найденного индекса maxPriceIndex.
        "//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'" +
        maxPriceIndex +
        "')]/ancestor::div[@class='ImpressionTrackedElement']//div[contains(@class, 'StoreSaleWidgetTitle')]/parent::a"

      // Находим ссылку на игру с максимальной ценой
      const selectedMaxPriceGameLink = await page.$(maxPriceGameLinkSelector)//Выполняет поиск элемента ссылки на игру с максимальной ценой, используя созданный селектор.

      if (selectedMaxPriceGameLink) {//Проверяет, был ли найден элемент ссылки
        // Кликаем на ссылку
        await selectedMaxPriceGameLink.click()
      } else {//Если ссылка не была найдена, выполняется в случае ошибки.
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
