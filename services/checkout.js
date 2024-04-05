import { responseUrl } from "../utils/baseService.js";
import { cartPage } from "../constanta/selectorList.js";
import { checkoutPage, orderPage } from "../constanta/selectorList.js";
import puppeteer from "puppeteer";


const chooseShipment = async (page) => {
    await page.waitForTimeout(4000);
    const listShippingMethod = await page.waitForXPath(checkoutPage.shippingMethodButton, { visible: true });
    await listShippingMethod.click();
    await page.waitForTimeout(4000);

    let isShipment = await page.$eval(checkoutPage.toggleShipment, () => true).catch(() => false);

    while (isShipment == false) {
        const backToCheckout = await page.waitForXPath("//*[name()='path' and contains(@d,'M8.92711 0')]", { visible: true });
        await backToCheckout.click();
        await page.waitForTimeout(1000);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        const listShippingMethod = await page.waitForXPath(checkoutPage.shippingMethodButton, { visible: true });
        await listShippingMethod.click();
        await page.waitForTimeout(4000);
        isShipment = await page.$eval(checkoutPage.toggleShipment, () => true).catch(() => false);
        console.log(isShipment);
    }

    await page.click(checkoutPage.toggleShipment);
    const selectedShipment = await page.waitForXPath(checkoutPage.firstShipment, { visible: true });
    await selectedShipment.click();
    const useButton = await page.waitForXPath(checkoutPage.useShipmentButton);
    await useButton.click();
}
const choosePayment = async (page, paymentMethod, typeOfProduct) => {
    await page.keyboard.press("PageDown");
    await page.waitForSelector(".sc-1crxk01-0.uSUpG.sc-dfsrp1-9.ieiNxl", { visible: true });
    await page.waitForTimeout(2000)

    if (typeOfProduct === 'Suku Cadang') {
        const listPayment = await page.waitForXPath(checkoutPage.cadangPaymentButton);
        await listPayment.click();

    } else {
        const listPayment = await page.waitForXPath(checkoutPage.paymentMethodButton, { visible: true });
        await page.waitForTimeout(1000);
        // const listPayment = (await page.$x("//span[@class='sc-w647qe-0 UeRhO']"))[0];
        await listPayment.click();

    }
    await page.waitForTimeout(2000);
    let selectPaymentMethod = "";
    if (paymentMethod === "Mandiri VA") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='Mandiri VA']", { visible: true });
    } else if (paymentMethod === "BRI VA") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='BRI VA']", { visible: true });
    } else if (paymentMethod === "BCA VA") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='BCA VA']", { visible: true });
    } else if (paymentMethod === "Permata VA") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='Permata VA']", { visible: true });
    } else if (paymentMethod === "Danamon VA") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='Danamon VA']", { visible: true });
    } else if (paymentMethod === "CIMB VA") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='CIMB VA']", { visible: true });
    } else if (paymentMethod === "BSI VA") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='BSI VA']", { visible: true });
    } else if (paymentMethod === "VA Bank Lainnya") {
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='VA Bank Lainnya']", { visible: true });
    } else if (paymentMethod === "Credit Card") {
        await page.keyboard.press("PageDown");
        await page.waitForTimeout(1000)
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='Credit Card']", { visible: true });
    } else if (paymentMethod === "AstraPay") {
        await page.keyboard.press("PageDown");
        await page.waitForTimeout(1000);
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='AstraPay']", { visible: true });
    } else if (paymentMethod.includes('GOPAY')) {
        await page.keyboard.press("PageDown");
        await page.waitForTimeout(1000)
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='GOPAY/QRIS']", { visible: true });
    } else {
        await page.keyboard.press("PageDown");
        await page.waitForTimeout(500);
        selectPaymentMethod = await page.waitForXPath("//span[normalize-space()='Alfamart']", { visible: true });
    }
    await selectPaymentMethod.click();
    page.waitForTimeout(3000);

    //klik Gunakan
    const usePaymentMethod = await page.waitForXPath(checkoutPage.useButton, { visible: true, timeout: 1000 });
    await Promise.all([
        usePaymentMethod.click(),
        page.waitForNavigation()
    ])
    await page.waitForTimeout(1000);
};

