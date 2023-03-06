import { test, expect, chromium } from "@playwright/test";
import { LOGIN, PASSWORD } from "./OIB";

test("Завершение работы. (test 6)", async () => {
  const browser = await chromium.launch({
    headless: false//режим визуального отображения
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  //enter to OIB
  await page.goto("http://172.20.255.251:8080/authWeb/")
  await page.fill("input[placeholder='Логин']", LOGIN)
  await page.fill("input[type='password']", PASSWORD)
  await page.click("//button[@type='button']//span[1]")


  const pagePromise = context.waitForEvent('page'); //ставим обработчик событий на открытие новой страницы
  await page.click("div#container>main>div>div:nth-of-type(7)") //клик на вкладку ОИБ в шоколадке
  const OIB_Page = await pagePromise;
  await OIB_Page.waitForLoadState();

  //----------------------------------------------------------------------------------------test1

  //1. Открыть меню пользователя. Выбрать «Завершить работу».
  await OIB_Page.click("//div[@class='el-dropdown']//div[1]") //user's menu
  await OIB_Page.click("//li[text()='Завершить работу']")
  await OIB_Page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
  await page.waitForTimeout(1000)

  //Выход из модуля. Вкладка браузера закрывается.
   expect(context.pages().length).toBe(1)

})








