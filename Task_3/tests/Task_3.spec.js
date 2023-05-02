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

  await page.route(
    "https://demoqa.com/BookStore/v1/Book?ISBN=*",
    async (route) => {
      const randomNumber = Math.floor(Math.random() * 1000) + 1;
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

  await page.getByText("Git Pocket Guide").click();
  await page.waitForSelector(".profile-wrapper");

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
  expect(books).toEqual({
    books: [],
    userId: "012fd6c7-30b3-4ff5-a616-6780b1d9da55",
    username: "SvTam",
  });
});
