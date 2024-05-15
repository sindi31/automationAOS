import { cartPage, homepageSelector, locationSelector } from "../constanta/selectorList.js";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import nodemailer from "nodemailer";
import config from "../constanta/config.js";
import fs from 'fs';
import * as XLSX from 'xlsx';


const responseUrl = async (page, xhr) => {
    let checkUrl = page.waitForResponse(
        (r) => r.request().url().includes(xhr) && r.request().method() != "OPTIONS"
    );
    let rawResponseUrl = await checkUrl;
    let responseUrl = await rawResponseUrl?.json();
    return responseUrl;
};


const cleansingCart = async (page) => {
    let start = performance.now();
    try {
        await page.goto(config.cartURL);
        await page.waitForTimeout(1000);

        let isEmptyCart = await page.$eval(cartPage.emptyCart, () => true).catch(() => false);
        while (isEmptyCart == false) {
            const hapusProductCart = await page.waitForSelector(cartPage.deleteProduct, { visible: true });
            await hapusProductCart.click();
            await page.waitForTimeout(1000);
            isEmptyCart = await page.$eval(cartPage.emptyCart, () => true).catch(() => false);
        }
        // await page.click(cartPage.backButton);
        // await page.waitForNavigation();

        let end = performance.now();
        let duration = await timeCalc(end,start);
        return {
            status: 200,
            message: 'Successfully cleansing product in cart',
            duration: duration
        };
    } catch (error) {
        let end = performance.now();
        let duration = await timeCalc(end,start);
        return {
            status: 500,
            message: 'Something went wrong',
            duration: duration,
            errorMsg: error
        };
    }


};

const getLocation = async (page) => {

    const loc = (await page.$x(locationSelector.jakartaSelatan))[0];
    await loc.click();
    const getLocationResponse = await responseUrl(page, "location?latitude=-6.257406049902196&longitude=106.85370663038196");
    if (getLocationResponse.status === 200) {
        await page.waitForTimeout(1000);
        const backToHome = (await page.$x(locationSelector.backButton))[0];
        await backToHome.click();
        // console.log('getLocation >> success')
    };
    // console.log('Get Location >>>', getLocationResponse);
}

const getCurrentLocation = async (page) => {

    let start = performance.now();

    await page.goto("chrome://settings/content/siteDetails?site=https%3A%2F%2Fastraotoshop.com");
    await page.waitForTimeout(1000);
    await page.click("aria/Location");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.goto(config.URL, { waitUntil: "networkidle2" });

    const getLocationIcon = await page.waitForSelector(homepageSelector.getLocIcon, { visible: true });
    await Promise.all([
        getLocationIcon.click(),
        page.waitForNavigation({ waitUntil: "networkidle2" })
    ])
    await page.waitForTimeout(1000);

    const useCurrentLoc = await page.waitForXPath("//button[normalize-space()='Gunakan lokasi saya saat ini']");
    await useCurrentLoc.click();

    await page.waitForTimeout(1000)

    const localStorage = await page.evaluate(() => localStorage.getItem('@location'));
    let repLocation = localStorage.replace(/(\w+):/g, `"$1":`);
    let location = JSON.parse(repLocation);
    let latitude = location.latitude;
    let longitude = location.longitude;


    const useCurrentLoc2 = await page.waitForXPath("//button[normalize-space()='Gunakan lokasi saya saat ini']");
    await useCurrentLoc2.click();
    const getLocationResponse = await responseUrl(page, "location?latitude=" + latitude + "&longitude=" + longitude);
    // console.log(getLocationResponse);
    await page.waitForTimeout(1000);

    if (getLocationResponse.status === 200) {
        await page.waitForTimeout(1000);
        const backToHome = (await page.$x(locationSelector.backButton))[0];
        await backToHome.click();
    }
    let end = performance.now();
    let duration = await timeCalc(end, start);

    return { getLocationResponse, latitude, longitude, duration }
}

