import { Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'

export class DownloadUtil {
  private page: Page
  constructor(page) {
    this.page = page
  }

  async downloadSetupFile(page) {
    await page.locator('.header_installsteam_btn_content').click()

    const downloadPromise = page.waitForEvent('download')

    await page
      .locator('#about_greeting')
      .getByRole('link', { name: 'Install Steam' })
      .click()

    const download = await downloadPromise
    const path = require('path');

      // Полный путь к папке userFiles
      const userFilesPath = path.resolve(__dirname, '../userFiles');
      
      // Генерировать имя файла на основе текущей даты и времени
      const fileName = 'at_' + Date.now() + '.exe';
      
      // Полный путь к файлу
      const savePath = path.join(userFilesPath, fileName);



    await download.saveAs(savePath)
  }

  async renameLatestFile(downloadPath) {
    const files = fs.readdirSync(downloadPath)
    const latestFile = files.reduce((prev, curr) => {
      const prevTimestamp = fs.statSync(`${downloadPath}/${prev}`).ctimeMs
      const currTimestamp = fs.statSync(`${downloadPath}/${curr}`).ctimeMs
      return currTimestamp > prevTimestamp ? curr : prev
    })
    const currentTimestamp = Date.now()
    const renamedFile = `${downloadPath}/setup_${currentTimestamp}.exe`
    fs.renameSync(`${downloadPath}/${latestFile}`, renamedFile)
    return renamedFile
  }
}
