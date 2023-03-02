import { test, expect, chromium } from "@playwright/test";
import OIB, { SpanLocators, UserCard } from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"
const userLogin="IVANOVAO"
const userLastName="Иванова"

test("Установка пароля для созданной учетной записи. (test 12)", async ({page}) => {

  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  const inputPassword = page.locator("(//input[@placeholder='новый пароль'])[1]")
  const inputPassword2 = page.locator("(//input[@placeholder='новый пароль'])[2]")
  const inputGeneratedPassword = page.locator("(//span[text()='Новый пароль:']/following::input)[2]")
  const GENERATE_BTN = page.locator("button[title='Сгенерировать новый пароль']")
  const SAVE_BTN = page.locator("button[title='Сохранить в файл']")
  const USE_BTN = page.locator("button[title='Использовать']")
  const CHANGE_BTN = page.locator("(//button[contains(@class,'el-button el-button--success')])[3]")
  const CLOSE_BTN = page.locator("span.close")
  
  //----------------------------------------------------------------------------------------test1

  // 1. Выделить нужную учетную запись.
  await OIB_Page.getUserCard(userLogin)
  //1. Справа появится карточка выделенного пользователя.
  await expect(page.locator(UserCard.userCard)).toBeVisible()
  await expect(page.locator(SpanLocators.lastName)).toHaveText(userLastName)
  await expect(page.locator(SpanLocators.login)).toHaveText(userLogin)

  //----------------------------------------------------------------------------------------test2

  // 2. В появившемся справа окне, нажать на изображение ключа.
  await OIB_Page.click(UserCard.BTN_KEY)
  // 2. Появится возможность внести новый пароль.
  await expect(page.locator("(//div[@class='modal-content pass']//span)[2]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3
  
    // 3. Ввести новый пароль.
    await inputPassword.fill("Asdf123$")
    await inputPassword2.fill("Asdf123$")
    // 3. Новый пароль отображается в соответствующем поле ввода.
    await expect(inputPassword).toHaveValue("Asdf123$")
    // сгенерировать системой.
    await GENERATE_BTN.click()
    await page.waitForTimeout(1000)
    const value = await inputGeneratedPassword.inputValue()
    // Если пароль сгенерирован системой, он отображается в поле ниже поля «новый пароль». 
    await expect(inputGeneratedPassword).toHaveValue(/[0-9][А-Я,а-я,A-Z, a-z]/)
    // Так же доступны 2 кнопки: сохранить в файл и использовать
    await expect(SAVE_BTN).toBeVisible()
    await expect(USE_BTN).toBeVisible()
    // Если пароль устраивает, нажать на кнопку «Использовать».
    await USE_BTN.click()
    await page.waitForTimeout(1000)
    // При нажатии кнопки «Использовать», новый пароль дублируется в поле «Повтора ввода нового пароля» 
    // и становится активной кнопка «Изменить», для сохранения измененного пароля.
    await expect(inputPassword).toHaveValue(value)
    await expect(CHANGE_BTN).not.toHaveAttribute("disabled", "disabled")
    await CLOSE_BTN.click()

  //----------------------------------------------------------------------------------------test4

  //4. Повторить новый пароль (если он был введен в ручную).
  await OIB_Page.click(UserCard.BTN_KEY)
  await inputPassword.fill("Asdf123$")
  await inputPassword2.fill("Asdf123$")
  // Нажать Изменить. Проверить, осуществив повторную авторизацию в системе.
  await CHANGE_BTN.click()

  //закрытие сессии
  await OIB_Page.shutDown()
  await page.waitForTimeout(1000)
  await OIB_Page.login("SHETININM", password)
  await OIB_Page.shutDown()
})

