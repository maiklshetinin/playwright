import { test, expect } from "@playwright/test";


test("Перейти на страницу авторизации.(test 1)", async ({ page }) => {
  //----------------------------------------------------------------------------test1 
  //1. Перейти на страницу авторизации в браузере.
  await page.goto("http://192.168.10.11:8080/ceditor/")

  //1. Страница загружается. Доступно окно для ввода данных пользователя для авторизации.
  // Отображение логотипа над формой авторизации.
  expect(page.locator("(//input[@class='el-input__inner'])[1]")).toBeVisible()
  expect(page.locator("input[type='password']")).toBeVisible()
  expect(page.locator("//div[@class='logo flex-child']")).toBeVisible()
})

