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

const usePoint = async (page, Point, productPrice, qty) => {
    let minUsePoinEval = await page.$eval(".sc-w647qe-0.BAMAs", el => el.textContent);
    let minUsePoin = minUsePoinEval.replace('Minimum Pembelian Rp', '').replace(' ', '').replace('.', '');
    let usePointResponse = '';
    let usePointStatus = '';

    if ((Point > 0 || Point === 'Gunakan Semua') && (productPrice * qty) < minUsePoin) {
        usePointResponse = {
            status: 500,
            usePointStatus: false,
            message: 'Tidak memenuhi syarat, minimal pembelanjaan ' + minUsePoin
        }
    } else if ((Point > 0 || Point === 'Gunakan Semua') && (productPrice * qty) >= minUsePoin) {
        if (Point === 'Gunakan Semua') {
            await page.waitForTimeout(2000);
            await page.click(cartPage.gunakanSemua, { waitUntil: 'domcontentloaded' });
        } else {
            const inputPoin = await page.waitForSelector(cartPage.pointField, { visible: true });
            await inputPoin.type(Point);
            await page.click(cartPage.usePointButton, { waitUntil: 'domcontentloaded' });
        }
        let usePointResponseRaw = await responseUrl(page, 'summary');
        let decryptPointResponse = await decryptProcess(usePointResponseRaw.data.iv, usePointResponseRaw.data.encryptedData, "summary");
        let replacePointResp = decryptPointResponse.replace(/(\w+):/g, `"$1":`);
        let jsonPointResp = JSON.parse(replacePointResp);

        if (usePointResponseRaw.status === 200) {
            usePointStatus = true
        } else {
            usePointStatus = false
        }

        usePointResponse = {
            status: usePointResponseRaw.status,
            message: usePointResponseRaw.message,
            usePointStatus: usePointStatus,
            data: jsonPointResp
        }

    } else {
        usePointResponse = {
            status: 404,
            usePointStatus: '',
            message: 'Tidak Menggunakan Poin'
        }
    }

    // console.log('pointResponse',usePointResponse)

    // if (Point === 'Gunakan Semua') {
    //     await page.waitForTimeout(2000);
    //     await page.click(cartPage.gunakanSemua, { waitUntil: 'domcontentloaded' });
    // } else {
    //     const inputPoin = await page.waitForSelector(cartPage.pointField, { visible: true });
    //     await inputPoin.type(Point);
    //     await page.click(cartPage.usePointButton, { waitUntil: 'domcontentloaded' });
    // }
    return usePointResponse;
}

const useCoupon = async (page, couponName) => {
    let useCouponResp = "";
    let response = "";

    // const inputCoupon = await page.waitForXPath(cartPage.couponField, { visible: true });
    await page.keyboard.press("PageDown");
    const inputCoupon = await page.waitForSelector(cartPage.couponField);
    await page.waitForTimeout(2000);
    await inputCoupon.type(couponName);

    await page.waitForTimeout(2000);
    // const gunakanButton = (await page.$x("//span[@class='sc-w647qe-0 iggsXM']"))[1];
    const gunakanButton = await page.waitForXPath("/html[1]/body[1]/main[1]/div[1]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/div[2]/div[1]/span[1]");

    // const gunakanButton = await page.waitForSelector(cartPage.useCouponButton,{visible:true});
    await page.waitForTimeout(1000);
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