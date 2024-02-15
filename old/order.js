import puppeteer from 'puppeteer';
import dotenv from "dotenv";
dotenv.config();

async function waiting(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
};
async function responseUrl(page, xhr) {
  let checkUrl = page.waitForResponse(
    (r) => r.request().url().includes(xhr) && r.request().method() != "OPTIONS"
  );
  let rawResponseUrl = await checkUrl;
  let responseUrl = await rawResponseUrl?.json();
  return responseUrl;
};

const login = async (page, email, password) => {
  const loginPage = (await page.$x("//div[@class='sc-ysqdlt-3 NsQWJ']//div[4]//span[1]//*[name()='svg']"))[0];
  await Promise.all([
    loginPage.click(),
    page.waitForNavigation()
  ]);

  try {
    await page.type('.sc-1auyczi-2.cxACAK.sc-1uj1rn4-2.gFJWwS', email);
    await page.click('.sc-1nihjkh-2.VYvtK.sc-15dd0e1-0.dgredN');

    let checkLogin = await responseUrl(page, 'check_login_type');
    console.log(checkLogin);

    await waiting(1000);

    await page.type('.sc-1auyczi-2.cxACAK.sc-1uj1rn4-2.gFJWwS', password);
    await page.click('.sc-1nihjkh-2.VYvtK.sc-15dd0e1-0.dgredN');

  } catch (error) {
    console.log('Yah, gagal T_T', error)
  }


  await page.waitForSelector(".sc-ysqdlt-0.uvLpE div", { visible: true });
  const menus = await page.$$eval(".sc-ysqdlt-0.uvLpE div p", (menu) => {
    return menu.map(x => x.textContent)
  });

  const lastMenu = menus[menus.length - 1];
  let loginStatus = "";

  if (lastMenu == 'Akun') {
    loginStatus = 'success';
  } else {
    loginStatus = 'failed';
  }

  return loginStatus;

};

const getProduct = async (page) => {
  await page.waitForXPath("//label[normalize-space()='Home Service']");
  const homeservicePLP = (await page.$x("//label[normalize-space()='Home Service']"))[0]
  await homeservicePLP.click();

  await page.waitForXPath("//div[@class='sc-1crxk01-0 lkwwJy sc-dfsrp1-1 hRwfhN']//img[@alt='Voucher Shell Helix Astra Oil 10W30 4 Ltr + Pemasangan (Oli untuk Mobil Bensin)']");
  const productHome = (await page.$x("//div[@class='sc-1crxk01-0 lkwwJy sc-dfsrp1-1 hRwfhN']//img[@alt='Voucher Shell Helix Astra Oil 10W30 4 Ltr + Pemasangan (Oli untuk Mobil Bensin)']"))[0]
  await productHome.click();

  let url = await page.url();
  let reqURL = await page.url().replace("https://astraotoshop.com/product/", "https://api.astraotoshop.com/v1/product-service/card/");
  let productDetailRes = await responseUrl(page, reqURL);
  // console.log(productDetailRes);
  return productDetailRes.message;

}

const addtoCart = async (page, qty, isBooking) => {
  const addToCart = await page.waitForSelector('.sc-1nihjkh-2.VYvtK.sc-ysqdlt-13.jJmnKl');
  await addToCart.click();

  await waiting(2000);
  await page.waitForXPath("//button[normalize-space()='+']", { visible: true })
  for (let i = 1; i < process.env.QTY; i++) {
    const add = (await page.$x("//button[normalize-space()='+']"))[0]
    add.click();
  };

  await page.waitForXPath("//div[@class='sc-14l7xyx-3 dbTlbf']", { visible: true });
  if (process.env.isBooking == 'false') {

    const bookingDate = (await page.$x("//div[@class='sc-14l7xyx-3 dbTlbf']"))[0];
    bookingDate.click();
  }
  await waiting(1000);
  //kurang else kalau pake bookingData, cari dulu caranya ya Siin!!

  const addCart = (await page.$x("//button[@id='add-cart-button']"))[0];
  await addCart.click();
  let addToCartResponse = await responseUrl(page, 'https://api.astraotoshop.com/v1/cart-service/cart');
  // console.log(addToCartResponse);
  return addToCartResponse.message;
}

