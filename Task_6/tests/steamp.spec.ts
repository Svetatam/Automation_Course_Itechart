import { test } from '@playwright/test'

import { LoginPage } from '../pages/loginPage'
import { ProfilePage } from '../pages/profilePage'
import { DownloadUtil } from '../utils/DownloadUtil'

// 1 Перейти на https://store.steampowered.com/
test('TestSteam', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const profilePage = new ProfilePage(page)
  const downloadUtil = new DownloadUtil(page)

  await test.step('Go to Steam Store', async () => {
    await loginPage.goto()
    await profilePage.waitForURL()
  })
  //2 В меню навести мышь на Categories > кликнуть Action.

  await test.step('Hover over Categories and click Action', async () => {
    await profilePage.hoverOverCategories()
    await profilePage.clickAction()
    await profilePage.waitForSecondURL()
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
