import { test, expect, chromium } from "@playwright/test";
import OIB from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"

test("Отображение времени (test 7)", async ({ page }) => {
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)
  await page.waitForLoadState('networkidle')
  //----------------------------------------------------------------------------------------test1

  //1. Слева внизу отображается время сервера. И дата, установленная в системе пользователя.
  //Навести указатель мышки на время.
  await page.locator("//div[@title='Время сервера']").scrollIntoViewIfNeeded()
  await page.hover("//div[@title='Время сервера']")
  const time = await page.locator("//div[@title='Время сервера']").getByText(/\d\d:\d\d/).innerText()

  //1. Появится попап сообщение с надписью «Время сервера».
  expect(page.locator("//div[@title='Время сервера']")).toHaveAttribute("title", "Время сервера")
  expect(time).not.toHaveLength(0)

  //закрытие сессии
  await OIB_Page.shutDown()
})