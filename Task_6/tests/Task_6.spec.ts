import { test, expect, chromium } from '@playwright/test'

import { Locator, Page } from '@playwright/test';

import {LoginPage} from './loginPage';
import {ProfilePage} from './ProfilePage';
import {BookStorePage} from './BookStorePage';

import creds from './creds3.json'
const login = creds['login']
const password = creds['password']




// берется из LoginForm
test('login form', async ({page}) => {
  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);
  const bookStorePage = new BookStorePage(page);

  await loginPage.goto();
  await loginPage.fillCredentials(login, password);
  await loginPage.clickLogin();

  // const browser = await chromium.launch({
  //   logger: {
  //     isEnabled: () => true,
  //     log: (name, message, severity) =>
  //       console.log(`${name} ${message} ${severity}`),
  //   },
  // })
 
  await profilePage.waitForURL();

  
  const cookies = await profilePage.getCookies();

  //@ts-ignore
  expect(cookies.find((c) => c.name === 'userID').value).toBeTruthy();
  expect(cookies.find((c) => c.name === 'userName').value).toBeTruthy();
  expect(cookies.find((c) => c.name === 'expires').value).toBeTruthy();
  expect(cookies.find((c) => c.name === 'token').value).toBeTruthy();

  await bookStorePage.blockImagesAndGoToBookStore();
  await profilePage.goto();
  await bookStorePage.waitForResponse();

  
  await profilePage.clickBookStore();

})