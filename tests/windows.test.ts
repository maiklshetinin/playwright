import { expect, test, Page } from "@playwright/test"
// let facebookPage: Page;
test("Interact with multiple tabs", async ({ page }) => {
   
    await page.goto("https://www.lambdatest.com/selenium-playground/window-popup-modal-demo")

    const [multipage] = await Promise.all([
        page.waitForEvent("popup"),
        page.click("#followboth")
    ])

    await page.waitForLoadState()

    const pages = multipage.context().pages()
    console.log('No.of tabs' + pages.length);

    pages.forEach(tab => {
        console.log(tab.url());

    })

    // await pages[1].fill("","kous")

    let facebookPage: Page;
    for (let index = 0; index < pages.length; index++) {
        const url = pages[index].url()
        if (url === "https://www.facebook.com/lambdatest/") {
            facebookPage = pages[index]
        }
    }
    // const text = await facebookPage.textContent("//h1")
    // console.log(text);
    



    // const [newWindow] = await Promise.all([
    //     page.waitForEvent("popup"),
    //     page.click("'Follow On Twitter'")
    // ])

    // console.log(newWindow.url());
    // // newWindow.fill("", "")

})