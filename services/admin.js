import puppeteer from "puppeteer-extra";
import { responseUrl } from "../utils/baseService.js";
import solveCaptcha from "../utils/captcha.js";
import config from "../constanta/config.js";
import { adminSelector } from "../constanta/selectorList.js";

const cancelAdmin = async (orderID, orderNumber, browser) => {
    // const browser = await puppeteer.launch({
    //     headless: false,
    //     defaultViewport: false,
    //     args: ['--start-maximized']
    // });
    const page2 = await browser.newPage();
    // const pages = await browser.pages();
    // if (pages.length > 1) {
    //     await pages[0].close();
    // }
    await page2.goto(config.URL_ADMIN, { waitUntil: "networkidle2" })
    // await page2.waitForTimeout(5000)

    let isEmail = await page2.$eval("div[class='gx-d-flex gx-flex-column gx-align-items-center gx-mb-3'] h1", () => true).catch(() => false);
    if (isEmail == true) {
        const username = await page2.waitForXPath(adminSelector.fieldEmail);
        await username.type(config.ADMIN_EMAIL);

        const password = await page2.waitForXPath(adminSelector.fieldPassword);
        await password.type(config.ADMIN_PASS);
        await page2.waitForTimeout(1000);

        // That's it, a single line of code to solve reCAPTCHAs 🎉
        await solveCaptcha(page2);
        // await page2.waitForTimeout(8000);

        const loginButton = await page2.waitForXPath(adminSelector.loginButton, { visible: true });

        await loginButton.click();
        // await page.waitForTimeout(1000);

        await loginButton.click();
    }

    await page2.waitForTimeout(3000);

    await page2.goto(config.ADMIN_ORDER_DETAIL_BASE + orderID);
    await page2.waitForTimeout(2000);


    // // go to sales
    // const menuSales = await page.waitForXPath("//span[normalize-space()='Sales']");
    // await menuSales.click();

    // const subMenuOrder = await page.waitForXPath("//a[normalize-space()='Orders']");
    // await subMenuOrder.click();

    // const filter = await page.waitForXPath("//span[normalize-space()='Filter']");
    // await filter.click();

    // const fieldOrderNumer = await page.waitForXPath("//input[@id='filter_order_number']");
    // await fieldOrderNumer.type('2240700098');


    // const terapkanButton = await page.waitForXPath("//button[@class='ant-btn ant-btn-primary']//span[contains(text(),'Terapkan')]");
    // await terapkanButton.click();
    // await page.waitForTimeout(3000);

    // const cekOrderNumber = await page.$eval("td:nth-child(2)", el => el.textContent);
    // console.log(cekOrderNumber)

    // if (cekOrderNumber === '2240700098') {
    //     const lihatButton = await page.waitForXPath("//span[normalize-space()='lihat']", { visible: true })
    //     await lihatButton.click();
    //     await page.waitForTimeout(3000);

    let isOrderNum = await page2.$eval(adminSelector.fieldOrderNumber, () => true).catch(() => false);
    while (isOrderNum == false) {
        await page2.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        isOrderNum = await page2.$eval(adminSelector.fieldOrderNumber, () => true).catch(() => false);
    }

    const recheckNumber = await page2.$eval(adminSelector.fieldOrderNumber, el => el.textContent);
    console.log('crosscheck >>>' + recheckNumber.replace('#', ''));
    // await page.waitForTimeout(2000);

    let cancelResponse = "";
    if (recheckNumber.replace('#', '') === orderNumber) {

        let statusOrder = await page2.$eval("div:nth-child(1) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(4) span:nth-child(1)", el => el.textContent);
        // console.log('status order1: ' + statusOrder);

        while (statusOrder === 'Pending Payment') {
            try {
                const tindakan = await page2.waitForXPath(adminSelector.tindakanDropdown);
                await tindakan.click()
                // console.log('tindakan')

                await page2.waitForTimeout(1000);
                const batal = await page2.waitForXPath(adminSelector.cancelButton);
                await batal.click()

                await page2.waitForTimeout(1000);
                const confirm = await page2.waitForXPath(adminSelector.confirmButton);
                await confirm.click();

                cancelResponse = await responseUrl(page2, 'cancel');

                console.log(cancelResponse)
                await page2.waitForTimeout(2000);

                const status = await page2.waitForXPath("//span[normalize-space()='Canceled']", { visible: true });
                const textStatus = await page2.evaluate(el => {
                    return el.textContent;
                }, status);
                statusOrder = textStatus;

                // console.log(statusOrder);

            } catch (error) {
                // await page.waitForTimeout(2000);
                console.log('error >>>' + error)
            }
        }
         statusOrder
    }
    // }


    await page2.close()
    return cancelResponse

};

export default cancelAdmin;