const cart = async (page, isPoin, isKupon) => {
  await waiting(1000);
  await page.waitForXPath("//div[@class='sc-pk5e3p-0 fQUczW']//button[3]//div[1]//span[1]//*[name()='svg']//*[name()='rect' and contains(@opacity,'0.01')]", { visible: true });
  const iconCart = (await page.$x("//div[@class='sc-pk5e3p-0 fQUczW']//button[3]//div[1]//span[1]//*[name()='svg']//*[name()='rect' and contains(@opacity,'0.01')]"))[0];
  await iconCart.click();

  await waiting(1000);
  const checklist = await page.waitForSelector(".sc-14l7xyx-0.jXJvcI", { visible: true });
  await page.click('.sc-14l7xyx-0.jXJvcI');
  await waiting(3000);

  const point = await page.$(".sc-w647qe-0.hFqPFw")
  const balancePoint = await (await point.getProperty('textContent')).jsonValue();
  console.log('Poin Balance : ', balancePoint);

  if (process.env.isPoin == 'true') {
    await page.waitForSelector(".sc-1auyczi-2.gXBdsu.sc-1uj1rn4-2.gFJWwS", { visible: true });
    await page.type(".sc-1auyczi-2.gXBdsu.sc-1uj1rn4-2.gFJWwS", process.env.usePoin);
    await page.click(".sc-w647qe-0.iggsXM");
    await waiting(3500);
  }

  if (process.env.isKupon == 'true') {
    const coupon = (await page.$x("//input[@placeholder='Tuliskan kupon diskon']"))[0];
    await coupon.type(process.env.Kupon);
    const useCoupon = (await page.$x("//span[@class='sc-w647qe-0 iggsXM']"))[1];
    await useCoupon.click();
    await waiting(6000);
  }
  return 'ready to checkout >>>'
}

const checkoutPage = async (page) => {
  await page.waitForSelector(".sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-5.eYOmyF", {
    visible: true
  })
  await Promise.all([page.click(".sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-5.eYOmyF"), page.waitForNavigation]);
  await waiting(2000);

  await page.waitForXPath("//span[@class='sc-w647qe-0 UeRhO']", {
    visible: true
  })
  const listPayment = (await page.$x("//span[@class='sc-w647qe-0 UeRhO']"))[0]
  await listPayment.click();
  await waiting(2000);

  await page.waitForXPath("//span[normalize-space()='Mandiri VA']", { visible: true });
  const paymentMethod = (await page.$x("//span[normalize-space()='Mandiri VA']"))[0]
  await paymentMethod.click();
  await waiting(2000);

  //klik Gunakan
  await page.waitForSelector("#add-cart-button", { visible: true });
  await Promise.all([
    page.click("#add-cart-button"),
    page.waitForNavigation
  ]);
  await waiting(6000);

  const usePaymentMethod = await page.waitForSelector(".sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-5.jgbicr", { visible: true });
  await Promise.all([usePaymentMethod.click(), page.waitForNavigation]);
  await waiting(10000);

  const message = await page.$eval(".sc-w647qe-0.fgurNo", el => el.textContent);
  if (message == 'Hore pesanan telah dibuat! Yuk bayar pesananmu sekarang!') {
    await page.click(".sc-w647qe-0.gNzNfs");
    await waiting(3000);
    const pendingMsg = await page.$eval(".sc-w647qe-0.dBSmKM", el => el.textContent);
    await waiting(1000);
    if (pendingMsg == 'Lakukan pembayaran') {
      let orderData2 = await page.$$eval(".sc-1crxk01-0.iEyndt span", (data2) => {
        return data2.map(x => x.textContent);
      });
      let customerOrder = {
        nomorPesanan: orderData2[1].replace(/\n/g, ""),
        tanggalPembelian: orderData2[5],
        jumlahVoucher: orderData2[7],
        subtotal: orderData2[9],
        penggunaanPoin: orderData2[11],
        grandTotal: orderData2[13]
      };
      return customerOrder;
      // console.log(customerOrder);
    }
  }

}

const cekPoint = async (page) => {
  await page.goto(process.env.URL);
  await page.waitForSelector(".sc-w647qe-0.dUWxkQ", {
    visible: true,
    timeout : 2000
  });
  const pointAfterOrder = await page.$eval(".sc-w647qe-0.dUWxkQ", el => el.textContent);
  // console.log(pointAfterOrder);
  return pointAfterOrder;

}

// async function homeservice() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: ['--start-maximized']
//   });
//   const page = await browser.newPage();
//   await page.goto(process.env.URL);
//   await waiting(3000);

//   // async function setSelectVal(sel, val) {
//   //     page.evaluate((data) => {
//   //         return document.querySelector(data.sel).value = data.val
//   //     }, {sel, val})
//   // };

