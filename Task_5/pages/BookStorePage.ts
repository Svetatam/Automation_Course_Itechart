import { Page } from '@playwright/test'

class BookStorePage {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goToBookStore() {
    await this.page.goto('https://demoqa.com/books')
  }

  async modifyGetResponse(randomNumber: number) {
    await this.page.route(
      'https://demoqa.com/BookStore/v1/Book?ISBN=*',
      async (route) => {
        const response = await route.fetch()
        const body = await response.text()
        const booksBody = JSON.parse(body)
        const modifiedBody = body.replace(
          booksBody.pages,
          randomNumber.toString()
        )
        route.fulfill({
          response,
          body: modifiedBody,
          headers: { ...response.headers() },
        })
      }
    )
  }

  async clickFirstBook() {
    await this.page
      .locator(
        '#app > div > div > div.row > div.col-12.mt-4.col-md-6 > div.books-wrapper > div.ReactTable.-striped.-highlight > div.rt-table > div.rt-tbody > div:nth-child(1) > div > div:nth-child(2)'
      )
      .click() // Замените <locator> на соответствующий локатор элемента
  }

  async waitForProfileWrapper() {
    await this.page.waitForSelector('.profile-wrapper')
  }

  async getPagesText() {
    return await this.page.$eval(
      '#pages-wrapper > div.col-md-9.col-sm-12',
      (el) => el.textContent
    )
  }
}

export { BookStorePage }
