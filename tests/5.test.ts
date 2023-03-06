import { test, expect } from "@playwright/test";
import OIB, { LOGIN, PASSWORD, UserMenu } from "./OIB";

test("Руководство пользователя. (test 5)", async ({ page }) => {
    const OIB_Page = new OIB(page)
    await OIB_Page.login(LOGIN, PASSWORD)

    //----------------------------------------------------------------------------------------test1
    //1. Кликнуть на изображение пользователя.
    await OIB_Page.click(UserMenu.BTN_USER_MENU)
    await OIB_Page.click(UserMenu.manual)
    // await page.waitForLoadState("networkidle")
    //Руководство пользователя открывается во всплывающем окне, формата PDF, с элементами управления режимами отображения / просмотра руководства.
    //Версия Руководства является актуальной.
    await page.waitForTimeout(1000)
    await page.locator("//span[text()='×']").highlight()
    await expect(page.locator("//span[text()='×']")).toBeVisible()
    await page.click("//span[text()='×']")
    //закрытие сессии
    await OIB_Page.shutDown()
})