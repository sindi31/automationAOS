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
import htmlPage2 from "./html/example.js";
import getHtmlData from "./html/generateHtml.js";

const oneFlowOrderCancel = async (paymentWith, pointAmount, couponUsed) => {
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

    // const recorder = new PuppeteerScreenRecorder(page); // Config is optional
    // const savePath = './document/automation-result-' + new Date().toJSON().slice(0, 10) + 'T' + new Date().getHours() + new Date().getMinutes() + '.mp4';
    // await recorder.start(savePath);


    await page.goto(config.URL);

    const loginResp = await login(page, config.email, config.password); // login process

    for (let i = 0; i < productType.length; i++) {
        if (loginResp.status === 200) {
            loginStatus = true;
            console.log('Login Process >>', loginStatus)
            console.log('Flow Order & Cancel >> Pembayaran:' + paymentWith + ', point: ' + pointAmount + ', kupon: ' + couponUsed + ', product : ' + productType[i])

            cleansingResponse = await cleansingCart(page); // hapus semua produk di keranjang

            if (cleansingResponse.status === 200) {
                cleansingCartStatus = true;
                console.log('Cleansing Cart Process >>', cleansingCartStatus)
            } else {
                cleansingCartStatus = false;
                console.log('Cleansing Cart Process >>', cleansingCartStatus)
            }

            let getPoinCust = await checkPointHomepage(page); // get initial customer point
            console.log('Get Init Point Cust Process >>', getPoinCust)
            initPoint = getPoinCust;

            // get location
            if (productType[i] === 'Layanan Bengkel') {
                location = await getCurrentLocation(page);
                // console.log(location);
                if (location.getLocationResponse.status === 200) {
                    getLocationStatus = true;
                    console.log('Get Location Process >>', getLocationStatus)
                } else {
                    getLocationStatus = false;
                    console.log('Get Location Process >>', getLocationStatus)
                }
            }
            //get location end

            getProductResponse = await getProductDetail(page, productType[i]); // go to PDP
            // getProductResponse = getProductResp;

            if (getProductResponse.status === 200) {
                getProductCardStatus = true;
                console.log('Get Product Process >>', getProductCardStatus)

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
                    console.log('Add to Cart Process >>', addToCartStatus);

                    checklistProductCartResponse = await checklistProduct(page); // checklist all product within productType
                    // checklistProductCartResponse = checklistProductCartResp;
                    await page.waitForTimeout(1000);

                    // apply point in cart start
                    console.log('point amout > ', pointAmount)

                    if (pointAmount > 0 && (getProductResponse.data.price * data.QTY) >= '50000') {
                        let usePointResp = await usePoint(page, pointAmount);
                        let repUsePointResp = usePointResp.replace(/(\w+):/g, `"$1":`);
                        usePointResponse = JSON.parse(repUsePointResp);
                        usePointStatus = true;
                        console.log('Use Point Process >>', usePointStatus)
                    } else if ((pointAmount > 0 || pointAmount === 'Gunakan Semua') && (getProductResponse.data.price * data.QTY) < '50000') {
                        usePointResponse = 'Tidak memenuhi syarat, minimal pembelanjaan 50.000';
                        usePointStatus = false
                        console.log('Use Point Process >>', usePointStatus)
                    } else if (pointAmount === 'Gunakan Semua' && (getProductResponse.data.price * data.QTY) >= '50000') {
                        let usePointResp = await usePoint(page, pointAmount);
                        let repUsePointResp = usePointResp.replace(/(\w+):/g, `"$1":`);
                        usePointResponse = JSON.parse(repUsePointResp);
                        usePointStatus = true;
                        console.log('Use Point Process >>', usePointStatus)
                    } else {
                        usePointResponse = 'Tidak Menggunakan Poin';
                        console.log('Use Point Process>>', usePointResponse);
                    }
                    await page.waitForTimeout(1000);
                    // apply point in cart end

                    // apply coupon in cart start
                    if (couponUsed != "") {
                        let useCouponResp = await useCoupon(page, couponUsed);
                        // console.log(useCouponResp[0].status);
                        useCouponResponse = useCouponResp;
                        if (useCouponResponse[0].status === 200) {
                            useCouponStatus = true;
                            console.log('Use Coupon Process >>', useCouponStatus)
                        } else {
                            useCouponStatus = false;
                            console.log('Use Coupon Process >>', useCouponStatus)
                        }

                    } else {
                        useCouponResponse = 'Tidak menggunakan kupon';
                        console.log('Use Coupon Process>>', useCouponResponse);
                    }

                    // console.log(useCouponResponse[1].resUseCoupon[0].errorCondition);
                    // await page.waitForTimeout(100000);
                    // apply coupon in cart end

                    orderResponse = await checkout(page, paymentWith, productType[i], browser); // proses order di halaman checkout

                    if (orderResponse.status === 200) {
                        orderStatus = true;
                        console.log('Order Process>>', orderStatus);

                        // get detail product after order start >>>
                        if (productType[i] === "Layanan Bengkel") {
                            detailProductAfterOrderResp = await newGetProductAfterProcess(getProductResponse.data.urlKey, productType[i], browser, getProductResponse.data.id, location);
                            indexOrder = detailProductAfterOrderResp.respMerchant.data.findIndex(x => x.code === addToCartResponse.merchantResponse.data[0].name);
                        } else {
                            detailProductAfterOrderResp = await newGetProductAfterProcess(getProductResponse.data.urlKey, productType[i], browser);
                        }


                        // if (productType[i] === "Layanan Bengkel") {
                        //     indexOrder = detailProductAfterOrderResp.respMerchant.data.findIndex(x => x.code === addToCartResponse.merchantResponse.data[0].name);
                        // }
                        // get detail product after order end <<<

                        if (paymentWith.includes('VA') || paymentWith.includes('Alfa') || paymentWith.includes('GOPAY')) {
                            // const backToHome = await page.goto(process.env.URL); // back to homepage
                            const backToHome = await page.goto(config.URL); // back to homepage
                            poinCustAfterOrderResp = await checkPointHomepage(page); // get point customer after order
                            await page.waitForTimeout(2000);
                        } else if (paymentWith.includes('Credit')) {
                            const page2 = await browser.newPage();
                            // await page2.goto(process.env.URL); // back to homepage
                            await page2.goto(config.URL); // back to homepage
                            poinCustAfterOrderResp = await checkPointHomepage(page2); // get point customer after order
                            await page2.close();
                        }

                    } else {
                        orderStatus = false;
                        console.log('Order Process>>', orderStatus);

                    }
                } else {
                    addToCartStatus = false;
                    console.log('Add to Cart Process>>', addToCartStatus);

                }
            } else {
                getProductCardStatus = false;
                console.log('Get Product Process>>', getProductCardStatus);

            }
        } else {
            loginStatus = false;
            console.log('Login Process>>', loginStatus);


        }

        let detailProductAfterCancel = "";


        if (orderStatus === true) {
            const cancelOrderResp = await cancelOrder(page, orderResponse.data.orderNumber, paymentWith, orderResponse.data.id, browser);
            if (cancelOrderResp.status === 200) {
                cancelStatus = true;
                console.log('Cancel Process>>', cancelStatus);

                // get detail product after cancel
            } else {
                cancelStatus = false
                console.log('Cancel Process>>', cancelStatus);

            }

            if (productType[i] === "Layanan Bengkel") {
                detailProductAfterCancel = await newGetProductAfterProcess(getProductResponse.data.urlKey, productType[i], browser, getProductResponse.data.id, location);
                indexCancel = detailProductAfterCancel.respMerchant.data.findIndex(x => x.code === addToCartResponse.merchantResponse.data[0].name);
            } else {
                detailProductAfterCancel = await newGetProductAfterProcess(getProductResponse.data.urlKey, productType[i], browser);
            }
            detailProductAfterCancelResp = detailProductAfterCancel

            // const backToHome = await page.goto(process.env.URL);
            const backToHome = await page.goto(config.URL);

            poinCustAfterCancelResp = await checkPointHomepage(page); // get point customer after cancel
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
            orderNumber: orderResponse.data.orderNumber ? orderResponse.data.orderNumber : "",
            orderDate: orderResponse.data.orderDate ? new Date(orderResponse.data.orderDate).toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB" : "",
            total: orderResponse.data.total ? orderResponse.data.total : "",
            qty: orderResponse.data.totalQuantity ? orderResponse.data.totalQuantity : "",
            paymentMethod: orderResponse.data.paymentMethod ? orderResponse.data.paymentMethod.paymentMethod : "",
            vaNumber: orderResponse.data.paymentMethod ? orderResponse.data.paymentMethod.vaNumber : "",
            receiverName: orderResponse.data.paymentMethod ? orderResponse.data.receiverName : '',
            receiverPhone: orderResponse.data.paymentMethod ? orderResponse.data.receiverPhone : '',
            address: orderResponse.data.address ? orderResponse.data.address : "",
            courier: orderResponse.data.shipmentMethod ? orderResponse.data.shipmentMethod.name + " - " + orderResponse.data.shipmentMethod.packages.name : 'It is not spareparts order',
            // shippingFee: productType[i] === 'Suku Cadang' ? orderResponse.data.paymentDetail.detail[1].value + orderResponse.data.paymentDetail.detail[2].value : '-',
            shippingFee: productType[i] === 'Suku Cadang' ? orderResponse.data.paymentMethod ? orderResponse.data.paymentDetail.detail : '-' : '',

            initTotalQty: getProductResponse.data.totalQty,
            initAvailQty: getProductResponse.data.availableQty,
            initTotalItemOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalItem : 'It is not product service order',
            initTotalAvailOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalAvailable : 'It is not product service order',
            initTotalSentOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalSent : 'It is not product service order',

            afterOrderTotalQty: detailProductAfterOrderResp.productDetailRes ? detailProductAfterOrderResp.productDetailRes.data.totalQty : "",
            afterOrderTotalAvail: detailProductAfterOrderResp.productDetailRes ? detailProductAfterOrderResp.productDetailRes.data.availableQty : "",
            afterOrderTotalItemOutlet: detailProductAfterOrderResp.respMerchant ? detailProductAfterOrderResp.respMerchant.data[indexOrder].totalItem : 'It is not product service order',
            afterOrderTotalAvailOutlet: detailProductAfterOrderResp.respMerchant ? detailProductAfterOrderResp.respMerchant.data[indexOrder].totalAvailable : 'It is not product service order',
            afterOrderTotalSentOutlet: detailProductAfterOrderResp.respMerchant ? detailProductAfterOrderResp.respMerchant.data[indexOrder].totalSent : 'It is not product service order',

            afterCancelTotalQty: detailProductAfterCancelResp.productDetailRes ? detailProductAfterCancelResp.productDetailRes.data.totalQty : "",
            afterCancelTotalAvail: detailProductAfterCancelResp.productDetailRes ? detailProductAfterCancelResp.productDetailRes.data.availableQty : "",
            afterCancelTotalItemOutlet: detailProductAfterCancelResp.respMerchant ? detailProductAfterCancelResp.respMerchant.data[indexCancel].totalItem : 'It is not product service order',
            afterCancelTotalAvailOutlet: detailProductAfterCancelResp.respMerchant ? detailProductAfterCancelResp.respMerchant.data[indexCancel].totalAvailable : 'It is not product service order',
            afterCancelTotalSentOutlet: detailProductAfterCancelResp.respMerchant ? detailProductAfterCancelResp.respMerchant.data[indexCancel].totalSent : 'It is not product service order',

            balancePoint: initPoint,
            usedPoint: pointAmount,
            // usedPoint: usePointResponse.point ? usePointResponse.point : usePointResponse,
            applyPoint: usePointResponse,
            poinAfterOrder: poinCustAfterOrderResp,
            pointAfterCancel: poinCustAfterCancelResp,

            usedCoupon: couponUsed != '' ? couponUsed : 'Tidak menggunakan kupon',
            useCouponStatus: useCouponResponse === 'Tidak menggunakan kupon' ? 'Tidak menggunakan kupon' : useCouponResponse[1].resUseCoupon.length == 0 ? 'Successfully apply coupon' : useCouponResponse[1].resUseCoupon[0].errorCondition,
            useCouponData: useCouponResponse === 'Tidak menggunakan kupon' ? 'Tidak menggunakan kupon' : useCouponResponse[1].discountDetail[0] ? useCouponResponse[1].discountDetail[0] : ''
        }
    }

    let endDate = new Date();
    let dateDiff = await dateDifference(endDate, startDate);

    // await recorder.stop();

    console.log('oke, coba generate html')

    const htmlResult = await getHtmlData(custOrderDetail, recapStatus, startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", dateDiff);
    const pdfFilePath = await generatePdf(htmlResult, orderResponse.data.paymentMethod.paymentMethod, pointAmount, couponUsed);

    const filename = pdfFilePath.replace(config.BASE_DIRECTORY, "");
    console.log(filename)
    // await sendMail(filename, pdfFilePath);

    let attachmentData = { filename, pdfFilePath }

    await browser.close();
    return attachmentData;
    // await page.waitForTimeout(10000)



};

export default oneFlowOrderCancel;