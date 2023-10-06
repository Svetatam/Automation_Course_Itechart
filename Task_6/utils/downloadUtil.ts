import { Page } from '@playwright/test'

export class DownloadUtil {
  private page: Page
  constructor(page: Page) {
    this.page = page
  }

  async downloadSetupFile(page: Page) {
    await page.locator('.header_installsteam_btn_content').click()// локатор надо вынести в Page

    const downloadPromise = page.waitForEvent('download')

    await page
      .locator('#about_greeting')
      .getByRole('link', { name: 'Install Steam' })
      .click()

    const download = await downloadPromise
    const path = require('path')

    // Полный путь к папке userFiles
    const userFilesPath = path.resolve(__dirname, '../userFiles')

    // Генерировать имя файла на основе текущей даты и времени
    const fileName = 'at_' + Date.now() + '.exe'

    // Полный путь к файлу
    const savePath = path.join(userFilesPath, fileName)

    await download.saveAs(savePath)
  }
}

