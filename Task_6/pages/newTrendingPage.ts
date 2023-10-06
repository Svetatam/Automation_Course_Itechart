import { Page, expect } from '@playwright/test'
import fs from 'fs'

class NewTrending {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  // 4 Переименовать скачанный файл – добавить к имени текущий timestamp()

  
  async renameLatestFile(downloadPath: fs.PathLike) {
   

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

export { NewTrending }
