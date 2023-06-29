import { test, expect } from '@playwright/test'

import { LoginPage } from '../pages/loginPage'
import { ProfilePage } from '../pages/profilePage'
import { BookStorePage } from '../pages/bookStorePage'
import { CookiesUtil } from '../utils/cookiesUtil'
import { ApiUtil } from '../utils/apiUtil'

import creds from './creds3.json'

const login = creds['login']
const password = creds['password']

// логинимся
test('login form', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const profilePage = new ProfilePage(page)
  const bookStorePage = new BookStorePage(page)

  await loginPage.goto()
  await loginPage.fillCredentials(login, password)
  await loginPage.clickLogin()
  await profilePage.waitForURL()

 // проверяем куки
 await test.step('Check cookies', async () => {
  const cookies = await CookiesUtil.GetCookies(page)

  expect(cookies.find((c) => c.name === 'userID').value).toBeTruthy()
  expect(cookies.find((c) => c.name === 'userName').value).toBeTruthy()
  expect(cookies.find((c) => c.name === 'expires').value).toBeTruthy()
  expect(cookies.find((c) => c.name === 'token').value).toBeTruthy()
})

  //блокируем картинки
await test.step('Block images', async () => {
  await ApiUtil.BlockImages(page)
})

await test.step('Go to Book Store', async () => {
  await bookStorePage.goToBookStore()
})

  // ждем ответа и кликаем на бук стор
  await test.step('Wait for response and click on Book Store', async () => {
    const responsePromise = page.waitForResponse(
      'https://demoqa.com/BookStore/v1/Books'
    )
    await page.goto('https://demoqa.com/profile')

    await profilePage.clickBookStore()


    //проверяем ответ 
    const responseBooks = await responsePromise

    const responseBooksBody = await responseBooks.json()

    expect(responseBooks.status()).toBe(200)

    await expect(page.locator('.action-buttons')).toHaveCount(
      responseBooksBody.books.length
    )
// модифицируем ответ

await test.step('Modify response and check pages', async () => {
    const randomNumber = Math.floor(Math.random() * 1000) + 1
    await bookStorePage.modifyGetResponse(randomNumber)
    await bookStorePage.clickFirstBook()
    await bookStorePage.waitForProfileWrapper()

    const pages = await bookStorePage.getPagesText()
    expect(pages).toBe(String(randomNumber))
  })
//
await test.step('Get user details and check books', async () => {
    const userID = await CookiesUtil.GetUserID(page)
    const token = await CookiesUtil.GetToken(page)

    //проверяем массив, userID и username
    const books = await ApiUtil.GetUserDetails(page, userID, token)

    expect(books).toHaveProperty('books')
    expect(Array.isArray(books.books)).toBeTruthy()
    expect(books).toHaveProperty('userId', userID)
    expect(books).toHaveProperty('username', login)
  })
  })
})
