// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-extra";
import dotenv from "dotenv";
dotenv.config();
import login from "./services/authentication.js";
import { cartPage, homepageSelector, locationSelector, headerPageSelector } from "./constanta/selectorList.js";
import { checkPointHomepage, customerDashboard } from "./services/account.js";
import { getProductDetail, addtoCart, getProductAfterProcess, newGetProductAfterProcess } from "./services/product.js";
import { checklistProduct, usePoint, useCoupon } from "./services/cart.js";
import checkout from "./services/checkout.js";
import { responseUrl, cleansingCart, getLocation, getCurrentLocation, dateDifference } from "./utils/baseService.js";
import cancelOrder from "./services/cancelOrder.js";
import data from "./constanta/inputData.js";
import getBodyHtml from "./testHtml.js";
import { generatePdf, mergePdf } from "./utils/generatePdf.js";
import getBodyHtmlPage2 from "./page2Html.js";
import { closeSync } from "fs";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import config from "./constanta/config.js";
import { sendMail } from "./utils/baseService.js";

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

    let [loginStatus, getProductCardStatus, addToCartStatus, checklistProductCart, usePointStatus, useCouponStatus, orderStatus] = ["", "", "", "", "", "", ""];
    let [location, initPoint, getProductResponse, addToCartResponse, checklistProductCartResponse, usePointResponse, useCouponResponse, orderResponse, detailProductAfterOrderResp, poinCustAfterOrderResp] =
        ["", "", "", "", "", "", "", "", "", ""];
    let custOrderDetail = [];
    let recapStatus = [];
    const productType = ['Suku Cadang', 'Layanan Bengkel', 'Homeservice'];
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

    const recorder = new PuppeteerScreenRecorder(page); // Config is optional
    const savePath = './document/automation-result-' + new Date().toJSON().slice(0, 10) + 'T' + new Date().getHours() + new Date().getMinutes() + '.mp4';
    await recorder.start(savePath);

    // await page.goto(process.env.URL);
    await page.goto(config.URL);

    // const loginResp = await login(page, process.env.email, process.env.password); // login process
    const loginResp = await login(page, config.email, config.password); // login process

    for (let i = 0; i < productType.length; i++) {
        if (loginResp.status === 200) {
            loginStatus = true;

            cleansingResponse = await cleansingCart(page); // hapus semua produk di keranjang

            if (cleansingResponse.status === 200) {
                cleansingCartStatus = true;
            } else {
                cleansingCartStatus = false;
            }

            let getPoinCust = await checkPointHomepage(page); // get initial customer point
            initPoint = getPoinCust;

            // get location
            if (productType[i] === 'Layanan Bengkel') {
                location = await getCurrentLocation(page);
                console.log(location);
                if (location.getLocationResponse.status === 200) {
                    getLocationStatus = true;
                } else {
                    getLocationStatus = false;
                }
            }
            //get location end

            getProductResponse = await getProductDetail(page, productType[i]); // go to PDP
            // getProductResponse = getProductResp;

            if (getProductResponse.status === 200) {
                getProductCardStatus = true;

                // add to cart start
                if (productType[i] === 'Suku Cadang') {
                    addToCartResponse = await addtoCart(page, data.QTY, productType[i]);
                } else if (productType[i] === 'Layanan Bengkel') {
                    addToCartResponse = await addtoCart(page, data.QTY, productType[i], data.isBookingDate, location.latitude, location.longitude, getProductResponse.data.id);
                } else {
                    addToCartResponse = await addtoCart(page, data.QTY, productType[i], data.isBookingDate);
                }
                //add to cart end

                if (addToCartResponse.respAddToCart.status === 200) {
                    addToCartStatus = true;

                    checklistProductCartResponse = await checklistProduct(page); // checklist all product within productType
                    // checklistProductCartResponse = checklistProductCartResp;
                    await page.waitForTimeout(1000);

                    // apply point in cart start
                    if (data.point > 0 && (getProductResponse.data.price * data.QTY) >= '50000') {
                        let usePointResp = await usePoint(page, data.point);
                        let repUsePointResp = usePointResp.replace(/(\w+):/g, `"$1":`);
                        usePointResponse = JSON.parse(repUsePointResp);
                        usePointStatus = true;
                    } else if (data.point > 0 && (getProductResponse.data.price * data.QTY) < '50000') {
                        usePointResponse = 'Tidak memenuhi syarat, minimal pembelanjaan 50.000';
                        usePointStatus = false
                    }
                    await page.waitForTimeout(1000);
                    // apply point in cart end

                    // apply coupon in cart start
                    if (data.coupon != "") {
                        let useCouponResp = await useCoupon(page, data.coupon);
                        useCouponResponse = useCouponResp;
                        if (useCouponResponse.status === 200) {
                            useCouponStatus = true;
                        } else {
                            useCouponStatus = false;
                        }

                    } else {
                        useCouponResponse = 'Tidak menggunakan kupon';
                    }
                    // apply coupon in cart end

                   
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

        if (orderStatus === true) {
            const cancelOrderResp = await cancelOrder(page, orderResponse.data.orderNumber, data.payWith, orderResponse.data.id, browser);
            if (cancelOrderResp.status === 200) {
                cancelStatus = true;
                // get detail product after cancel
                let detailProductAfterCancel = "";
                if (productType[i] === "Layanan Bengkel") {
                    detailProductAfterCancel = await newGetProductAfterProcess(getProductResponse.data.urlKey, productType[i], browser, getProductResponse.data.id, location);
                } else {
                    detailProductAfterCancel = await newGetProductAfterProcess(getProductResponse.data.urlKey, productType[i], browser);
                }
                detailProductAfterCancelResp = detailProductAfterCancel

                if (productType[i] === "Layanan Bengkel") {
                    indexCancel = detailProductAfterCancelResp.respMerchant.data.findIndex(x => x.code === addToCartResponse.merchantResponse.data[0].name);
                }
                // const backToHome = await page.goto(process.env.URL);
                const backToHome = await page.goto(config.URL);


                poinCustAfterCancelResp = await checkPointHomepage(page); // get point customer after cancel
            } else {
                cancelStatus = false
            }
        }

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

        custOrderDetail[i] = {
            location: location,
            productType: productType[i],
            productName: getProductResponse.data.name,
            productSKU: getProductResponse.data.sku,
            productMerchant: getProductResponse.data.merchantName,
            productPrice: getProductResponse.data.price,
            productOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].name : 'It is not product service order',
            orderNumber: orderResponse.data.orderNumber,
            orderDate: new Date(orderResponse.data.orderDate).toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB",
            total: orderResponse.data.total,
            qty: orderResponse.data.totalQuantity,
            paymentMethod: orderResponse.data.paymentMethod.paymentMethod,
            vaNumber: orderResponse.data.paymentMethod.vaNumber,
            receiverName: orderResponse.data.receiverName ? orderResponse.data.receiverName : '',
            receiverPhone: orderResponse.data.receiverPhone ? orderResponse.data.receiverPhone : '',
            address: orderResponse.data.address,
            courier: orderResponse.data.shipmentMethod ? orderResponse.data.shipmentMethod.name + " - " + orderResponse.data.shipmentMethod.packages.name : 'It is not spareparts order',
            shippingFee: productType[i] === 'Suku Cadang' ? orderResponse.data.paymentDetail.detail[1].value + orderResponse.data.paymentDetail.detail[2].value : '-',

            initTotalQty: getProductResponse.data.totalQty,
            initAvailQty: getProductResponse.data.availableQty,
            initTotalItemOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalItem : 'It is not product service order',
            initTotalAvailOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalAvailable : 'It is not product service order',
            initTotalSentOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalSent : 'It is not product service order',

            afterOrderTotalQty: detailProductAfterOrderResp.productDetailRes.data.totalQty,
            afterOrderTotalAvail: detailProductAfterOrderResp.productDetailRes.data.availableQty,
            afterOrderTotalItemOutlet: detailProductAfterOrderResp.respMerchant.data ? detailProductAfterOrderResp.respMerchant.data[indexOrder].totalItem : 'It is not product service order',
            afterOrderTotalAvailOutlet: detailProductAfterOrderResp.respMerchant.data ? detailProductAfterOrderResp.respMerchant.data[indexOrder].totalAvailable : 'It is not product service order',
            afterOrderTotalSentOutlet: detailProductAfterOrderResp.respMerchant.data ? detailProductAfterOrderResp.respMerchant.data[indexOrder].totalSent : 'It is not product service order',

            afterCancelTotalQty: detailProductAfterCancelResp.productDetailRes.data.totalQty,
            afterCancelTotalAvail: detailProductAfterCancelResp.productDetailRes.data.availableQty,
            afterCancelTotalItemOutlet: detailProductAfterCancelResp.respMerchant.data ? detailProductAfterCancelResp.respMerchant.data[indexCancel].totalItem : 'It is not product service order',
            afterCancelTotalAvailOutlet: detailProductAfterCancelResp.respMerchant.data ? detailProductAfterCancelResp.respMerchant.data[indexCancel].totalAvailable : 'It is not product service order',
            afterCancelTotalSentOutlet: detailProductAfterCancelResp.respMerchant.data ? detailProductAfterCancelResp.respMerchant.data[indexCancel].totalSent : 'It is not product service order',

            balancePoint: initPoint,
            usedPoint: usePointResponse.point ? usePointResponse.point : usePointResponse,
            applyPoint: usePointResponse,
            poinAfterOrder: poinCustAfterOrderResp,
            pointAfterCancel: poinCustAfterCancelResp,

            usedCoupon: data.coupon,
            useCouponStatus: useCouponResponse.message
        }
    }

    let endDate = new Date();
    let dateDiff = await dateDifference(endDate, startDate);
    console.log(custOrderDetail);
    console.log(recapStatus);


    await recorder.stop();

    const htmlPage1 = await getBodyHtml(custOrderDetail, recapStatus, startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", dateDiff);
    const page1 = await generatePdf(htmlPage1, '1');

    const htmlPage2 = await getBodyHtmlPage2(custOrderDetail);
    const page2 = await generatePdf(htmlPage2, '2');

    let filePdf = [page1, page2];
    const docPath = await mergePdf(filePdf);
    console.log(docPath);
    const filename = docPath.replace("./document/","");
    console.log(filename)
    await sendMail(filename, docPath);
    await browser.close();

})();