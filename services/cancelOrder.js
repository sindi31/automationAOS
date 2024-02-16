import { homepageSelector } from "../constanta/selectorList.js";
import { responseUrl } from "../utils/baseService.js";
import login from "./authentication.js";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();
import cancelAdmin from "./admin.js";

const cancelOrder = async (page, orderNumber, payment, orderID, browser) => {
    // console.log('cancelOrder processing')
    let cancelResponse = '';
    if (payment.includes('VA') || payment.includes('Alfa')) {
        //go to transaction list
        const historyTrxNav = await page.waitForXPath(homepageSelector.transactionMenu, { visible: true });
        await historyTrxNav.click();
        // await page.waitForTimeout(2000);

        let newXPath = "//b[normalize-space()='".concat(orderNumber, "']")
        const goToDetailOrder = await page.waitForXPath(newXPath, { visible: true });
        await goToDetailOrder.click();
        await page.waitForTimeout(2000);

        const cancelButton = await page.waitForXPath("//button[normalize-space()='Batalkan Pesanan']");
        await cancelButton.click();
        await page.waitForTimeout(2000);

        const cancelConfirm = await page.waitForXPath("//button[normalize-space()='Ya']");
        await cancelConfirm.click();
        cancelResponse = await responseUrl(page, 'cancel');
        await page.waitForTimeout(5000);
    } else if (payment.includes('Credit')) {
        // console.log(page.url())
        // await page.goto("https://astraotoshop.com/checkout/credit-card");
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        // await page.waitForTimeout(1000);
        const cancelCCButton = await page.waitForSelector(".sc-rq82e3-0.bYIQff");
        await cancelCCButton.click();
        cancelResponse = await responseUrl(page, 'cancel');
        await page.waitForTimeout(2000);
    } else if (payment.includes('GOPAY')) {
        cancelResponse = await cancelAdmin(orderID, orderNumber, browser);
        // await browser.close();
    }
    return cancelResponse
}

export default cancelOrder;