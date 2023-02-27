import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testMatch: ["tests/CASHE/18.test.ts"],
  use: {
    headless: false,
    screenshot: "on",
    video: "on",
    launchOptions: {
      slowMo: 100,
    }
  },
  reporter: [["dot"], ["json", {
    outputFile: "jsonReports/jsonReport.json"
  }], ["html", {
    open: "always"
  }]]
}

export default config
