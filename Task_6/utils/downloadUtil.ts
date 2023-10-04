import { Page } from '@playwright/test'
<<<<<<< HEAD

=======
import fs from 'fs'
import path from 'path'
>>>>>>> 7dce5be30291f173cf9069572a500689c2f9aa9d

export class DownloadUtil {
  private page: Page
  constructor(page: Page) {
    this.page = page
  }

  async downloadSetupFile(page: Page) {
    await page.locator('.header_installsteam_btn_content').click()

    const downloadPromise = page.waitForEvent('download')

    await page
      .locator('#about_greeting')
      .getByRole('link', { name: 'Install Steam' })
      .click()

    const download = await downloadPromise
<<<<<<< HEAD
    const path = require('path')

    // Полный путь к папке userFiles
    const userFilesPath = path.resolve(__dirname, '../userFiles')

    // Генерировать имя файла на основе текущей даты и времени
    const fileName = 'at_' + Date.now() + '.exe'

    // Полный путь к файлу
    const savePath = path.join(userFilesPath, fileName)
=======
    const path = require('path');

      // Полный путь к папке userFiles
      const userFilesPath = path.resolve(__dirname, '../userFiles');
      
      // Генерировать имя файла на основе текущей даты и времени
      const fileName = 'at_' + Date.now() + '.exe';
      
      // Полный путь к файлу
      const savePath = path.join(userFilesPath, fileName);


>>>>>>> 7dce5be30291f173cf9069572a500689c2f9aa9d

    await download.saveAs(savePath)
  }
}

