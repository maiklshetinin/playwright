import { test, expect, chromium } from "@playwright/test";
import CASHE, { UserMenu } from "./CASHE";

const login = "SHETININM"
const password = "Asdf123$"

test("Смена пароля пользователя. (test 6.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(login, password)

  //----------------------------------------------------------------------------------------test1

  //1. Открыть меню пользователя. Выбрать  пункт «Сменить пароль».
  await CASHE_Page.click(UserMenu.BTN_USER_MENU)
  await CASHE_Page.click(UserMenu.change_password)
  //1. Откроется окно для обновления текущего пароля
  await expect(page.getByText("Изменение пароля")).toBeVisible()

  //----------------------------------------------------------------------------------------test2

  //(не менее 8 символов лат., 1 символ в верхнем регистре, 1 символ в нижнем регистре, не менее 1 цифры,
  //не менее 1 спецсимволов, также пароль должен быть отличен от распространённых паролей, таких как 12345678).

  // - старый пароль
  await page.fill("input[placeholder='старый пароль']", password)
  // - новый пароль
  await page.fill("(//span[text()='Новый пароль:']/following::input)[1]", "12345678")
  // - повтор нового пароля
  await page.fill("//span[text()='Повторите новый пароль:']/following::input", "12345678")
  expect(page.locator("(//button[@disabled='disabled'])[2]")).toHaveAttribute("disabled", "disabled");

  //   2. Заполнить все доступные поля:
  // - старый пароль
  await page.fill("input[placeholder='старый пароль']", password)
  // - новый пароль
  await page.fill("(//span[text()='Новый пароль:']/following::input)[1]", `${password}$`)
  // - повтор нового пароля
  await page.fill("//span[text()='Повторите новый пароль:']/following::input", `${password}$`)
  // Нажать «Изменить».
  await page.click("//span[text()='Изменить']")

  //2. Пароль пользователя будет изменен.
  //закрытие сессии
  await CASHE_Page.shutDown()

  await CASHE_Page.login(login, `${password}$`)
  await page.waitForLoadState("domcontentloaded")
  await expect(page.locator("//h4[text()='Результаты запросов по ГРЗ']")).toHaveText("Результаты запросов по ГРЗ")

  //закрытие сессии
  await CASHE_Page.shutDown()
})


test("return old user password", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(login, `${password}$`)

  await CASHE_Page.click(UserMenu.BTN_USER_MENU)
  await CASHE_Page.click(UserMenu.change_password)
  await page.fill("input[placeholder='старый пароль']", `${password}$`)
  await page.fill("(//span[text()='Новый пароль:']/following::input)[1]", password)
  await page.fill("//span[text()='Повторите новый пароль:']/following::input", password)
  await page.click("//span[text()='Изменить']")

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test.only("Ввод некорректного старого пароля. (test 6.2)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(login, password)

  //----------------------------------------------------------------------------------------test1
  //1. Кликнуть на изображение пользователя.
  await CASHE_Page.click(UserMenu.BTN_USER_MENU)
  //2. Выбрать пункт «Сменить пароль».
  await CASHE_Page.click(UserMenu.change_password)
  //3. Ввести некорректный старый пароль.
  await page.fill("input[placeholder='старый пароль']", `${password}$`)
  //4. Ввести и подтвердить новый пароль.
  await page.fill("(//span[text()='Новый пароль:']/following::input)[1]", "12345678")
  await page.fill("//span[text()='Повторите новый пароль:']/following::input", "12345678")
  //5. Нажать «Изменить».
  await page.click("//span[text()='Изменить']")
  //Валидация пароля срабатывает (не менее 8 символов лат., 1 символ в верхнем регистре, не менее 1 цифры, не менее 1 спецсимволов).
  //Получаем сообщение сообщение об ошибке "Неверно указан старый пароль!"
  expect(page.locator("//div[text()='Неверно указан старый пароль!']"))


  //закрытие сессии
  await CASHE_Page.shutDown()
})
