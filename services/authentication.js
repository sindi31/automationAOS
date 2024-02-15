import { homepageSelector, loginSelector } from "../constanta/selectorList.js";
import {responseUrl} from "../utils/baseService.js";


const login = async (page, email, password) => {
    // go to login Page
    const loginPage = (await page.$x(homepageSelector.loginMenu))[0];
    await Promise.all([
        loginPage.click(),
        page.waitForNavigation()
    ]);

    // login process
    await page.type(loginSelector.usernameField, email);
    const submitEmail = await page.waitForSelector(loginSelector.loginButton, { visible: true });

    await submitEmail.click();
    const checkLoginTypeResponse = await responseUrl(page, 'check_login_type');

    if (checkLoginTypeResponse.status === 200) {
        const inputPassword = await page.waitForSelector(loginSelector.passwordField, { visible: true });
        await inputPassword.type(password);

        await page.click(loginSelector.loginButton);
        const loginResponse = await responseUrl(page, 'https://api.astraotoshop.com/v1/authentication-service/public/login');

        await page.waitForTimeout(1000);
        return loginResponse;
    } else {
        return checkLoginTypeResponse;
    }
};

export default login;