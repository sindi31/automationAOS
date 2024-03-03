import { responseUrl } from "../utils/baseService.js";
import { cartPage } from "../constanta/selectorList.js";
import decryptProcess from "../utils/decrypt.js";

const checklistProduct = async (page) => {
    await page.waitForTimeout(2000);
    const iconCart = await page.waitForXPath(cartPage.cartIcon, { visible: true });

    await Promise.all([
        iconCart.click(),
        page.waitForNavigation()
    ])
    await page.waitForTimeout(2000);

    const checklistAll = await page.waitForSelector(cartPage.checklistAll, { visible: true });
    await checklistAll.click();

    return 'Checklist Product Cart >>> success'
}

const usePoint = async (page, Point) => {
    if (Point === 'Gunakan Semua') {
        await page.waitForTimeout(2000);
        await page.click(cartPage.gunakanSemua, {waitUntil: 'domcontentloaded'});
    } else {
        const inputPoin = await page.waitForSelector(cartPage.pointField, { visible: true });
        await inputPoin.type(Point);
        await page.click(cartPage.usePointButton, { waitUntil: 'domcontentloaded' });
    }

    let usePoinResponse = await responseUrl(page, 'summary');
    let summaryDecrypted = await decryptProcess(usePoinResponse.data.iv, usePoinResponse.data.encryptedData, "summary");
    return summaryDecrypted;
}

const useCoupon = async (page, couponName) => {
    let useCouponResp = "";
    let response = "";

    // const inputCoupon = await page.waitForXPath(cartPage.couponField, { visible: true });
    await page.keyboard.press("PageDown");
    const inputCoupon = await page.waitForSelector(cartPage.couponField,{visible:true});
    await page.waitForTimeout(3000);
    await inputCoupon.type(couponName);    
   
    await page.waitForTimeout(3000);
    // const gunakanButton = (await page.$x("//span[@class='sc-w647qe-0 iggsXM']"))[1];
    const gunakanButton = await page.waitForXPath("/html[1]/body[1]/main[1]/div[1]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/div[2]/div[1]/span[1]");

    // const gunakanButton = await page.waitForSelector(cartPage.useCouponButton,{visible:true});
    await page.waitForTimeout(2000);
    await gunakanButton.click();

    const baseURL = 'list?code=';
    let reqURL = baseURL.concat(couponName);
    let msgUseCoupon = await responseUrl(page, reqURL);

    if (msgUseCoupon.data?.length === 0) {
        useCouponResp = '{"resUseCoupon":[{"errorCondition":"Kupon Diskon tidak tersedia atau kupon sudah tidak berlaku"}],"discountDetail":[]}';
    } else {
        let useCouponSummary = await responseUrl(page, 'summary');
        useCouponResp = await decryptProcess(useCouponSummary.data.iv, useCouponSummary.data.encryptedData, "summary")
    }
    let repUseCouponResponse = JSON.parse(useCouponResp.replace(/(\w+):/g, `"$1":`));

    if (repUseCouponResponse.resUseCoupon.length == 0) {
        response = [{
            status: 200
        }, repUseCouponResponse]
    } else {
        response = [{
            status: 500
        }, repUseCouponResponse]
    }
    return response;
}

export { checklistProduct, usePoint, useCoupon };