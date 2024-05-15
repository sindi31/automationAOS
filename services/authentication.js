import { homepageSelector, loginSelector } from "../constanta/selectorList.js";
import { responseUrl, timeCalc } from "../utils/baseService.js";


const login = async (page, email, password) => {
    // go to login Page
    let start = performance.now();
    const loginPage = (await page.$x(homepageSelector.loginMenu))[0];
    await Promise.all([
        loginPage.click(),
        page.waitForNavigation()
    ]);
    let checkLoginTypeResponse = '';
    let loginResponse = '';

    try {
        // login process
        await page.type(loginSelector.usernameField, email);
        const submitEmail = await page.waitForSelector(loginSelector.loginButton, { visible: true });

        await submitEmail.click();
        checkLoginTypeResponse = await responseUrl(page, 'check_login_type');

        if (checkLoginTypeResponse.status === 200) {
            const inputPassword = await page.waitForSelector(loginSelector.passwordField, { visible: true });
            await inputPassword.type(password);

            await page.click(loginSelector.loginButton);
            loginResponse = await responseUrl(page, 'https://api.astraotoshop.com/v1/authentication-service/public/login');

            await page.waitForTimeout(1000);

        } else {
            loginResponse: checkLoginTypeResponse
        }

        let end = performance.now();
        let duration = await timeCalc(end, start);

        return {
            response: loginResponse,
            duration: duration
        };

    } catch (error) {
        let end = performance.now();
        let duration = await timeCalc(end, start);
        loginResponse = error;
        return {
            response: loginResponse,
            duration: duration
        };
    }
};

const getPersonalData = async (page, userID, token) => {
    const fetchData = await fetch("https://api.astraotoshop.com/v1/member-service/public/point/"+userID, {
        "headers": {
          "accept": "application/json",
          "accept-language": "undefined",
          "authorization": "Bearer "+token,
          "content-type": "application/json",
          "sec-ch-ua": "\"Opera\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "Referer": "https://astraotoshop.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });

    let personalData = await fetchData.json();
    return {
        result: personalData,
        duration: 'not set'
    }
}
export { login, getPersonalData }