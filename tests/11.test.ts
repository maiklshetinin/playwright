import { test, expect, chromium } from "@playwright/test";
import OIB, { InputLocators, LAST_NAME, LOGIN, SpanLocators, UserCard } from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"
const userLogin="IVANOV1"
const userLastName="Ivanov1"
const userFirstName="Ivan"


test("Редактирование учетной записи. (test 11)", async ({page}) => {
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //----------------------------------------------------------------------------------------test1
  
  //1. Выделить нужную учетную запись.
  await OIB_Page.getUserCard(userLogin)
  //1. Справа появится карточка выделенного пользователя.
  await expect(page.locator(UserCard.userCard)).toBeVisible()
  await expect(page.locator(SpanLocators.lastName)).toHaveText(userLastName)
  await expect(page.locator(SpanLocators.login)).toHaveText(userLogin)

  //----------------------------------------------------------------------------------------test2
  
  //2. В появившемся справа окне, нажать на изображение карандаша.
  await OIB_Page.click(UserCard.BTN_EDIT)
  //2. Появится возможность внесения данных в запись.
  await expect(page.locator(InputLocators.lastName)).toBeVisible()

  //----------------------------------------------------------------------------------------test3

  //3. Внести изменения в запись. Нажать Сохранить.
  await page.fill(InputLocators.firstName,userFirstName)
  await OIB_Page.click(UserCard.BTN_SAVE)
  //3. Изменения будут Сохранены.
  await expect(page.locator(SpanLocators.firstName)).toHaveText("Ivan")

  //----------------------------------------------------------------------------------------test4
  
  //3. Внести изменения в запись. Нажать Отмена.
  await OIB_Page.click(UserCard.BTN_EDIT)
  await page.fill(InputLocators.firstName,"I")
  await OIB_Page.click(UserCard.BTN_CANCEL)
   //3. Изменения не будут Сохранены.
  await expect(page.locator(SpanLocators.firstName)).not.toHaveText("I")

 //закрытие сессии
 await OIB_Page.shutDown()
})

