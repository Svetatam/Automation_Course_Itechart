import { test, expect, chromium } from '@playwright/test'

// import { login, password } from './creds'


import creds  from './creds2.json'
const login = creds['login'];
const password =creds['password'];

  test('login form', async ({ request }) => {
    const browser = await chromium.launch({
      logger: {
              isEnabled: () => true,
              log: (name, message, severity) =>
                console.log(`${name} ${message} ${severity}`),
            },
          })
          const context = await browser.newContext()
          const page = await context.newPage()
        

         
    await test.step('go to login page and fill credentials', async () => {
     
      await page.goto('https://demoqa.com/login')
      await page.fill('#userName', login)
      await page.fill('#password', password)
      await page.click('#login')
    })


  await test.step('check for cookies', async () => {
    await expect(page).toHaveURL('https://demoqa.com/profile')
    const cookies = await page.context().cookies()
  // @ts-ignore
    expect(cookies.find((c) => c.name === 'userID').value).toBeTruthy()
  // @ts-ignore
    expect(cookies.find((c) => c.name === 'userName').value).toBeTruthy()
  // @ts-ignore
    expect(cookies.find((c) => c.name === 'expires').value).toBeTruthy()
  // @ts-ignore
    expect(cookies.find((c) => c.name === 'token').value).toBeTruthy()
  })

  await test.step('block images and go to book store', async () => {
    await page.route('**/*.{png,jpg,webp,gif,svg,ICO, TIFF, EPS}', (route) =>
      route.abort()
    )
    await page.goto('https://demoqa.com/books')
  })

  await test.step('wait for response and click on Book Store', async () => {
    const responsePromise = page.waitForResponse(
      'https://demoqa.com/BookStore/v1/Books'
    )
    await page.goto('https://demoqa.com/profile')
    await page
      .getByRole('listitem')
      .filter({ hasText: /^Book Store$/ })
      .click()
    const responseBooks = await responsePromise
    const responseBooksBody = await responseBooks.json()
    await expect(responseBooks.status()).toBe(200)
    await expect(page.locator('.action-buttons')).toHaveCount(
      responseBooksBody.books.length
    )
  })

  await test.step('modify GET response and check number of pages', async () => {
    const randomNumber = Math.floor(Math.random() * 1000) + 1
    await page.route(
      'https://demoqa.com/BookStore/v1/Book?ISBN=*',
      async (route) => {
        const response = await route.fetch()
        console.log(response.json())
        let body = await response.text()
        const booksBody = JSON.parse(body)
  // @ts-ignore
        body = body.replace(booksBody.pages, randomNumber)
        route.fulfill({
          response,
          body,
          headers: { ...response.headers() },
        })
      }
    )
    await page.getByText('Git Pocket Guide').click()
    await page.waitForSelector('.profile-wrapper')
    const pages = await page.$eval(
      '#pages-wrapper > div.col-md-9.col-sm-12',
      (el) => el.textContent
    )
    expect(pages).toBe(String(randomNumber))
  })

  await test.step('make API request and check response', async () => {
      // @ts-ignore
    const userID = (await page.context().cookies()).find(
      (c) => c.name == 'userID'
    ).value
  // @ts-ignore
    const token = (await page.context().cookies()).find(
      (c) => c.name == 'token'
    ).value
    const responseAPI = await page.request.get(
      `https://demoqa.com/Account/v1/User/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    await test.step('Check array, userID and username', async () => {
      const books = await responseAPI.json()

      expect(books).toHaveProperty('books')
      expect(Array.isArray(books.books)).toBeTruthy()

      expect(books).toHaveProperty('userId', userID)

      expect(books).toHaveProperty('username', login)
    })
  })
})