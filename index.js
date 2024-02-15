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


   const loginResp = await login(page, process.env.email, process.env.password);
   // console.log('Login >>>', loginResp);

   if (loginResp.status === 200) {
      loginStatus = true;
      //cleansing data keranjang start >>
      await page.goto(process.env.cartURL);
      await page.waitForTimeout(1000);

      let isEmptyCart = await page.$eval(cartPage.emptyCart, () => true).catch(() => false);
      while (isEmptyCart == false) {
         const hapusProductCart = await page.waitForSelector(cartPage.deleteProduct, { visible: true });
         await hapusProductCart.click();
         await page.waitForTimeout(1000);
         isEmptyCart = await page.$eval(cartPage.emptyCart, () => true).catch(() => false);
      }
      await page.click(cartPage.backButton);
      await page.waitForNavigation();
      // console.log('Cleansing Cart Data >>> success');
      //cleansing data keranjang end

      const getPoinCust = await checkPointHomepage(page);
      initPoint = getPoinCust;
      // console.log('Poin Awal Customer >>>', getPoinCust);

      // get location
      if (productType === 'Layanan Bengkel') {
         const getLocationIcon = await page.$(homepageSelector.getLocIcon);
         await Promise.all([
            getLocationIcon.click(),
            page.waitForNavigation({ waitUntil: "networkidle2" })
         ])

         

         const useCurrentLoc = await page.waitForXPath("//button[normalize-space()='Gunakan lokasi saya saat ini']");
         await useCurrentLoc.click();
         // const localStoragee = await page.evaluate(() => Object.assign({}, window.localStorage));
         // console.log(localStoragee);
         await page.waitForTimeout(2000)
         
         const latitude = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                position => {
                  resolve(position.coords.latitude);
                },
                error => {
                  reject(error);
                }
              );
            });
          });
        
          console.log('Latitude:', latitude);

        
         await page.waitForTimeout(10000);
         // // Grant geolocation permission
         // await page.evaluate(() => {
         //    navigator.geolocation.getCurrentPosition = (successCallback, errorCallback, options) => {
         //       successCallback({ coords: { latitude: 51.1, longitude: -0.1 } }); // Grant permission
         //    };
         // });

         const useCurrentLoc2 = await page.waitForXPath("//button[normalize-space()='Gunakan lokasi saya saat ini']");
         await useCurrentLoc2.click();
         // await page.waitForTimeout(1000);
         const localStoragee2 = await page.evaluate(() => Object.assign({}, window.localStorage));
         console.log(localStoragee2);

         const localStorages = await page.evaluate(() => localStorage.getItem('@location'));
         console.log(localStorages);

         const useCurrentLocResponse = await responseUrl(page, "localStorages");
         console.log('use>>> '+useCurrentLocResponse);
         await page.waitForTimeout(3000);


         // await page.waitForTimeout(10000);
         // const localStoragee3 = await page.evaluate(() => Object.assign({}, window.localStorage));
         // console.log(localStoragee3);

         // const loc = (await page.$x(locationSelector.jakartaSelatan))[0];
         // await loc.click();
         // const getLocationResponse = await responseUrl(page, "location?latitude=-6.257406049902196&longitude=106.85370663038196");
         // if (getLocationResponse.status === 200) {
         //    await page.waitForTimeout(1000);
         //    const backToHome = (await page.$x(locationSelector.backButton))[0];
         //    await backToHome.click();
         //    // console.log('getLocation >> success')
         // };
         // console.log('Get Location >>>', getLocationResponse);
      }
      //get location end

      // //go to pdp start
      // const getProductResp = await getProductDetail(page, productType);
      // getProductResponse = getProductResp;
      // // console.log('Get PDP >>> ', getProductResp);
      // //go to pdp end
      // if (getProductResp.status === 200) {
      //    getProductCardStatus = true;

      //    //add to cart start >>
      //    if (productType === 'Suku Cadang') {
      //       let addToCartResp = await addtoCart(page, data.QTY, productType);
      //       addToCartResponse = addToCartResp
      //       // console.log('Add to cart >>>', addToCartResponse);
      //    } else {
      //       let addToCartResp = await addtoCart(page, data.QTY, productType, data.isBookingDate);
      //       addToCartResponse = addToCartResp
      //       // console.log('Add to cart >>>', addToCartResponse.merchantResponse.data[0].name);
      //    }
      //    //add to cart end <<
      //    if (addToCartResponse.respAddToCart.status === 200) {
      //       addToCartStatus = true;
      //       //cart page start >>
      //       let checklistProductCartResp = await checklistProduct(page);
      //       checklistProductCartResponse = checklistProductCartResp;
      //       // console.log(checklistProductCartResp);
      //       await page.waitForTimeout(3000);

      //       if (data.point > 0 && getProductResponse.data.price >= '50000') {
      //          let usePointResp = await usePoint(page, data.point);
      //          let repUsePointResp = usePointResp.replace(/(\w+):/g, `"$1":`);
      //          usePointResponse = JSON.parse(repUsePointResp);
      //          // console.log('usePoint >>>', JSON.stringify(usePointResponse, null, 2));
      //          usePointStatus = true;
      //       } else if (data.point > 0 && getProductResponse.data.price < '500  00') {
      //          usePointResponse = 'Tidak memenuhi syarat, minimal pembelanjaan 50K';
      //          usePointStatus = false
      //       }

      //       if (data.coupon != "") {
      //          let useCouponResp = await useCoupon(page, data.coupon);
      //          console.log('Menggunakan Kupon? >>> YES')
      //          // console.log(useCouponResp);
      //          useCouponResponse = useCouponResp;
      //          // console.log(useCouponResponse);
      //          if (useCouponResponse.status === 200) {
      //             useCouponStatus = true;
      //          } else {
      //             useCouponStatus = false;
      //          }

      //       } else {
      //          console.log('Menggunakan Kupon? >>> NO');
      //          useCouponResponse = useCouponResp;

      //       }
      //       //cart page end <<

      //       //checkoutPage start >>
      //       let orderResp = await checkout(page, data.payWith, productType);
      //       orderResponse = orderResp;
      //       // console.log(orderResp);


      //       if (orderResp.status === 200) {
      //          orderStatus = true;

      //          const detailProductAfterOrder = await getProductAfterProcess(getProductResp.data.urlKey, productType);
      //          detailProductAfterOrderResp = detailProductAfterOrder
      //          // console.log(detailProductAfterOrder);

      //          const backToHome = await page.goto(process.env.URL);
      //          // await backToHome.click();

      //          const poinCustAfterOrder = await checkPointHomepage(page);
      //          // console.log('Poin Setelah Order >>>', poinCustAfterOrder);
      //          poinCustAfterOrderResp = poinCustAfterOrder;

      //       } else {
      //          orderStatus = false;
      //       }
      //       //checkoutPage end <<
      //    } else {
      //       addToCartStatus = false;
      //    }
      // } else {
      //    getProductCardStatus = false;
      // }
   } else {
      loginStatus = false;
   }

   // const cancelOrderResp = await cancelOrder(page, orderResponse.data.orderNumber);
   // console.log(cancelOrderResp);
   // let cancelStatus = "";
   // let detailProductAfterCancelResp = "";
   // let poinCustAfterCancelResp = "";

   // if (cancelOrderResp.status === 200) {
   //    cancelStatus = true;
   //    const detailProductAfterCancel = await getProductAfterProcess(getProductResponse.data.urlKey, productType);
   //    // console.log(detailProductAfterCancel)
   //    detailProductAfterCancelResp = detailProductAfterCancel
   //    // console.log(detailProductAfterOrder);

   //    const backToHome = await page.goto(process.env.URL);
   //    // await backToHome.click();

   //    const poinCustAfterCancel = await checkPointHomepage(page);
   //    poinCustAfterCancelResp = poinCustAfterCancel;
   //    // console.log('Poin Setelah Cancel >>>', poinCustAfterCancel);
   // } else {
   //    cancelStatus = false

   // }

   // // poinCustAfterOrderResp = poinCustAfterOrder;
   // // console.log({ loginResp, getProductResponse, addToCartResponse, checklistProductCartResponse, usePointResponse, useCouponResponse, orderResponse,detailProductAfterOrderResp, poinCustAfterOrderResp });
   // // console.log(loginStatus, getProductCardStatus, addToCartStatus, usePointStatus, useCouponStatus, orderStatus);

   // let recapStatus = {
   //    login: loginStatus,
   //    addCart: addToCartStatus,
   //    applyPoint: usePointStatus,
   //    applyCoupon: useCouponStatus,
   //    order: orderStatus,
   //    cancel: cancelStatus
   // };

   // let custOrderDetail = {
   //    productType: productType,
   //    productName: getProductResponse.data.name,
   //    productSKU: getProductResponse.data.sku,
   //    productMerchant: getProductResponse.data.merchantName,
   //    productPrice: getProductResponse.data.price,
   //    productOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].name : 'It is not product service order',
   //    orderNumber: orderResponse.data.orderNumber,
   //    orderDate: new Date(orderResponse.data.orderDate).toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB",
   //    total: orderResponse.data.total,
   //    qty: orderResponse.data.totalQuantity,
   //    paymentMethod: orderResponse.data.paymentMethod.paymentMethod,
   //    vaNumber: orderResponse.data.paymentMethod.vaNumber,
   //    receiverName: orderResponse.data.receiverName ? orderResponse.data.receiverName : '',
   //    receiverPhone: orderResponse.data.receiverPhone ? orderResponse.data.receiverPhone : '',
   //    address: orderResponse.data.address,
   //    courier: orderResponse.data.shipmentMethod ? orderResponse.data.shipmentMethod.name + " - " + orderResponse.data.shipmentMethod.packages.name : 'It is not spareparts order',

   //    initTotalQty: getProductResponse.data.totalQty,
   //    initAvailQty: getProductResponse.data.availableQty,
   //    initTotalItemOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalItem : 'It is not product service order',
   //    initTotalAvailOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalAvailable : 'It is not product service order',
   //    initTotalSentOutlet: addToCartResponse.merchantResponse.data ? addToCartResponse.merchantResponse.data[0].totalSent : 'It is not product service order',

   //    afterOrderTotalQty: detailProductAfterOrderResp.productDetailRes.data.totalQty,
   //    afterOrderTotalAvail: detailProductAfterOrderResp.productDetailRes.data.availableQty,
   //    afterOrderTotalItemOutlet: detailProductAfterOrderResp.respMerchant.data ? detailProductAfterOrderResp.respMerchant.data[0].totalItem : 'It is not product service order',
   //    afterOrderTotalAvailOutlet: detailProductAfterOrderResp.respMerchant.data ? detailProductAfterOrderResp.respMerchant.data[0].totalAvailable : 'It is not product service order',
   //    afterOrderTotalSentOutlet: detailProductAfterOrderResp.respMerchant.data ? detailProductAfterOrderResp.respMerchant.data[0].totalSent : 'It is not product service order',

   //    afterCancelTotalQty: detailProductAfterCancelResp.productDetailRes.data.totalQty,
   //    afterCancelTotalAvail: detailProductAfterCancelResp.productDetailRes.data.availableQty,
   //    afterCancelTotalItemOutlet: detailProductAfterCancelResp.respMerchant.data ? detailProductAfterCancelResp.respMerchant.data[0].totalItem : 'It is not product service order',
   //    afterCancelTotalAvailOutlet: detailProductAfterCancelResp.respMerchant.data ? detailProductAfterCancelResp.respMerchant.data[0].totalAvailable : 'It is not product service order',
   //    afterCancelTotalSentOutlet: detailProductAfterCancelResp.respMerchant.data ? detailProductAfterCancelResp.respMerchant.data[0].totalSent : 'It is not product service order',

   //    balancePoint: initPoint,
   //    usedPoint: usePointResponse.point ? usePointResponse.point : usePointResponse,
   //    poinAfterOrder: poinCustAfterOrderResp,
   //    pointAfterCancel: poinCustAfterCancelResp,

   //    usedCoupon: data.coupon,
   //    useCouponStatus: useCouponResponse.message
   // }

   // console.log(recapStatus, custOrderDetail);
   // //    // // const custDetail = await customerDashboard(page);
   // //    // // console.log(custDetail);
   // // const cekStockAfterOrder = await getProductDetail(page, '', productList.data.urlKey);
   // // console.log('Get PDP2 >>> ', cekStockAfterOrder);

   // //    let content = await contentPdf(productType,productList,orderResp);
   // //    console.log(content);
   // //    await generatePdf(content);
   // //    console.log('sukses');


   await browser.close();
})();