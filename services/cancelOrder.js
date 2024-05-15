import { homepageSelector, orderPage } from "../constanta/selectorList.js";
import { responseUrl, timeCalc } from "../utils/baseService.js";
import { login } from "./authentication.js";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();
import cancelAdmin from "./admin.js";

const cancelOrder = async (page, orderNumber, payment, orderID, browser) => {
    // console.log('cancelOrder processing')
    let cancelResponse = '';
    let start = performance.now();

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

    let end = performance.now();
    let duration = await timeCalc(end, start);

    return {
        result: cancelResponse,
        duration: duration
    }
}

const newCancelOrder = async (page) => {
    let cancelResponse = '';

    await page.waitForTimeout(1000);
    let start = performance.now();
    await page.click(orderPage.detailOrder);
    // let url = await page.url();
    // // console.log(url)
    // let tempReqURL = await url.replace("https://astraotoshop.com/order-detail/", "https://api.astraotoshop.com/v1/order-service/public/orders/");
    // let reqURL = "";
    // reqURL = await tempReqURL.replace("?category=spare-part&paymentType=VA", "").replace("?category=service-center&paymentType=VA", "").replace("?category=home-service&paymentType=VA", "").replace("?category=spare-part&paymentType=O2O", "").replace("?category=service-center&paymentType=O2O", "");
    // let orderDetailRes = await responseUrl(page, reqURL);
    // await page.waitForTimeout(3000);
    // // console.log('cancelOrder processing')

    const cancelButton = await page.waitForXPath("//button[normalize-space()='Batalkan Pesanan']");
    await cancelButton.click();
    await page.waitForTimeout(2000);

    const cancelConfirm = await page.waitForXPath("//button[normalize-space()='Ya']");
    await cancelConfirm.click();
    cancelResponse = await responseUrl(page, 'cancel');
    await page.waitForTimeout(2000);


    let end = performance.now();
    let duration = await timeCalc(end, start);

    return {
        result: cancelResponse,
        duration: duration
    }
}

export { cancelOrder, newCancelOrder};