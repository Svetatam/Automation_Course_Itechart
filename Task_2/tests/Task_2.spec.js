import { test, expect } from "@playwright/test";

test("filling the placeholder", async ({ page }) => {
  await page.goto("https://demoqa.com/books");
  await page.getByPlaceholder("Type to search").fill("Git");
  await page.locator("#basic-addon2 svg").click();
  await expect(page).toHaveURL("https://demoqa.com/books");
});

test("filling the placeholder2", async ({ page }) => {
  await page.goto("https://www.toolsqa.com/selenium-training/");
  await page.getByPlaceholder("Search").nth(1).fill("Selenium");
  await page.getByPlaceholder("Search").nth(1).press("Enter");
  await expect(page).toHaveURL(
    "https://www.toolsqa.com/search?keyword=Selenium"
  );
});

test("Check the checkbox", async ({ page }) => {
  await page.goto("https://demoqa.com/automation-practice-form");
  await page.getByText("Sports").click();
  await expect(page.getByText("Sports")).toBeChecked();
});

test("hover", async ({ page }) => {
  await page.goto("https://demoqa.com/menu#");
  await page.getByRole("link", { name: "Main Item 2" }).hover();
});

test("drag & drop ", async ({ page }) => {
  await page.goto("https://demoqa.com/droppable");
  await page.locator("#draggable").dragTo(
    page.locator("#simpleDropContainer #droppable.drop-box.ui-droppable") //исправить локатор
  );
});

test("Upload one file", async ({ page }) => {
  await page.goto("https://demoqa.com/upload-download");
  await page.getByLabel("Select a file").setInputFiles("myFile.pdf");
  const path = page.locator("#uploadedFilePath");
  await expect(path).toContainText("myFile.pdf");
});

test("Select options", async ({ page }) => {
  await page.goto("https://demoqa.com/select-menu");
  await page.locator("#oldSelectMenu").selectOption("8");
  await expect(page.locator("#oldSelectMenu option:checked")).toHaveText(
    " Indigo"
  );
});
