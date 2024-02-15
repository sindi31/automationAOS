import { cartPage, homepageSelector, locationSelector } from "../constanta/selectorList.js";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import nodemailer from "nodemailer";
import config from "../constanta/config.js";

const responseUrl = async (page, xhr) => {
    let checkUrl = page.waitForResponse(
        (r) => r.request().url().includes(xhr) && r.request().method() != "OPTIONS"
    );
    let rawResponseUrl = await checkUrl;
    let responseUrl = await rawResponseUrl?.json();
    return responseUrl;
};


const cleansingCart = async (page) => {
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
        await page.click(cartPage.backButton);
        await page.waitForNavigation();

        return {
            status: 200,
            message: 'Successfully cleansing product in cart'
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Something went wrong',
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

    await page.goto("chrome://settings/content/siteDetails?site=https%3A%2F%2Fastraotoshop.com");
    await page.waitForTimeout(2000);
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

    await page.waitForTimeout(3000)

    const localStorage = await page.evaluate(() => localStorage.getItem('@location'));
    let repLocation = localStorage.replace(/(\w+):/g, `"$1":`);
    let location = JSON.parse(repLocation);
    let latitude = location.latitude;
    let longitude = location.longitude;
    

    const useCurrentLoc2 = await page.waitForXPath("//button[normalize-space()='Gunakan lokasi saya saat ini']");
    await useCurrentLoc2.click();
    const getLocationResponse = await responseUrl(page, "location?latitude=" + latitude + "&longitude=" + longitude);
    // console.log(getLocationResponse);
    await page.waitForTimeout(2000);

    if (getLocationResponse.status === 200) {
        await page.waitForTimeout(1000);
        const backToHome = (await page.$x(locationSelector.backButton))[0];
        await backToHome.click();
    }

    return { getLocationResponse, latitude, longitude }
}

const dateDifference = async (end, start) => {
    let diff = end - start;
    let minutes = Math.floor(diff / 60000);
    let seconds = ((diff % 60000) / 1000).toFixed(0);

    let result = `${minutes} minutes and ${seconds} seconds`;
    return result;
}

const sendMail = async (filename, filePath) => {
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use SSL
            auth: {
                user: 'sindi.wibowo31@gmail.com', //smtp user
                pass: 'dohb flpg jtek ugmi' //smtp password
            }
        });

        // let arrayAttach = [];
        // for (let i = 0; i < filename.length; i++) {
        //     arrayAttach[i] = {
        //         filename: filename,
        //         path: filePath
        //     }
        // }
        // console.log(arrayAttach)


        let mailOptions = {
            from: 'sindi.wibowo31@gmail.com',
            to: 'nakana.lili31@gmail.com',
            cc: '',
            subject: 'AOS Test Report ' + ' 🎉',
            text: 'Automate email for geckoboard report direct to you from Medvine Bot  🎉',
            html: '<b>Automate email for geckoboard report  direct to you from Medvine Bot  🎉</b>',
            attachments: [
                {
                    filename: filename,
                    path: filePath,
                }
                // },
                // {
                //     filename: filename[1],
                //     path: filePath[1],
                // }
            ]
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

export { responseUrl, cleansingCart, getLocation, getCurrentLocation, dateDifference, sendMail }