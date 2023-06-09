import { test, expect, chromium } from '@playwright/test';

import {LoginPage} from './LoginPage';
import {ProfilePage} from './ProfilePage';
import {BookStorePage} from './BookStorePage';

import creds from './creds3.json'
const login = creds['login']
const password = creds['password']

test('login form', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);
  const bookStorePage = new BookStorePage(page);

  await loginPage.goto();
  await loginPage.fillCredentials(login, password);
  await loginPage.clickLogin();
  await profilePage.waitForURL();

  const cookies = await profilePage.getCookies();

  expect(cookies.find((c) => c.name === 'userID').value).toBeTruthy();
  expect(cookies.find((c) => c.name === 'userName').value).toBeTruthy();
  expect(cookies.find((c) => c.name === 'expires').value).toBeTruthy();
  expect(cookies.find((c) => c.name === 'token').value).toBeTruthy();

  await bookStorePage.blockImagesAndGoToBookStore();
   
  await test.step('wait for response and click on Book Store', async () => {
    const responsePromise = page.waitForResponse(
      'https://demoqa.com/BookStore/v1/Books'
    )
    await page.goto('https://demoqa.com/profile')

  await profilePage.clickBookStore();
 
  const responseBooks = await responsePromise;
  
   const responseBooksBody = await responseBooks.json();
 
  expect(responseBooks.status()).toBe(200);

  await expect(page.locator('.action-buttons')).toHaveCount(
    responseBooksBody.books.length
  )
  
  
  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  await bookStorePage.modifyGetResponse(randomNumber);
  await bookStorePage.clickFirstBook();
  await bookStorePage.waitForProfileWrapper();

  const pages = await bookStorePage.getPagesText();
  expect(pages).toBe(String(randomNumber));

  const userID = await profilePage.getUserID();
  const token = await profilePage.getToken();

  const responseAPI = await profilePage.getUserDetails(userID, token);

  const books = await responseAPI.json();
  expect(books).toHaveProperty('books');
  expect(Array.isArray(books.books)).toBeTruthy();
  expect(books).toHaveProperty('userId', userID);
  expect(books).toHaveProperty('username', login);
})
})

