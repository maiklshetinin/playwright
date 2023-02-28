import { test, expect } from "@playwright/test";
import CASHE from "./CASHE";

const login = "SHETININM"
const password = "Asdf123$"


test("Авторизоваться под валидными данными пользователя.(test 2.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)

  //----------------------------------------------------------------------------test1
  //1. Ввести валидные данные пользователя.
  await CASHE_Page.login(login, password)
  await page.waitForLoadState('networkidle')

  //1. Пользователя авторизован. Отобразится главная страница модуля.
  expect(page.locator("//h4[text()='Результаты запросов по ГРЗ']")).toBeVisible()

  //закрытие сессии
  await CASHE_Page.shutDown()
})


test("Авторизоваться под не валидными данными пользователя. (test2.2)", async ({ page }) => {
  await page.goto("http://192.168.10.11:8080/ceditor/")

  //----------------------------------------------------------------------------test1

  //1.1. Ввести не валидные данные пользователя
  // верный логин, не верный пароль
  await page.fill("(//input[@class='el-input__inner'])[1]", login)
  await page.fill("input[type='password']", `${password}$`)
  await page.click("button[type='button']")
  //1. Пользователь не авторизован. Отобразится сообщение об ошибке "Неверный логин или пароль".
  expect(page.locator("//strong[text()='Неверный логин или пароль']")).toHaveText("Неверный логин или пароль")
  await page.click("//i[@class='el-message-box__close el-icon-close']")

  //----------------------------------------------------------------------------test2

  // неверный логин и верный пароль
  await page.fill("(//input[@class='el-input__inner'])[1]", login)
  await page.fill("input[type='password']", `${password}$`)
  await page.click("button[type='button']")

  //1. Пользователь не авторизован. Отобразится сообщение об ошибке "Неверный логин или пароль".
  expect(page.locator("//strong[text()='Неверный логин или пароль']")).toHaveText("Неверный логин или пароль")
  await page.click("//i[@class='el-message-box__close el-icon-close']")
})

