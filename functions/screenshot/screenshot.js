const playwright = require("playwright-aws-lambda");

exports.handler = async (event, context) => {
  // const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

  // if (!pageToScreenshot)
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({ message: "Page URL not defined" }),
  //   };
  const pageToScreenshot = "https://store.epicgames.com/en-US/";

  browser = await playwright.launchChromium();
  const browserContext = await browser.newContext();
  const page = await browserContext.newPage();

  await page.goto(pageToScreenshot, {
    waitUntil: "networkidle",
    timeout: 60 * 1000,
  });

  const block = await page
    .locator("h2", { hasText: "Free Games" })
    .locator("..")
    .locator("..");
  await block.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  const buffer = await block.screenshot({ path: "screenshots/screenshot.png" });

  await browser.close();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/png",
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  };
};

// Comment before commit
// exports.handler();