//   const loginPage = (await page.$x("//div[@class='sc-ysqdlt-3 NsQWJ']//div[4]//span[1]//*[name()='svg']"))[0];
//   await Promise.all([loginPage.click(), page.waitForNavigation()]);
//   try {
//     await page.type('.sc-1auyczi-2.cxACAK.sc-1uj1rn4-2.gFJWwS', process.env.email);
//     await page.click('.sc-1nihjkh-2.VYvtK.sc-15dd0e1-0.dgredN');

//     let checkLogin = await responseUrl(page, 'check_login_type');
//     console.log(checkLogin);

//     await waiting(1000);

//     await page.type('.sc-1auyczi-2.cxACAK.sc-1uj1rn4-2.gFJWwS', process.env.password);
//     await page.click('.sc-1nihjkh-2.VYvtK.sc-15dd0e1-0.dgredN');
//     await waiting(1000);
//   } catch (error) {
//     console.log('Yah, gagal T_T', error)
//   }

//   const menus = await page.$$eval(".sc-ysqdlt-0.uvLpE div p", (menu) => {
//     return menu.map(x => x.textContent)
//   });
//   const lastMenu = menus[menus.length - 1];
//   if (lastMenu == 'Akun') {
//     console.log('Login ->> OK');
//   }
//   await waiting(3000);

//   //go to homeservice list
//   const homeservicePLP = (await page.$x("//label[normalize-space()='Home Service']"))[0]
//   await homeservicePLP.click();
//   await waiting(4000);
//   //go to Homeservice Product
//   const productHome = (await page.$x("//div[@class='sc-1crxk01-0 lkwwJy sc-dfsrp1-1 hRwfhN']//img[@alt='Voucher Shell Helix Astra Oil 10W30 4 Ltr + Pemasangan (Oli untuk Mobil Bensin)']"))[0]
//   await productHome.click();

//   console.log('here');
//   let url = await page.url();
//   let slug = await page.url().replace("https://astraotoshop.com/product/", "");

//   const addToCart = await page.waitForSelector('.sc-1nihjkh-2.VYvtK.sc-ysqdlt-13.jJmnKl');
//   // await page.click('.sc-1nihjkh-2.VYvtK.sc-ysqdlt-13.jJmnKl');
//   await addToCart.click();
//   await waiting(2500);

//   console.log('input qty');

//   for (let i = 1; i < process.env.QTY; i++) {
//     const add = (await page.$x("//button[normalize-space()='+']"))[0]
//     add.click();
//   }
//   await waiting(1000);

//   if (process.env.isBooking == 'false') {
//     const bookingDate = (await page.$x("//div[@class='sc-14l7xyx-3 dbTlbf']"))[0];
//     bookingDate.click();
//   }
//   await waiting(1000);
//   //kurang else kalau pake bookingData, cari dulu caranya ya Siin!!

//   const addCart = (await page.$x("//button[@id='add-cart-button']"))[0];
//   await addCart.click();
//   await waiting(2500);

//   //Go to Keranjang  
//   const cart = (await page.$x("//div[@class='sc-pk5e3p-0 fQUczW']//button[3]//div[1]//span[1]//*[name()='svg']//*[name()='rect' and contains(@opacity,'0.01')]"))[0];
//   await cart.click();
//   await waiting(2500);
//   await page.click('.sc-14l7xyx-0.jXJvcI');
//   await waiting(3000);

//   const point = await page.$(".sc-w647qe-0.hFqPFw")
//   const balancePoint = await (await point.getProperty('textContent')).jsonValue();
//   console.log('Poin Balance : ', balancePoint);

//   if (process.env.isPoin == 'true') {
//     await page.type('.sc-1auyczi-2.gXBdsu.sc-1uj1rn4-2.gFJWwS', process.env.usePoin);
//     await page.click('.sc-w647qe-0.iggsXM');
//     await waiting(3500);
//   }

//   if (process.env.isKupon == 'true') {
//     const coupon = (await page.$x("//input[@placeholder='Tuliskan kupon diskon']"))[0];
//     await coupon.type(process.env.Kupon);
//     const useCoupon = (await page.$x("//span[@class='sc-w647qe-0 iggsXM']"))[1];
//     await useCoupon.click();
//     await waiting(6000);
//   }
//   //Go to Checkout Page
//   await Promise.all([page.click('.sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-5.eYOmyF'), page.waitForNavigation]).then(() => console.log('Yeay, berhasil masuk halaman Checkout ^_^'));
//   await waiting(8000);

//   const listPayment = (await page.$x("//span[@class='sc-w647qe-0 UeRhO']"))[0]
//   await listPayment.click();
//   await waiting(2000);

//   const paymentMethod = (await page.$x("//span[normalize-space()='Mandiri VA']"))[0]
//   await paymentMethod.click();
//   await waiting(1000);

