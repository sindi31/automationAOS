import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    await page.goto('https://www.kai.id');
    await page.goto('https://booking.kai.id/auth/login');

    const xpathSelector = await page.waitForXPath("//input[@id='username']");
    await xpathSelector.type('sindiyuliawibowo31@gmail.com')

    const password = await page.waitForXPath("//input[@id='password']");
    await password.type('Sinyul173120')

    await new Promise(resolve => setTimeout(resolve, 20000));

    const login = await page.waitForXPath("//button[@id='btnLogin']");
    await login.click();
    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.goto('https://www.kai.id/')

    const origin = await page.waitForXPath("//span[@id='select2-origination2-container']");
    await origin.click();
    (await page.waitForXPath("//input[@role='textbox']")).type('Pasar Senen');
    await page.waitForTimeout(500)
    await page.keyboard.press('Enter')

    const tujuan = await page.waitForXPath("//span[@id='select2-destination2-container']");
    await tujuan.click();
    (await page.waitForXPath("//input[@role='textbox']")).type('Purwosari');
    await page.waitForTimeout(500)
    await page.keyboard.press('Enter');

    await page.waitForTimeout(10000)
    const cari = await page.waitForXPath("//input[@id='submittrain']");
    await cari.click()
    await page.waitForTimeout(2000)

    // const bengawan = await page.waitForSelector("/html[1]/body[1]/div[1]/div[1]/div[1]/div[3]/div[2]/div[1]/form[1]/a[1]/div[1]/div[3]/div[1]/div[2]/div[1]");

    let isEmptyCart = await page.$eval("form[id='data0'] div[class='price']", () => true).catch(() => false);
    console.log(isEmptyCart)
    while (isEmptyCart == false) {
        await page.reload({ waitUntil: ["networkidle0"] });
        isEmptyCart = await page.$eval("form[id='data0'] div[class='price']", () => true).catch(() => false);
        console.log(isEmptyCart)

    }
    const pesan = await page.waitForSelector("form[id='data0'] div[class='price']");
    await pesan.click()
    await page.waitForTimeout(1000);

    const checlist = await page.waitForXPath("//input[@id='cbCopy']");
    await checlist.click();

    const name = await page.waitForXPath("//input[@id='penumpang_nama1']");
    await name.type('SINDI YULIA WIBOWO');

    const nik = await page.waitForXPath("//input[@id='penumpang_notandapengenal1']");
    await nik.type('3311037107960001')

    const cek2 = await page.waitForXPath("//input[@id='setuju']");
    await cek2.click();





    // await browser.close();

})();