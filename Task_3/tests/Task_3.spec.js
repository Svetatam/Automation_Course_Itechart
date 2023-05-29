import { test, expect } from "@playwright/test";

import creds from "./creds.json";
const login = creds["login"];
const password = creds["password"];

test("login form", async ({ page }) => {
  await page.goto("https://demoqa.com/login");
  //залогиниться
  await page.fill("#userName", login);
  await page.fill("#password", password);
  await page.click("#login");
  await expect(page).toHaveURL("https://demoqa.com/profile");

  // проверить, что есть куки

  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name === "userID").value).toBeTruthy();
  expect(cookies.find((c) => c.name === "userName").value).toBeTruthy();
  expect(cookies.find((c) => c.name === "expires").value).toBeTruthy();
  expect(cookies.find((c) => c.name === "token").value).toBeTruthy();

  //сохранить userID и token
  const userID = cookies.find((c) => c.name == "userID").value;
  const token = cookies.find((c) => c.name == "token").value;

  //заблокировать все картинки
  await page.route("**/*.{png,jpg,webp,gif,svg,ICO, TIFF, EPS}", (route) =>
    route.abort()
  );
  await page.goto("https://demoqa.com/books");

  //создать ожидание для перехвата get запроса

  const responsePromise = page.waitForResponse(
    "https://demoqa.com/BookStore/v1/Books"
  );
  await page.goto("https://demoqa.com/profile");

  //в меню слева кликнуть Book Store

  await page
    .getByRole("listitem")
    .filter({ hasText: /^Book Store$/ })
    .click();

  //посчитать количество книг на UI
  const listOfBooks = page.locator(".action-buttons");
  //эта проверка чисто для себя
  await expect(listOfBooks).toHaveCount(8);

  // Дождаться загрузки страницы
  await page.waitForSelector(".rt-tbody");

  // Сделать скриншот страницы и сохранить
  await page.screenshot({ path: "book-store.png", fullPage: true });

  //проверить перехваченный GET запрос
  const responseBooks = await responsePromise;

  const responseBooksBody = await responseBooks.json();
  await expect(responseBooks.status()).toBe(200);
  await expect(page.locator(".action-buttons")).toHaveCount(
    responseBooksBody.books.length
  );

  //модифицировать ответ от GET. Изменить количество страниц на случайное число от 1 до 1000
  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  await page.route(
    "https://demoqa.com/BookStore/v1/Book?ISBN=*",
    async (route) => {
      const response = await route.fetch();
      console.log(response.json());
      let body = await response.text();
      let booksBody = JSON.parse(body);
      body = body.replace(booksBody.pages, randomNumber);
      route.fulfill({
        response,
        body,
        headers: { ...response.headers() },
      });
    }
  );

  await page
    .locator(
      "#app > div > div > div.row > div.col-12.mt-4.col-md-6 > div.books-wrapper > div.ReactTable.-striped.-highlight > div.rt-table > div.rt-tbody > div:nth-child(1) > div > div:nth-child(2)"
    ) // я не знаю как найти нормальный локатор
    .click();

  await page.waitForSelector(".profile-wrapper");

  const pages = await page.$eval(
    "#pages-wrapper > div.col-md-9.col-sm-12",
    (el) => el.textContent
  );

  expect(pages).toBe(String(randomNumber));

  // await page.screenshot({ path: "book-store.png", fullPage: true });

  //выполнить API запрос
  //В хедерах добавить токен
  const responseAPI = await page.request.get(
    `https://demoqa.com/Account/v1/User/${userID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const books = await responseAPI.json();

  // Проверка наличия массива книг
  expect(books).toHaveProperty("books");
  expect(Array.isArray(books.books)).toBeTruthy();

  // Проверка соответствия ID пользователя
  expect(books).toHaveProperty("userId", userID);

  // Проверка соответствия имени пользователя
  expect(books).toHaveProperty("username", login);
});
