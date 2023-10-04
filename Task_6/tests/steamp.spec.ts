import { test } from '@playwright/test'

import { MainPage } from '../pages/MainPage'
import { NewTrending } from '../pages/NewTrendingPage'
import { DownloadUtil } from '../utils/downloadUtil'
import { ActionPage } from '..//pages/ActionPage'
import { GamePage } from '..//pages/GamePage'
import { VerifacationPage } from '..//pages/VerifacationPage'




test('TestSteam', async ({ page }) => {
  const mainPage = new MainPage(page)
  const actionPage = new ActionPage(page)
  const newTrending = new NewTrending(page)
  const gamePage = new GamePage(page)
  const verificationPage = new VerifacationPage(page)
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

  //3. На вкладке New and Trending выбрать игру из условия максимальной скидки (только на первой странице).
  // Если скидки отсутствуют, то выбрать игру с максимальной ценой

  // Scroll to the New & Trending tab
  await test.step('Scroll to the New & Trending tab', async () => {
    await actionPage.scrollTo()
  })

  
    await actionPage.waitForSelector()
 
    await page.screenshot({ path: 'screenshot.png' }) // это потом убрать///////////////////////////////////////////////////////////////////

  await test.step('Select game with maximum discount or maximum price', async () => {
    // Локатор для элементов с информацией о скидках
    await actionPage.findMaxDiscount()

    

    // await test.step('Check the price', async () => {
    //   await gamePage.comparePrice()

      
    // })

    // Check for age verification

    await test.step('Check age verification', async () => {
      await verificationPage.isAgeVerificationRequired()
      await verificationPage.completeAgeVerification()
    })

    // 3 Скачать Setup файл

    await test.step('Download Setup file', async () => {
      await downloadUtil.downloadSetupFile(page)
    })

    // 4 Переименовать скачанный файл – добавить к имени текущий timestamp()
    await test.step('Rename downloaded file', async () => {
      const downloadPath =
        'C:\\Users\\s.tamashevich\\Desktop\\Automation_Course_Itechart\\Task_6\\userFiles'

      await newTrending.renameLatestFile(downloadPath)
    })
  })
})
