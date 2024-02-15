import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pathToExtension = path.join(__dirname, '2captcha-solver');
    
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
        executablePath: executablePath()
    });

    const [page] = await browser.pages()
    // Opening a page
    await page.goto('https://2captcha.com/demo/recaptcha-v2')

    // Waiting for the element with the CSS selector ".captcha-solver" to be available
    await page.waitForSelector('.captcha-solver')
    // Click on the element with the specified selector
    await page.click('.captcha-solver')

    await page.waitForSelector(`.captcha-solver[data-state="solved"]`,{timeout:180000});
    await page.click("button[type='submit']");
})();