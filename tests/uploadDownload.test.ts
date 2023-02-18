import { test } from "@playwright/test"

test("Download files", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/generate-file-to-download-demo")
    await page.type("#textbox", "Like, Share, comment") //посимвольный ввод
    await page.click("#create")
    const download = await Promise.all([
        page.waitForEvent("download"),
        page.click("#link-to-download")
    ])

    const fileName = download[0].suggestedFilename()
    download[0].saveAs(fileName)

    // const path = await download[0].path()
    // console.log(path);


    await page.waitForTimeout(10000)
})