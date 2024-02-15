import report from "puppeteer-report";
import puppeteer from 'puppeteer';
import dotenv from "dotenv";
dotenv.config();
import authentication from './authentication.js';
import { cekPoint, customerDashboard } from './account.js';
import { getProduct, addtoCart } from './product.js';
import { checklistProduct, usePoint, useCoupon } from './cart.js';
import checkout from './checkout.js';
import * as fs from 'fs';
import { cartPage, homepageSelector, locationSelector } from "./selectorList.js";
import responseUrl from "./baseService.js";
import contentPdf from "./templateHtmlNew.js";
import generatePdf from "./generatePdf.js";

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

   const login = await authentication(page, process.env.email, process.env.password);
   console.log('Login >>>', login.message);

   

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
   //cleansing data keranjang end

   // // // get location
   // // const getLocationIcon = await page.$(homepageSelector.getLocIcon);
   // // await Promise.all([
   // //    getLocationIcon.click(),
   // //    page.waitForNavigation({ waitUntil: "networkidle2" })
   // // ]);

   // // const loc = (await page.$x(locationSelector.jakartaSelatan))[0];
   // // await loc.click();
   // // const getLocationResponse = await responseUrl(page, "location?latitude=-6.257406049902196&longitude=106.85370663038196");
   // // if (getLocationResponse.status === 200) {
   // //    await page.waitForTimeout(1000);
   // //    const backToHome = (await page.$x(locationSelector.backButton))[0];
   // //    await backToHome.click();
   // //    console.log('getLocation >> success')
   // // };
   // // //get location end

   // // await page.waitForTimeout(3000);

   const product = ['Suku Cadang', 'Layanan Bengekel', 'Homeservice'];
   const productType= product[2];

   // const poinCust = await cekPoint(page);
   // console.log(poinCust);

   // // const custDetail = await customerDashboard(page);
   // // console.log(custDetail);

   const productList = await getProduct(page, productType);
   console.log('Get PDP >>> ', productList);

   if (productType === 'Suku Cadang') {
      const addCart = await addtoCart(page, process.env.QTY);
      console.log('Add to cart >>>', addCart);
   } else {
      const addCart = await addtoCart(page, process.env.QTY, process.env.isBookingDate);
      console.log('Add to cart >>>', addCart);
   }

   const goToCart = await checklistProduct(page);
   console.log(goToCart);
   await page.waitForTimeout(3000);

   if (process.env.isPoint === 'true') {
      const usePointCust = await usePoint(page, process.env.Point);
      console.log('usePoint >>>',usePointCust);
   };

   if (process.env.isKupon === 'true') {
      const useCouponCust = await useCoupon(page, process.env.Kupon);
      console.log(useCouponCust);
   }

   const orderResp = await checkout(page,process.env.payWith, productType);
   console.log(orderResp);

   let content = await contentPdf(productType,productList,orderResp);
   console.log(content);
   await generatePdf(content);
   console.log('sukses');
   // let coba = await html(productType,productList,checkoutCust);
   // // console.log(coba);
   // const date = new Date;
   // const path = productType.concat(",1.html");
   // const path2 = productType.concat(",2.pdf");

   // await fs.writeFileSync(path,coba);

   // const toString = await coba.replace("/`","/'");
   // console.log(toString);

   // await page.setContent();
   // await page.pdf({
   //    path: './headers.pdf',
   //    format: 'A4',
   //    printBackground: false,
   //    displayHeaderFooter: true,
   //    headerTemplate: `
   //    <span style="font-size: 12px;">
   //        This is a custom PDF for 
   //        <span class="poinCust">${login.status}</span> (<span class="url"></span>)
   //    </span>
   //    `,
   //    footerTemplate: `
   //    <span style="font-size: 12px;">
   //        Generated on: <span class="date"></span><br/>
   //        Pages <span class="pageNumber"></span> of <span class="totalPages"></span>
   //    </span>`,
   //    margin: {
   //        top: '110px',
   //        bottom: '100px'
   //    }
   // });

   // await page.pdf({path:'/aip.pdf', format:'A4'});

   await browser.close();
})();