const bayarSekarang = async (page, paymentName, browser) => {
    let orderDetailRes = "";
    const usePaymentMethod = await page.waitForSelector(checkoutPage.paymentNowButton, { visible: true });
    // await Promise.all([usePaymentMethod.click(), page.waitForNavigation()]);
    await usePaymentMethod.click();
    let paymentResp = ""
    paymentResp = await responseUrl(page, 'payment');

    if (paymentResp.status !== 500) {
        if (paymentName.includes("VA") || paymentName.includes("Alfa")) {
            console.log('here Alfa')
            await page.waitForTimeout(5000);
            await page.waitForSelector(orderPage.orderCreatedMsg);
            const message = await page.$eval(orderPage.orderCreatedMsg, el => el.textContent);
            console.log('coba1');
            if (message == 'Hore pesanan telah dibuat! Yuk bayar pesananmu sekarang!') {
                await page.click(orderPage.detailOrder);
                console.log('test di sini')
                let url = await page.url();
                console.log(url)
                let tempReqURL = await url.replace("https://astraotoshop.com/order-detail/", "https://api.astraotoshop.com/v1/order-service/public/orders/");
                let reqURL = "";
                reqURL = await tempReqURL.replace("?category=spare-part&paymentType=VA", "").replace("?category=service-center&paymentType=VA", "").replace("?category=home-service&paymentType=VA", "").replace("?category=spare-part&paymentType=O2O", "").replace("?category=service-center&paymentType=O2O", "");
                orderDetailRes = await responseUrl(page, reqURL);
                await page.waitForTimeout(3000);
                console.log('coba2');

            }
        } else if (paymentName.includes("Credit")) {
            await page.waitForTimeout(3000);
            // const url = await pages.evaluate(() => window.location.href); 
            const pagee = await browser.newPage();
            await pagee.goto("https://astraotoshop.com/order-history-list");
            let newXPath = "//div[@class='sc-1crxk01-0 iCxTTv']//div[1]//div[1]//div[1]//div[1]//span[1]"
            const goToDetailOrder = await pagee.waitForXPath(newXPath, { visible: true });
            await goToDetailOrder.click();
            let url = await pagee.url();
            let tempReqURL = await url.replace("https://astraotoshop.com/order-detail/", "https://api.astraotoshop.com/v1/order-service/public/orders/");
            let reqURL = ""
            reqURL = await tempReqURL.replace("?type=pending&category=spare-part&status=Semua%20transaksi", "").replace("?type=pending&category=service-center&status=Semua%20transaksi", "");
            orderDetailRes = await responseUrl(pagee, reqURL);
            await pagee.waitForTimeout(1000);
            await pagee.close();
        } else if (paymentName.includes("GOPAY")) {
            await page.waitForTimeout(3000);
            const backToMerchant = await page.waitForXPath("//button[@type='button']", { visible: true });
            await backToMerchant.click();
            await page.waitForTimeout(2000);
            const message = await page.$eval(orderPage.orderCreatedMsg, el => el.textContent);
            if (message == 'Hore pesanan telah dibuat! Yuk bayar pesananmu sekarang!') {
                await page.click(orderPage.detailOrder);
                let url = await page.url();
                let tempReqURL = await url.replace("https://astraotoshop.com/order-detail/", "https://api.astraotoshop.com/v1/order-service/public/orders/");
                let reqURL = "";
                reqURL = await tempReqURL.replace("?category=null&paymentType=GOPAY", "").replace("?category=service-center&paymentType=GOPAY", "");
                orderDetailRes = await responseUrl(page, reqURL);
                await page.waitForTimeout(3000);
            }
        }
    } else {
        orderDetailRes = paymentResp
        console.log('here error >>', orderDetailRes)
    }

    return orderDetailRes;

};


const checkout = async (page, paymentName, productType, browser) => {

    const clickCheckout = await page.waitForSelector(cartPage.checkoutButton, { visible: true });
    await clickCheckout.click();
    await page.waitForTimeout(4000);

    // console.log(productType);
    if (productType === 'Suku Cadang') {
        await chooseShipment(page);
        await page.waitForTimeout(3000);
    }
    await choosePayment(page, paymentName, productType);
    await page.waitForTimeout(3000);

    const result = await bayarSekarang(page, paymentName, browser);

    return result;

};

export default checkout;