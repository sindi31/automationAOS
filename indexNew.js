import puppeteer from "puppeteer";
// import puppeteer from "puppeteer-extra";
import dotenv from "dotenv";
dotenv.config();
import { login, getPersonalData } from "./services/authentication.js";
import { cartPage, homepageSelector, locationSelector, headerPageSelector, orderPage } from "./constanta/selectorList.js";
import { checkPointHomepage, customerDashboard } from "./services/account.js";
import { getProductDetail, addtoCart, getProductAfterProcess, newGetProductAfterProcess, newGetPDP } from "./services/product.js";
import { checklistProduct, usePoint, useCoupon } from "./services/cart.js";
import checkout from "./services/checkout.js";
import { responseUrl, cleansingCart, getLocation, getCurrentLocation, dateDifference } from "./utils/baseService.js";
import { cancelOrder, newCancelOrder } from "./services/cancelOrder.js";
import data from "./constanta/inputData.js";
import getBodyHtml from "./testHtml.js";
import { generatePdf, mergePdf } from "./utils/generatePdf.js";
import getBodyHtmlPage2 from "./page2Html.js";
import { closeSync } from "fs";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import config from "./constanta/config.js";
import { sendMail } from "./utils/baseService.js";
// import htmlPage2 from "./html/example.js";
import getHtmlData from "./html/generateHtml.js";



