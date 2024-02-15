import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";


puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: '8c02307b7f0c2cf19897de106561f6ab' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
        },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    }));


const solveCaptcha = async (page) => {

    await page.solveRecaptchas();
}

export default solveCaptcha