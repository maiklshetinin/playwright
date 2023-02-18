import { test, expect, chromium } from "@playwright/test";


test("user's manual", async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  //enter to OIB
  await page.goto("http://172.20.255.251:8080/authWeb/")
  await page.fill("input[placeholder='Логин']", "SHETININM")
  await page.fill("input[type='password']", "Asdf123$")
  await page.click("//button[@type='button']//span[1]")

  const pagePromise = context.waitForEvent('page'); //ставим обработчик событий на открытие новой страницы
  await page.click("div#container>main>div>div:nth-of-type(7)") //клик на вкладку ОИБ в шоколадке
  const OIB_Page = await pagePromise;
  await OIB_Page.waitForLoadState();
  console.log(await OIB_Page.title());


  await OIB_Page.click("//div[@class='el-dropdown']//div[1]") //user's menu

  await OIB_Page.click("//li[text()='Руководство']") 
  
  const [multipage] = await Promise.all([
    OIB_Page.waitForEvent("popup"),
])
await OIB_Page.waitForLoadState()

const pages = multipage.context().pages()
    console.log('No.of tabs' + pages.length);

    pages.forEach(tab => {
        console.log(tab.url());

    })

 
})