const oneFlowOrderCancel = async (qty, urlKeySukuCadang, urlKeyLayananBengkel, urlKeyHomeservice, paymentWith, pointAmount, couponUsed) => {
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

    let [loginStatus, getProductCardStatus, addToCartStatus, checklistProductCart, usePointStatus, useCouponStatus, orderStatus] = ["", "", "", "", "", "", ""];
    let [location, initPoint, getProductResponse, addToCartResponse, checklistProductCartResponse, usePointResponse, useCouponResponse, orderResponse, detailProductAfterOrderResp, poinCustAfterOrderResp] =
        ["", "", "", "", "", "", "", "", "", ""];
    let custOrderDetail = [];
    let recapStatus = [];
    let duration = [];
    const productType = ['Suku Cadang', 'Layanan Bengkel', 'Homeservice'];
    // const productType = ['Layanan Bengkel'];

    let detailProductAfterOrder = "";
    let cancelStatus = "";
    let detailProductAfterCancelResp = "";
    let poinCustAfterCancelResp = "";
    let startDate = new Date();
    let cleansingResponse = "";
    let cleansingCartStatus = "";
    let getLocationResponse = "";
    let getLocationStatus = "";
    let indexOrder = "";
    let indexCancel = "";
    let getMerchantDetail = '';
    let getDetailProductAfterOrder = '';
    let endDate = "";
    let dateDiff = "";

    await page.goto(config.URL);
    let loginResp = await login(page, config.email, config.password); // login process

    for (let i = 0; i < productType.length; i++) {
        // const recorder = new PuppeteerScreenRecorder(page); // Config is optional
        // const savePath = './document/automation-result-' +productType[i]+ new Date().toJSON().slice(0, 10) + 'T' + new Date().getHours() + new Date().getMinutes() + '.mp4';
        // await recorder.start(savePath);

        if (loginResp.response.status === 200) {
            loginStatus = true;
            console.log('Flow Order & Cancel >> Pembayaran:' + paymentWith + ', point: ' + pointAmount + ', kupon: ' + couponUsed + ', product : ' + productType[i])

            //cleansing Cart start
            cleansingResponse = await cleansingCart(page); // hapus semua produk di keranjang

            if (cleansingResponse.status === 200) {
                cleansingCartStatus = true;
            } else {
                cleansingCartStatus = false;
            }

            // check personal data
            let getPoinCust = await getPersonalData(page, loginResp.response.data.userID, loginResp.response.data.accessToken);
            initPoint = getPoinCust.result.data.point;

            // get location
            if (productType[i] === 'Layanan Bengkel') {
                location = await getCurrentLocation(page,loginResp.response.data.accessToken);
                if (location.getLocationResponse.status === 200) {
                    getLocationStatus = true;
                } else {
                    getLocationStatus = false;
                }
            }

            //go to PDP 
            if (productType[i] === 'Suku Cadang') {
                getProductResponse = await newGetPDP(page, urlKeySukuCadang, loginResp.response.data.accessToken, 'PDP');
            } else if (productType[i] === 'Layanan Bengkel') {
                getProductResponse = await newGetPDP(page, urlKeyLayananBengkel, loginResp.response.data.accessToken, 'PDP');
            } else {
                getProductResponse = await newGetPDP(page, urlKeyHomeservice, loginResp.response.data.accessToken, 'PDP');
            }

            if (getProductResponse.result.status === 200) {
                getProductCardStatus = true;

                // add to cart start
                if (productType[i] === 'Suku Cadang') {
                    addToCartResponse = await addtoCart(page, qty, productType[i]);
                } else if (productType[i] === 'Layanan Bengkel') {
                    addToCartResponse = await addtoCart(page, qty, productType[i], config.isBookingDate, location.latitude, location.longitude, getProductResponse.result.data.id);
                } else {
                    addToCartResponse = await addtoCart(page, qty, productType[i], config.isBookingDate);
                }


                if (addToCartResponse.result.status === 200) {
                    addToCartStatus = true;

                    checklistProductCartResponse = await checklistProduct(page); // checklist all product within productType

                    // apply point in cart 
                    usePointResponse = await usePoint(page, pointAmount, getProductResponse.result.data.price, qty);
                    usePointStatus = usePointResponse.usePointStatus;

                    // apply coupon in cart
                    if (couponUsed != "") {
                        let useCouponResp = await useCoupon(page, couponUsed);
                        useCouponResponse = useCouponResp;
                        if (useCouponResponse[0].status === 200) {
                            useCouponStatus = true;
                        } else {
                            useCouponStatus = false;
                        }

                    } else {
                        useCouponResponse = 'Tidak menggunakan kupon';
                    }

                    // proses checkout - order
                    orderResponse = await checkout(page, paymentWith, productType[i], browser, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken); // proses order di halaman checkout

                    if (orderResponse.result.paymentResp.status === 200) {
                        orderStatus = true;

                        if (paymentWith.includes("VA") || paymentWith.includes("Alfa")) {
                            await page.waitForTimeout(1000);
                            await page.waitForSelector(orderPage.orderCreatedMsg);
                            const message = await page.$eval(orderPage.orderCreatedMsg, el => el.textContent);

                            if (message == 'Hore pesanan telah dibuat! Yuk bayar pesananmu sekarang!') {
                                getDetailProductAfterOrder = await newGetPDP(page, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken);

                                if (productType[i] === 'Layanan Bengkel') {
                                    let merchantResp = await fetch("https://api.astraotoshop.com/v1/product-service/merchant?lat=" + location.latitude + "&long=" + location.longitude + "&productID=" + getProductResponse.result.data.id, {
                                        "headers": {
                                            "accept": "application/json",
                                            "accept-language": "undefined",
                                            "authorization": "Bearer " + loginResp.response.data.accessToken,
                                            "content-type": "application/json",
                                            "sec-ch-ua": "\"Opera\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                                            "sec-ch-ua-mobile": "?0",
                                            "sec-ch-ua-platform": "\"Windows\"",
                                            "sec-fetch-dest": "empty",
                                            "sec-fetch-mode": "cors",
                                            "sec-fetch-site": "same-site"
                                        },
                                        "referrer": "https://astraotoshop.com/",
                                        "referrerPolicy": "strict-origin-when-cross-origin",
                                        "body": null,
                                        "method": "GET",
                                        "mode": "cors",
                                        "credentials": "include"
                                    });
                                    getMerchantDetail = await merchantResp.json();
                                    indexOrder = getMerchantDetail.data.findIndex(x => x.code === addToCartResponse.merchant.data[0].name);
                                }
                            }
                        }
                        poinCustAfterOrderResp = await getPersonalData(page, loginResp.response.data.userID, loginResp.response.data.accessToken);
                        await page.waitForTimeout(2000);
                    } else {
                        orderStatus = false;
                    }
                } else {
                    addToCartStatus = false;
                }
            } else {
                getProductCardStatus = false;
            }
        } else {
            loginStatus = false;
        }

        let getDetailProductAfterCancel = "";
        let getMerchantDetailAfterCancel = "";
        let cancelOrderResp;

        // await recorder.stop();

        if (orderStatus === true) {
            // proses cancel order
            cancelOrderResp = await newCancelOrder(page);

            if (cancelOrderResp.result.status === 200) {
                cancelStatus = true;
            } else {
                cancelStatus = false
            }

            getDetailProductAfterCancel = await newGetPDP(page, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken);

            if (productType[i] === 'Layanan Bengkel') {
                let merchantResp2 = await fetch("https://api.astraotoshop.com/v1/product-service/merchant?lat=" + location.latitude + "&long=" + location.longitude + "&productID=" + getProductResponse.result.data.id, {
                    "headers": {
                        "accept": "application/json",
                        "accept-language": "undefined",
                        "authorization": "Bearer " + loginResp.response.data.accessToken,
                        "content-type": "application/json",
                        "sec-ch-ua": "\"Opera\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site"
                    },
                    "referrer": "https://astraotoshop.com/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                });
                getMerchantDetailAfterCancel = await merchantResp2.json();
                indexCancel = getMerchantDetailAfterCancel.data.findIndex(x => x.code === addToCartResponse.merchant.data[0].name);
            }

            poinCustAfterCancelResp = await getPersonalData(page, loginResp.response.data.userID, loginResp.response.data.accessToken);
            const backToHome = await page.goto(config.URL);
        }

        endDate = new Date();
        dateDiff = await dateDifference(endDate, startDate);

        recapStatus[i] = {
            login: loginStatus,
            cleansingCart: cleansingCartStatus,
            getLocCustomer: getLocationStatus,
            getPDP: getProductCardStatus,
            addCart: addToCartStatus,
            applyPoint: usePointStatus,
            applyCoupon: useCouponStatus,
            order: orderStatus,
            cancel: cancelStatus
        };

        duration[i] = {
            login: loginResp.duration,
            cleansingCart: cleansingResponse.duration,
            getLocCustomer: productType[i] === "Layanan Bengkel" ? location.duration : '',
            getPDP: getProductResponse.duration,
            addCart: addToCartResponse.duration,
            applyPoint: usePointResponse.duration,
            applyCoupon: useCouponResponse[0].duration,
            order: orderResponse.duration,
            cancel: cancelOrderResp.duration ? cancelOrderResp.duration : '0'
        };

        custOrderDetail[i] = {
            location: location,
            productType: productType[i],
            productName: getProductResponse.result.data ? getProductResponse.result.data.name : '',
            productSKU: getProductResponse.result.data ? getProductResponse.result.data.sku : '',
            productMerchant: getProductResponse.result.data ? getProductResponse.result.data.merchantName : '',
            productPrice: getProductResponse.result.data ? getProductResponse.result.data.price : '',
            productOutlet: addToCartResponse.merchant ? addToCartResponse.merchant.data ? addToCartResponse.merchant.data[0].name : 'It is not product service order' : '',

            orderNumber: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.orderNumber ? orderResponse.detailOrder.data.orderNumber : "" : '',
            orderDate: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.orderDate ? new Date(orderResponse.detailOrder.data.orderDate).toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB" : "" : '',
            total: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.total ? orderResponse.detailOrder.data.total : "" : '',
            qty: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.totalQuantity ? orderResponse.detailOrder.data.totalQuantity : '' : '',
            paymentMethod: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.paymentMethod ? orderResponse.detailOrder.data.paymentMethod.paymentMethod : '' : '',
            vaNumber: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.paymentMethod ? orderResponse.detailOrder.data.paymentMethod.vaNumber : '' : '',
            receiverName: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.paymentMethod ? orderResponse.detailOrder.data.receiverName : '' : '',
            receiverPhone: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.paymentMethod ? orderResponse.detailOrder.data.receiverPhone : '' : '',
            address: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.address ? orderResponse.detailOrder.data.address : '' : '',
            courier: orderResponse.detailOrder.data ? orderResponse.detailOrder.data.shipmentMethod ? orderResponse.detailOrder.data.shipmentMethod.name + " - " + orderResponse.detailOrder.data.shipmentMethod.packages.name : 'It is not spareparts order' : '',

            shippingFee: orderResponse.detailOrder.data ? productType[i] === 'Suku Cadang' ? orderResponse.detailOrder.data.paymentDetail ? orderResponse.detailOrder.data.paymentDetail.detail : '-' : '' : '',

            initTotalQty: getProductResponse.result.data ? getProductResponse.result.data.totalQty : '',
            initAvailQty: getProductResponse.result.data ? getProductResponse.result.data.availableQty : '',
            initTotalItemOutlet: productType[i] === 'Layanan Bengkel' ? addToCartResponse.merchant.data ? addToCartResponse.merchant.data[0].totalItem : 'It is not product service order' : '',
            initTotalAvailOutlet: productType[i] === 'Layanan Bengkel' ? addToCartResponse.merchant.data ? addToCartResponse.merchant.data[0].totalAvailable : 'It is not product service order' : '',
            initTotalSentOutlet: productType[i] === 'Layanan Bengkel' ? addToCartResponse.merchant.data ? addToCartResponse.merchant.data[0].totalSent : 'It is not product service order' : '',

            afterOrderTotalQty: getDetailProductAfterOrder.result ? getDetailProductAfterOrder.result.data.totalQty : "",
            afterOrderTotalAvail: getDetailProductAfterOrder.result ? getDetailProductAfterOrder.result.data.availableQty : "",
            afterOrderTotalItemOutlet: productType[i] === 'Layanan Bengkel' ? indexOrder ? indexOrder != -1 ? getMerchantDetail.data[indexOrder].totalItem : '0' : '0' : 'It is not product service order',
            afterOrderTotalAvailOutlet: productType[i] === 'Layanan Bengkel' ? indexOrder ? indexOrder != -1 ? getMerchantDetail.data[indexOrder].totalAvailable : '0' : '0' : 'It is not product service order',
            afterOrderTotalSentOutlet: productType[i] === 'Layanan Bengkel' ? indexOrder ? indexOrder != -1 ? getMerchantDetail.data[indexOrder].totalSent : '0' : '0' : 'It is not product service order',

            afterCancelTotalQty: getDetailProductAfterCancel.result ? getDetailProductAfterCancel.result.data.totalQty : "",
            afterCancelTotalAvail: getDetailProductAfterCancel.result ? getDetailProductAfterCancel.result.data.availableQty : "",
            afterCancelTotalItemOutlet: productType[i] === 'Layanan Bengkel' ? getMerchantDetailAfterCancel.data[indexCancel].totalItem : 'It is not product service order',
            afterCancelTotalAvailOutlet: productType[i] === 'Layanan Bengkel' ? getMerchantDetailAfterCancel.data[indexCancel].totalAvailable : 'It is not product service order',
            afterCancelTotalSentOutlet: productType[i] === 'Layanan Bengkel' ? getMerchantDetailAfterCancel.data[indexCancel].totalSent : 'It is not product service order',

            balancePoint: initPoint,
            usedPoint: pointAmount,

            applyPoint: usePointResponse,
            poinAfterOrder: poinCustAfterOrderResp.result.data.point,
            pointAfterCancel: poinCustAfterCancelResp.result.data.point,

            usedCoupon: couponUsed != '' ? couponUsed : 'Tidak menggunakan kupon',
            useCouponStatus: useCouponResponse[1] ? useCouponResponse === 'Tidak menggunakan kupon' ? 'Tidak menggunakan kupon' : useCouponResponse[1].resUseCoupon.length == 0 ? 'Successfully apply coupon' : useCouponResponse[1].resUseCoupon[0].errorCondition : '',
            useCouponData: useCouponResponse[1] ? useCouponResponse === 'Tidak menggunakan kupon' ? 'Tidak menggunakan kupon' : useCouponResponse[1].discountDetail[0] ? useCouponResponse[1].discountDetail[0] : '' : ''
        }
    }
    await browser.close();

    const htmlResult = await getHtmlData(custOrderDetail, recapStatus, startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", dateDiff, duration);
    const pdfFilePath = await generatePdf(htmlResult, paymentWith, pointAmount, couponUsed);

    const filename = pdfFilePath.replace(config.BASE_DIRECTORY, "");
    let attachmentData = { filename, pdfFilePath }
    return attachmentData;

};

export default oneFlowOrderCancel;