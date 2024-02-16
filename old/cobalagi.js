import report from "puppeteer-report";
import puppeteer from 'puppeteer';
import dotenv from "dotenv";
dotenv.config();
import login from "../services/authentication.js";
import { cartPage, homepageSelector, locationSelector, headerPageSelector } from "../constanta/selectorList.js";
import { checkPointHomepage, customerDashboard } from "../services/account.js";
import { getProductDetail, addtoCart, getProductAfterProcess } from "../services/product.js";
import { checklistProduct, usePoint, useCoupon } from "../services/cart.js";
import checkout from "../services/checkout.js";
import { responseUrl } from "../utils/baseService.js";
import cancelOrder from "../services/cancelOrder.js";
import data from "../constanta/inputData.js";

(async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    const pages = await browser.pages();
    if (pages.length > 1) {
        await pages[0].close();
    }
    const baseURL = 'https://api.astraotoshop.com/v1/marketing-service/coupon-discount/list?code=TESTING132';
    let reqURL = baseURL;
    console.log(reqURL)
    let msgUseCoupon = await responseUrl(page, reqURL);
    console.log(msgUseCoupon);
})();