const dateDifference = async (end, start) => {
    let diff = end - start;
    let minutes = Math.floor(diff / 60000);
    let seconds = ((diff % 60000) / 1000).toFixed(0);

    let result = `${minutes} minutes and ${seconds} seconds`;
    return result;
}

const sendMail = async (dataFile, dataFilePath, timeExecution) => {
    nodemailer.createTestAccount((err, account) => {
        let bodyHtml =
            `
        <!DOCTYPE html>
        <html>
           <head>
           </head>
           <body>
              <p><i>This is an automatic message for the Astraotoshop automation test with detail: </i></p>
              <table>
                 <tr>
                    <td style="width: 10%;">Start </td>
                    <td>: ${timeExecution.startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" })} WIB </td>
                 </tr>
                 <tr>
                    <td>End </td>
                    <td>: ${timeExecution.endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" })} WIB </td>
                 </tr>
                 <tr>
                    <td>Duration</td>
                    <td>: ${timeExecution.dateDiff.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" })}</td>
                 </tr>
              </table>
              <p><b>PDF documentation attached</b></p>
              <p>Thank you 😊</p>
           </body>
        </html>

        `
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use SSL
            auth: {
                user: 'sindi.wibowo31@gmail.com', //smtp user
                pass: 'dohb flpg jtek ugmi' //smtp password
            }
        });

        let arrayAttach = [];
        for (let i = 0; i < dataFile.length; i++) {
            arrayAttach[i] = {
                filename: dataFile[i],
                path: dataFilePath[i]
            }
        }


        let mailOptions = {
            from: 'sindi.wibowo31@gmail.com',
            to: 'nakana.lili31@gmail.com',
            cc: '',
            subject: 'AOS Test Report ',
            // text: 'Automate email for geckoboard report direct to you from Medvine Bot  🎉',
            // html: '<b>Automate email for geckoboard report  direct to you from Medvine Bot  🎉</b>',
            html: bodyHtml,
            attachments: arrayAttach
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // fs.unlinkSync(filename); // delete file when successful sendmail
            console.log('Message sent: %s', info.messageId);
        });
    });
}

const readExcelFile = async (fileName) => {
    // Read the Excel file
    const fileContent = fs.readFileSync(fileName);
    const workbook = XLSX.read(fileContent, { type: 'buffer' });

    // Assuming there's only one sheet in the Excel file
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);


    let scenario = [];
    let qty = [];
    let urlKeySukuCadang = [];
    let urlKeyLayananBengkel = [];
    let urlKeyHomeservice = [];
    let point = [];
    let coupon = [];
    let paymentMethod = [];


    for (let index = 0; index < jsonData.length; index++) {
        scenario[index] = jsonData[index].scenario ? jsonData[index].scenario.toString() : '';
        qty[index] = jsonData[index].qty ? jsonData[index].qty.toString() : '';
        urlKeySukuCadang[index] = jsonData[index].urlKey_SK ? jsonData[index].urlKey_SK.toString() : '';
        urlKeyLayananBengkel[index] = jsonData[index].urlKey_LB ? jsonData[index].urlKey_LB.toString() : '';
        urlKeyHomeservice[index] = jsonData[index].urlKey_HM ? jsonData[index].urlKey_HM.toString() : '';
        point[index] = jsonData[index].pointAmount ? jsonData[index].pointAmount.toString() : '';
        coupon[index] = jsonData[index].couponName ? jsonData[index].couponName : '';
        paymentMethod[index] = jsonData[index].paymentMethod ? jsonData[index].paymentMethod : '';
    }

    // console.log(point);
    return {scenario,qty,urlKeySukuCadang,urlKeyLayananBengkel,urlKeyHomeservice, point, coupon, paymentMethod };
}

const timeCalc= async (end,start) => {
    let diff = (end-start)/1000;
    let roundDiff = diff.toFixed(2);

    return roundDiff;
}
export { responseUrl, cleansingCart, getLocation, getCurrentLocation, dateDifference, sendMail, readExcelFile, timeCalc }