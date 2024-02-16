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

    const inputPoin = await page.waitForSelector(cartPage.pointField, { visible: true });
    await inputPoin.type(Point);
    await page.click(cartPage.usePointButton, { waitUntil: 'domcontentloaded' });

    let usePoinResponse = await responseUrl(page, 'summary');
    let summaryDecrypted = await decryptProcess(usePoinResponse.data.iv, usePoinResponse.data.encryptedData, "summary")
    return summaryDecrypted;
}

const useCoupon = async (page, couponName) => {
    console.log('here4')
    let useCouponResp = "";
    let response = "";

    const inputCoupon = await page.waitForXPath(cartPage.couponField, { visible: true });
    await inputCoupon.type(couponName);

    // const gunakanButton = (await page.$x("//span[@class='sc-w647qe-0 iggsXM']",{visible:true}))[1];
    const gunakanButton = await page.waitForXPath("/html[1]/body[1]/main[1]/div[1]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/div[2]/div[1]/span[1]");
    await page.waitForTimeout(1000);
    await gunakanButton.click();

    const baseURL = 'list?code=';
    let reqURL = baseURL.concat(couponName);
    console.log(reqURL);
    let msgUseCoupon = await responseUrl(page, reqURL);
    // console.log(msgUseCoupon);


    if (msgUseCoupon.data?.length === 0) {
        useCouponResp = '{"resUseCoupon":[{"errorCondition":"Kupon Diskon tidak tersedia atau kupon sudah tidak berlaku"}],"discountDetail":[]}';
    } else {
        let useCouponSummary = await responseUrl(page, 'summary');
        useCouponResp = await decryptProcess(useCouponSummary.data.iv, useCouponSummary.data.encryptedData, "summary")
    }
    console.log(useCouponResp);
    let repUseCouponResponse = JSON.parse(useCouponResp.replace(/(\w+):/g, `"$1":`));

    console.log(repUseCouponResponse.resUseCoupon.length)
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