import report from "puppeteer-report";
import puppeteer from 'puppeteer';
import dotenv from "dotenv";
dotenv.config();
import login from "./services/authentication.js";
import { cartPage, homepageSelector, locationSelector, headerPageSelector } from "./constanta/selectorList.js";
import { checkPointHomepage, customerDashboard } from "./services/account.js";
import { getProductDetail, addtoCart, getProductAfterProcess } from "./services/product.js";
import { checklistProduct, usePoint, useCoupon } from "./services/cart.js";
import checkout from "./services/checkout.js";
import { responseUrl } from "./utils/baseService.js";
import cancelOrder from "./services/cancelOrder.js";
import data from "./constanta/inputData.js";

(async function main() {
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

    await page.goto(process.env.URL);

    let [loginStatus, getProductCardStatus, addToCartStatus, checklistProductCart, usePointStatus, useCouponStatus, orderStatus] = ["", "", "", "", "", "", ""];
    let [initPoint, getProductResponse, addToCartResponse, checklistProductCartResponse, usePointResponse, useCouponResponse, orderResponse, detailProductAfterOrderResp, poinCustAfterOrderResp] =
        ["", "", "", "", "", "", "", "", ""];

    const product = ['Suku Cadang', 'Layanan Bengkel', 'Homeservice'];
    const productType = product[1];
    await page.setGeolocation({latitude: 59.95, longitude: 30.31667}); 


    const loginResp = await login(page, process.env.email, process.env.password);
    // console.log('Login >>>', loginResp);

    if (loginResp.status === 200) {
        loginStatus = true;

        const getLocationIcon = await page.$(homepageSelector.getLocIcon);
        await Promise.all([
            getLocationIcon.click(),
            page.waitForNavigation({ waitUntil: "networkidle2" })
        ])

        

        const useCurrentLoc = await page.waitForXPath("//button[normalize-space()='Gunakan lokasi saya saat ini']");
        await useCurrentLoc.click();
        // Grant geolocation permission
         await page.evaluate(() => {
            navigator.geolocation.getCurrentPosition = (successCallback, errorCallback, options) => {
               successCallback({ coords: { latitude: 51.1, longitude: -0.1 } }); // Grant permission
            };
         });
        
        await page.waitForTimeout(5000);
        await useCurrentLoc.click();
        const localStoragee = await page.evaluate(() => Object.assign({}, window.localStorage));
        console.log(localStoragee);
        await page.waitForTimeout(20000)

    }
    //get location end

    // await browser.close();
})();