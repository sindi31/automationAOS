import puppeteer from "puppeteer-extra";
import { responseUrl } from "../utils/baseService.js";
import solveCaptcha from "../utils/captcha.js";

const cancelAdmin = async (orderID, orderNumber) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    const pages = await browser.pages();
    if (pages.length > 1) {
        await pages[0].close();
    }
    await page.goto('https://admin.astraotoshop.com/', { waitUntil: 'load' })
    await page.waitForTimeout(5000)

    const username = await page.waitForXPath("//input[@id='basic_email']");
    await username.type("it@aop.com");

    const password = await page.waitForXPath("//input[@id='basic_password']");
    await password.type("A4OPB2c!!");
    await page.waitForTimeout(1000);

    // That's it, a single line of code to solve reCAPTCHAs 🎉
    await solveCaptcha(page);
    // await page.waitForTimeout(5000);

    const loginButton = await page.waitForXPath("//button[@type='submit']", { visible: true });

    await loginButton.click();
    // await page.waitForTimeout(1000);

    await loginButton.click();
    await page.waitForTimeout(3000);

    await page.goto('https://admin.astraotoshop.com/sales/order/detail/' + orderID);
    await page.waitForTimeout(2000);


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

    const recheckNumber = await page.$eval(".ant-typography.gx-m-0", el => el.textContent);
    console.log('crosscheck >>>' + recheckNumber.replace('#', ''));
    // await page.waitForTimeout(2000);

    let cancelResponse = "";
    if (recheckNumber.replace('#', '') === orderNumber) {

        let statusOrder = await page.$eval("div:nth-child(1) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(4) span:nth-child(1)", el => el.textContent);
        // console.log('status order1: ' + statusOrder);

        while (statusOrder === 'Pending Payment') {
            try {
                const tindakan = await page.waitForXPath("//span[normalize-space()='Tindakan Lain']");
                await tindakan.click()
                // console.log('tindakan')

                await page.waitForTimeout(1000);
                const batal = await page.waitForXPath("//span[normalize-space()='Batal']");
                await batal.click()

                await page.waitForTimeout(1000);
                const confirm = await page.waitForXPath("//span[normalize-space()='Ya, Batalkan Pesanan']");
                await confirm.click();

                cancelResponse = await responseUrl(page, 'cancel');
                
                console.log(cancelResponse)
                await page.waitForTimeout(2000);

                const status = await page.waitForXPath("//span[normalize-space()='Canceled']", { visible: true });
                const textStatus = await page.evaluate(el => {
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

    await browser.close()
    return cancelResponse

};

export default cancelAdmin;