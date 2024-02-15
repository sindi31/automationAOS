import { plpSelector, shortcut, productDetailPage, locationSelector } from "../constanta/selectorList.js";
import dotenv from "dotenv";
dotenv.config();
import puppeteer from 'puppeteer';
import { getCurrentLocation } from "../utils/baseService.js";
import config from "../constanta/config.js";

async function responseUrl(page, xhr) {
  let checkUrl = page.waitForResponse(
    (r) => r.request().url().includes(xhr) && r.request().method() != "OPTIONS"
  );
  let rawResponseUrl = await checkUrl;
  let responseUrl = await rawResponseUrl?.json();
  return responseUrl;
};

const getProductAfterProcess = async (urlKey, productType, detail) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const pages = await browser.pages();


  let newLocation = "";
  let respMerchant = "";
  if (productType === "Layanan Bengkel") {
    await page.goto(config.URL, { waitUntil: "networkidle2" });
    newLocation = await getCurrentLocation(page);
    await page.waitForTimeout(1000);
  }

  let newURL = await config.PRODUCT_URL_BASE.concat(urlKey);
  await page.goto(newURL,{waitUntil: "domcontentloaded"});
  let productDetailRes = await responseUrl(page, page.url().replace("https://astraotoshop.com/product/", "https://api.astraotoshop.com/v1/product-service/card/"));
  // await page.waitForTimeout(3000);

  
  // let merchantURL = "merchant?lat="+newLocation.latitude+"&long="+newLocation.longitude+"&productID="+detail;
  // console.log(merchantURL);

  if (productType === 'Layanan Bengkel') {
    const addToCart = await page.waitForXPath(productDetailPage.addToCartButton, { visible: true });
    await page.waitForTimeout(1000);
    await addToCart.click();
    // console.log('merchant');
    let merchantResp = await responseUrl(page, "merchant?lat=" + newLocation.latitude + "&long=" + newLocation.longitude + "&productID=" + detail);
    respMerchant = merchantResp;
    // console.log('merchant2');
  }

  await browser.close();

  return { productDetailRes, respMerchant };
}

const newGetProductAfterProcess = async (urlKey, productType,  browser,detail,newLocation) => {
  // const browser = await puppeteer.launch({ headless: false });
  const page2 = await browser.newPage();
  // const pages = await browser.pages();
  let respMerchant = "";
  // if (productType === "Layanan Bengkel") {
  //   await page.goto(process.env.URL, { waitUntil: "networkidle2" });
  //   newLocation = await getCurrentLocation(page);
  //   await page.waitForTimeout(1000);
  // }

  let newURL = await config.PRODUCT_URL_BASE.concat(urlKey);
  await page2.goto(newURL,{waitUntil: "domcontentloaded"});
  let productDetailRes = await responseUrl(page2, page2.url().replace("https://astraotoshop.com/product/", "https://api.astraotoshop.com/v1/product-service/card/"));
  // await page.waitForTimeout(3000);
  // let merchantURL = "merchant?lat="+newLocation.latitude+"&long="+newLocation.longitude+"&productID="+detail;
  // console.log(merchantURL);

  if (productType === 'Layanan Bengkel') {
    const addToCart = await page2.waitForXPath(productDetailPage.addToCartButton, { visible: true });
    await page2.waitForTimeout(1000);
    await addToCart.click();
    // console.log('merchant');
    let merchantResp = await responseUrl(page2, "merchant?lat=" + newLocation.latitude + "&long=" + newLocation.longitude + "&productID=" + detail);
    respMerchant = merchantResp;
    // console.log('merchant2');
  }

  await page2.close();

  return { productDetailRes, respMerchant };
}

const getProductDetail = async (page, productType) => {
  // process.env.PRODUCT_URL_BASE.concat(productSlug);
  if (productType === 'Homeservice') {
    const shortcutMenu = await page.waitForXPath(shortcut.homeservice);
    await shortcutMenu.click();
  } else if (productType === 'Suku Cadang') {
    const shortcutMenu = await page.waitForXPath(shortcut.sukuCadang);
    await shortcutMenu.click();
  } else {
    const shortcutMenu = await page.waitForXPath(shortcut.layananBengkel);
    await shortcutMenu.click();
  }

  // click first product shown
  const selectProduct = await page.waitForSelector(plpSelector.homeserviceProduct);
  await selectProduct.click();

  // //click product by parameterize productName XPath
  // const productName ="Voucher Shell Helix Astra Oil 0W20 SN+4 Ltr+Pemasangan (Oli untuk Mobil Bensin)"; //parameterize
  // const substringProduct = await productName.substring(0,50);
  // const productXPath = "//div[@class='sc-1crxk01-0 lkwwJy sc-dfsrp1-1 hRwfhN']//span[@class='sc-w647qe-0 hTvPqe'][contains(text(),".concat("'",substringProduct,"')]");
  // const shortcutt = await page.waitForXPath(productXPath);

  let url = await page.url();
  const reqURL = await page.url().replace("https://astraotoshop.com/product/", "https://api.astraotoshop.com/v1/product-service/card/");
  // console.log(reqURL);
  let productDetailRes = await responseUrl(page, reqURL);
  await page.waitForTimeout(1000);

  return productDetailRes;

};

const addtoCart = async (page, qty, productType, isBookingDate, latitude, longitude, productId) => {
  await page.waitForTimeout(1000);
  const addToCart = await page.waitForXPath(productDetailPage.addToCartButton, {
    visible: true
  });
  await addToCart.click();

  let merchantResponse = "";
  if (productType === 'Layanan Bengkel') {
    let merchantResp = await responseUrl(page, "merchant?lat=" + latitude + "&long=" + longitude + "&productID=" + productId);
    merchantResponse = merchantResp;
    // console.log(merchantResp);
  }

  await page.waitForTimeout(1000);
  const addQty = await page.waitForXPath(productDetailPage.addQtyCart, { visible: true })
  for (let i = 1; i < qty; i++) {
    // const add = (await page.$x("//button[normalize-space()='+']"))[0]
    await addQty.click();
  };

  if (isBookingDate) {
    const toggleBooking = await page.waitForXPath(productDetailPage.checkboxCart, { visible: true });
    if (isBookingDate == 'false') {
      await toggleBooking.click();
    }
  }
  //kurang else kalau pake bookingData, cari dulu caranya ya Siin!!

  //get Merchant
  // const selectMerchant= await page.waitForSelector(".sc-1crxk01-0.dBppZs");
  // await selectMerchant.click();
  // await selectMerchant.type("PEJATEN");
  // await page.waitForTimeout(1000);
  // await await page.keyboard.press('Enter');
  // await page.waitForTimeout(5000);


  const cartButton = await page.waitForXPath(productDetailPage.addToCart, { visible: true });
  await cartButton.click();

  let respAddToCart = await responseUrl(page, 'https://api.astraotoshop.com/v1/cart-service/cart');
  return { respAddToCart, merchantResponse };
}

export { getProductDetail, addtoCart, getProductAfterProcess, newGetProductAfterProcess }