//   await page.click("#add-cart-button");
//   await waiting(5000);

//   const usePaymentMethod = await page.waitForSelector(".sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-5.jgbicr", { visible: true });
//   await Promise.all([usePaymentMethod.click(), page.waitForNavigation]);
//   await waiting(10000);
//   const message = await page.$eval(".sc-w647qe-0.fgurNo", el => el.textContent);
//   if (message == 'Hore pesanan telah dibuat! Yuk bayar pesananmu sekarang!') {
//     await page.click(".sc-w647qe-0.gNzNfs");
//     await waiting(3000);
//     const pendingMsg = await page.$eval(".sc-w647qe-0.dBSmKM", el => el.textContent);
//     await waiting(1000);
//     if (pendingMsg == 'Lakukan pembayaran') {
//       let orderData2 = await page.$$eval(".sc-1crxk01-0.iEyndt span", (data2) => {
//         return data2.map(x => x.textContent);
//       });
//       let customerOrder = {
//         nomorPesanan: orderData2[1].replace(/\n/g, ""),
//         tanggalPembelian: orderData2[5],
//         jumlahVoucher: orderData2[7],
//         subtotal: orderData2[9],
//         penggunaanPoin: orderData2[11],
//         grandTotal: orderData2[13]
//       };
//       console.log(customerOrder);
//     }
//   }
//   const backButton = await page.waitForSelector(".sc-rq82e3-0.bYIQff");
//   await backButton.click();
//   await waiting(3000);
//   const beranda = await page.waitForSelector(".sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-7.ccWaen");
//   await beranda.click();
//   await page.waitForSelector(".sc-w647qe-0.dUWxkQ", { visible: true });
//   const pointAfterOrder = await page.$eval(".sc-w647qe-0.dUWxkQ", el => el.textContent);
//   console.log(pointAfterOrder);

//   const historyOrderButton = (await page.$x("//div[@class='sc-ysqdlt-3 NsQWJ']//div[3]"))[0];
//   await historyOrderButton.click();

//   // await page.evaluate(() => {
//   //     const xpath = '//*[@class="sc-1crxk01-0 iCxTTv"]//button[contains(text(), "3240503276")]';
//   //     const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

//   //     result.iterateNext().click();
//   // });
//   const backToOrderHistory = await page.waitForSelector(".sc-1crxk01-0.cFnRvF.sc-8qf7tk-0.gnNvRF");
//   await backToOrderHistory.click();
//   await waiting(3000);
//   const batalkanPesanan = await page.waitForSelector(".sc-36283v-2.kOHPfa.sc-1xh0nyi-2.fhaDzG");
//   await batalkanPesanan.click();

//   const konfirmasiCancel = await page.waitForSelector(".sc-1nihjkh-2.VYvtK.sc-1xh0nyi-3.eUqFMC");
//   await Promise.all([
//     konfirmasiCancel.click(),
//     page.waitForNavigation,
//     console.log('Pesanan berhasil dibatalkan')
//   ]);
//   await waiting(3000);
//   console.log('checkpoin');
//   const backAgain = await page.waitForSelector(".sc-rq82e3-0.bYIQff");
//   await backAgain.click();
//   await waiting(3000);

//   const beranda2 = (await page.$x("//*[name()='rect' and contains(@opacity,'0.01')]"))[0];
//   await beranda2.click();
//   await page.waitForSelector(".sc-w647qe-0.dUWxkQ", { visible: true });
//   const pointAfterCancel = await page.$eval(".sc-w647qe-0.dUWxkQ", el => el.textContent);
//   console.log(pointAfterCancel);

//   let selisihPoint = Number(pointAfterCancel.replace(/\./g, "")) - Number(pointAfterOrder.replace(/\./g, ""));


//   if (selisihPoint == Number(process.env.usePoin)) {
//     console.log('sesuai');
//   } else {
//     console.log('tidak sesuai');
//   }

//   await browser.close();
// }

async function orderHandler() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  await page.goto(process.env.URL);

  const loginDulu = await login(page, process.env.email, process.env.password);
  console.log('Login >>>', loginDulu);

  const productList = await getProduct(page);
  console.log('Get PDP >>> ', productList);

  const addToCart = await addtoCart(page, process.env.QTY, process.env.isBooking);
  console.log('Add to Cart >>>', addToCart);

  const cartPage = await cart(page, process.env.isPoin, process.env.isKupon);
  console.log(cartPage);

  const checkout = await checkoutPage(page);
  console.log(checkout);

  const point1 = await cekPoint(page);
  console.log("Point Setelah Order >>> ",point1);

  await waiting(3000);
  await browser.close();


};

orderHandler();