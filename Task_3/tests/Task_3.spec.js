import { test, expect } from "@playwright/test";

import { login, password } from "./creds.spec.js";

test("login form", async ({ page }) => {
  await page.goto("https://demoqa.com/login");
  //залогиниться
  await page.fill("#userName", login);
  await page.fill("#password", password);
  await page.click("#login");
  await expect(page).toHaveURL("https://demoqa.com/profile");

  // проверить, что есть куки

  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name == "userID").value).toBeTruthy();
  expect(cookies.find((c) => c.name == "userName").value).toBeTruthy();
  expect(cookies.find((c) => c.name == "expires").value).toBeTruthy();
  expect(cookies.find((c) => c.name == "token").value).toBeTruthy();

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
    (response) =>
      response.url() === "https://demoqa.com/BookStore/v1/Books" &&
      response.status() === 200
  );

  //в меню слева кликнуть Book Store

  await page
    .getByRole("listitem")
    .filter({ hasText: /^Book Store$/ })
    .click();
  // const response = await responsePromise;
  // Дождаться загрузки страницы
  await page.waitForSelector(".rt-tbody");

  // Сделать скриншот страницы и сохранить
  await page.screenshot({ path: "book-store.png" });

  //проверить перехваченный GET запрос
  const responseBooks = await response;
  // console.log(responseBooks.status());
  const responseBooksBody = await responseBooks.json();
  await expect(responseBooksBody.books).toHaveLength(8);
  await expect(response.status()).toBe(200);
});
// expect(response.status).toBe(200);

test("проверка GET запроса на странице https://demoqa.com/BookStore/v1/Books", async ({
  page,
}) => {
  // переходим на страницу
  await page.goto("https://demoqa.com/books");
  // ждем перехвата GET запроса
  const response = await page.waitForResponse((response) => {
    response.url() === "https://demoqa.com/BookStore/v1/Books" &&
      response.status() === 200;
  });
  // проверяем статус ответа
  expect(response.status()).toBe(200);
  // получаем количество книг через UI
  const bookCount = await page.$$eval(".rt-tr-group", (groups) => {
    return groups.reduce((acc, group) => {
      const count = group
        .querySelector(".rt-td:nth-child(2)")
        .textContent.trim();
      return acc + parseInt(count);
    }, 0);
  });
  // получаем количество книг из перехваченного ответа
  const { books } = await response.json();
  const bookCountFromResponse = books.length;
  // сравниваем количество книг
  expect(bookCountFromResponse).toBe(bookCount);
});
