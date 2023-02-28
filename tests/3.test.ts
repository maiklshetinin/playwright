import { UserMenu } from './../OIB/OIB';
import { test, expect } from "@playwright/test";
import CASHE, { MainPage } from "./CASHE";

const login = "SHETININM"
const password = "Asdf123$"


test("Проверка версии.(test 3)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)

  //----------------------------------------------------------------------------test1

  //1. Авторизоваться в модуле Владельцев ТС.
  await CASHE_Page.login(login, password)
  await page.waitForLoadState('networkidle')
  //1. Загрузились все компоненты интерфейса (кнопки, значки, поля, надписи).
  await expect(page.locator("//h4[text()='Результаты запросов по ГРЗ']")).toHaveText("Результаты запросов по ГРЗ")
  await expect(page.locator(MainPage.BTN_GRZ)).toBeVisible()
  await expect(page.locator(MainPage.BTN_FNS)).toBeVisible()
  await expect(page.locator(MainPage.BTN_SEARCH)).toBeVisible()
  await expect(page.locator(MainPage.BTN_REFRESH)).toBeVisible()
  await expect(page.locator(UserMenu.BTN_USER_MENU)).toBeVisible()
  await expect(page.locator(MainPage.input_search)).toBeVisible()
  await expect(page.locator("(//span[text()='Источники'])[1]")).toHaveText("Источники")
  await expect(page.locator(MainPage.input_sources)).toBeVisible()

  const time = await page.locator("//div[@title='Время сервера']").getByText(/\d\d:\d\d/).innerText()
  expect(time).not.toHaveLength(0)

  //----------------------------------------------------------------------------test2

  //2. Кликнуть по Меню пользователя.
  await CASHE_Page.click(UserMenu.BTN_USER_MENU)
  //2. Откроется меню пользователя для работы с интерфейсом и настройками входа.
  await expect(page.locator("//ul[contains(@class,'el-dropdown-menu el-popper')]")).toBeVisible()

  //----------------------------------------------------------------------------test3

  //3. Убедиться, что версия в интерфейсе соответствует обновлениям.

  //?

  //3. Версия актуальна.
  //----------------------------------------------------------------------------test4



  const v = await page.locator("//li[contains(@class,'el-dropdown-menu__item is-disabled')]").innerText()
  await page.waitForTimeout(100)
  //4. Запустить Панель разработчика (F12) -> Консоль.

















  await CASHE_Page.click(UserMenu.BTN_USER_MENU)

  //4. Версия соответствует версии в интерфейсе.


  //закрытие сессии
  await CASHE_Page.shutDown()
})




