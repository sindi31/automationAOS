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
    const productType = ['Suku Cadang','Layanan Bengkel','Homeservice'];
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





    await page.goto(config.URL);
    // page.setDefaultNavigationTimeout(0);

    let loginResp = await login(page, config.email, config.password); // login process
    // console.log('loginResp',loginResp);

    for (let i = 0; i < productType.length; i++) {
        // const recorder = new PuppeteerScreenRecorder(page); // Config is optional
        // const savePath = './document/automation-result-' +productType[i]+ new Date().toJSON().slice(0, 10) + 'T' + new Date().getHours() + new Date().getMinutes() + '.mp4';
        // await recorder.start(savePath);

        if (loginResp.response.status === 200) {
            loginStatus = true;
            // console.log('Login Process >>', loginStatus)
            console.log('Flow Order & Cancel >> Pembayaran:' + paymentWith + ', point: ' + pointAmount + ', kupon: ' + couponUsed + ', product : ' + productType[i])

            cleansingResponse = await cleansingCart(page); // hapus semua produk di keranjang

            if (cleansingResponse.status === 200) {
                cleansingCartStatus = true;
            } else {
                cleansingCartStatus = false;
            }

            // console.log('Cleansing Cart Process >>', cleansingCartStatus)
            // console.log('cleansingResponse:',cleansingResponse);

            let getPoinCust = await getPersonalData(page, loginResp.response.data.userID, loginResp.response.data.accessToken);
            // console.log('getPoinCust', getPoinCust.result.data.point)
            initPoint = getPoinCust.result.data.point;

            // get location
            if (productType[i] === 'Layanan Bengkel') {
                location = await getCurrentLocation(page);
                // console.log(location);
                if (location.getLocationResponse.status === 200) {
                    getLocationStatus = true;
                    // console.log('Get Location Process >>', getLocationStatus)
                } else {
                    getLocationStatus = false;
                    // console.log('Get Location Process >>', getLocationStatus)
                }
            }
            //get location end

            // console.log(urlKeyLayananBengkel)
            //go to PDP start
            if (productType[i] === 'Suku Cadang') {
                getProductResponse = await newGetPDP(page, urlKeySukuCadang, loginResp.response.data.accessToken, 'PDP');
            } else if (productType[i] === 'Layanan Bengkel') {
                getProductResponse = await newGetPDP(page, urlKeyLayananBengkel, loginResp.response.data.accessToken, 'PDP');
            } else {
                getProductResponse = await newGetPDP(page, urlKeyHomeservice, loginResp.response.data.accessToken, 'PDP');
            }
            //go to PDP end

            // console.log('getProductResponse:',getProductResponse)


            // getProductResponse = await getProductDetail(page, productType[i]); // go to PDP

            if (getProductResponse.result.status === 200) {
                getProductCardStatus = true;
                // console.log('Get Product Process >>', getProductCardStatus)

                // add to cart start
                if (productType[i] === 'Suku Cadang') {
                    addToCartResponse = await addtoCart(page, qty, productType[i]);
                } else if (productType[i] === 'Layanan Bengkel') {
                    addToCartResponse = await addtoCart(page, qty, productType[i], data.isBookingDate, location.latitude, location.longitude, getProductResponse.result.data.id);
                } else {
                    addToCartResponse = await addtoCart(page, qty, productType[i], data.isBookingDate);
                }
                //add to cart end
                // console.log('addToCartResponse:', addToCartResponse);

                if (addToCartResponse.result.status === 200) {
                    addToCartStatus = true;
                    // console.log('Add to Cart Process >>', addToCartStatus);

                    checklistProductCartResponse = await checklistProduct(page); // checklist all product within productType
                    // checklistProductCartResponse = checklistProductCartResp;
                    // await page.waitForTimeout(1000);

                    // apply point in cart start

                    usePointResponse = await usePoint(page, pointAmount, getProductResponse.result.data.price, qty);
                    usePointStatus = usePointResponse.usePointStatus;
                    // console.log('usePointResponse:',usePointResponse);
                    // console.log('Use point  >>', usePointStatus);
                    // apply point in cart end

                    // apply coupon in cart start
                    if (couponUsed != "") {
                        let useCouponResp = await useCoupon(page, couponUsed);
                        // console.log(useCouponResp[0].status);
                        useCouponResponse = useCouponResp;
                        if (useCouponResponse[0].status === 200) {
                            useCouponStatus = true;
                            // console.log('Use Coupon Process >>', useCouponStatus)
                        } else {
                            useCouponStatus = false;
                            // console.log('Use Coupon Process >>', useCouponStatus)
                        }

                    } else {
                        useCouponResponse = 'Tidak menggunakan kupon';
                        // console.log('Use Coupon Process>>', useCouponResponse);
                    }
                    // apply coupon in cart end
                    // console.log('useCouponResponse:',useCouponResponse);

                    orderResponse = await checkout(page, paymentWith, productType[i], browser, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken); // proses order di halaman checkout
                    // console.log('orderResponse:', orderResponse.result.getDetailProductAfterOrder);

                    if (orderResponse.result.paymentResp.status === 200) {
                        orderStatus = true;
                        // console.log('Order Process>>', orderStatus);

                        // get detail product after order start >>>
                        // if (productType[i] === "Layanan Bengkel") {
                        //    detailProductAfterOrderResp = await newGetProductAfterProcess(getProductResponse.result.data.urlKey, productType[i], browser, getProductResponse.result.data.id, location);
                        //     indexOrder = detailProductAfterOrderResp.respMerchant.data.findIndex(x => x.code === addToCartResponse.merchant.data[0].name);
                        // } else {
                        //     detailProductAfterOrderResp = await newGetProductAfterProcess(getProductResponse.result.data.urlKey, productType[i], browser);
                        // }


                        // if (productType[i] === "Layanan Bengkel") {
                        //     indexOrder = detailProductAfterOrderResp.respMerchant.data.findIndex(x => x.code === addToCartResponse.merchantResponse.data[0].name);
                        // }
                        // get detail product after order end <<<

                        // if (paymentWith.includes('VA') || paymentWith.includes('Alfa') || paymentWith.includes('GOPAY')) {
                        //     // const backToHome = await page.goto(process.env.URL); // back to homepage
                        //     const backToHome = await page.goto(config.URL); // back to homepage
                        //     poinCustAfterOrderResp = await checkPointHomepage(page); // get point customer after order
                        //     await page.waitForTimeout(2000);
                        // } else if (paymentWith.includes('Credit')) {
                        //     const page2 = await browser.newPage();
                        //     // await page2.goto(process.env.URL); // back to homepage
                        //     await page2.goto(config.URL); // back to homepage
                        //     poinCustAfterOrderResp = await checkPointHomepage(page2); // get point customer after order
                        //     await page2.close();
                        // }

                        if (paymentWith.includes("VA") || paymentWith.includes("Alfa")) {
                            await page.waitForTimeout(1000);
                            await page.waitForSelector(orderPage.orderCreatedMsg);
                            const message = await page.$eval(orderPage.orderCreatedMsg, el => el.textContent);
                            // console.log('coba1');
                            console.log('message', message)
                            if (message == 'Hore pesanan telah dibuat! Yuk bayar pesananmu sekarang!') {
                                getDetailProductAfterOrder = await newGetPDP(page, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken);

                                // console.log('getDetailProductAfterOrder', getDetailProductAfterOrder);

                                console.log('masuk ke sini')
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

                                    console.log('getMerchantDetail', getMerchantDetail);
                                    indexOrder = getMerchantDetail.data.findIndex(x => x.code === addToCartResponse.merchant.data[0].name);
                                    console.log('merchant_name', addToCartResponse.merchant.data[0].name)
                                    console.log('index', indexOrder)
                                }
                                // console.log('Data After Order', getDetailProductAfterOrder);
                                // console.log('getMerchantDetail',getMerchantDetail);

                            }
                        }

                        poinCustAfterOrderResp = await getPersonalData(page, loginResp.response.data.userID, loginResp.response.data.accessToken);
                        // console.log('poin after order', poinCustAfterOrderResp);
                        await page.waitForTimeout(3000);



                    } else {
                        orderStatus = false;
                        // console.log('Order Process>>', orderStatus);
                        // console.log(orderResponse)

                    }
                } else {
                    addToCartStatus = false;
                    // console.log('Add to Cart Process>>', addToCartStatus);

                }
            } else {
                getProductCardStatus = false;
                // console.log('Get Product Process>>', getProductCardStatus);

            }
        } else {
            loginStatus = false;
            console.log('Login Process>>', loginStatus);
        }

        let getDetailProductAfterCancel = "";
        let getMerchantDetailAfterCancel = "";
        let cancelOrderResp;


        // await recorder.stop();

        if (orderStatus === true) {
            cancelOrderResp = await newCancelOrder(page);
            // console.log('cancelOrderResp:',cancelOrderResp);

            if (cancelOrderResp.result.status === 200) {
                cancelStatus = true;
                // console.log('Cancel Process>>', cancelStatus);

                // get detail product after cancel
            } else {
                cancelStatus = false
                // console.log('Cancel Process>>', cancelStatus);

            }

            getDetailProductAfterCancel = await newGetPDP(page, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken);

            // detailProductAfterCancelResp = await newGetPDP(page, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken);
            // console.log('after cancel', detailProductAfterCancelResp);
            // console.log('getDetailProductAfterCancel', getDetailProductAfterCancel);

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
                // console.log('index', indexCancel)
            }
            // if (productType[i] === "Layanan Bengkel") {
            //     detailProductAfterCancel = await newGetProductAfterProcess(getProductResponse.result.data.urlKey, productType[i], browser, getProductResponse.result.data.id, location);
            //     indexCancel = detailProductAfterCancel.respMerchant.data.findIndex(x => x.code === addToCartResponse.merchant.data[0].name);
            // } else {
            //     detailProductAfterCancel = await newGetProductAfterProcess(getProductResponse.result.data.urlKey, productType[i], browser);
            // }
            // detailProductAfterCancelResp = await newGetPDP(page, getProductResponse.result.data.urlKey, loginResp.response.data.accessToken);
            // console.log('after cancel', detailProductAfterCancelResp);


            // const backToHome = await page.goto(process.env.URL);


            poinCustAfterCancelResp = await getPersonalData(page, loginResp.response.data.userID, loginResp.response.data.accessToken);
            // console.log('poin after cancel', poinCustAfterCancelResp);
            const backToHome = await page.goto(config.URL);
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
        // console.log(duration);
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
            // shippingFee: productType[i] === 'Suku Cadang' ? orderResponse.data.paymentDetail.detail[1].value + orderResponse.data.paymentDetail.detail[2].value : '-',
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
            // usedPoint: usePointResponse.point ? usePointResponse.point : usePointResponse,
            applyPoint: usePointResponse,
            poinAfterOrder: poinCustAfterOrderResp.result.data.point,
            pointAfterCancel: poinCustAfterCancelResp.result.data.point,

            usedCoupon: couponUsed != '' ? couponUsed : 'Tidak menggunakan kupon',
            useCouponStatus: useCouponResponse[1] ? useCouponResponse === 'Tidak menggunakan kupon' ? 'Tidak menggunakan kupon' : useCouponResponse[1].resUseCoupon.length == 0 ? 'Successfully apply coupon' : useCouponResponse[1].resUseCoupon[0].errorCondition : '',
            useCouponData: useCouponResponse[1] ? useCouponResponse === 'Tidak menggunakan kupon' ? 'Tidak menggunakan kupon' : useCouponResponse[1].discountDetail[0] ? useCouponResponse[1].discountDetail[0] : '' : ''
        }
    }


    // console.log('custOrderDetail', custOrderDetail)

    let endDate = new Date();
    let dateDiff = await dateDifference(endDate, startDate);



    const htmlResult = await getHtmlData(custOrderDetail, recapStatus, startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", dateDiff, duration);
    const pdfFilePath = await generatePdf(htmlResult, paymentWith, pointAmount, couponUsed);

    const filename = pdfFilePath.replace(config.BASE_DIRECTORY, "");
    // await sendMail(filename, pdfFilePath);

    let attachmentData = { filename, pdfFilePath }

    await browser.close();
    return attachmentData;

};

export default oneFlowOrderCancel;