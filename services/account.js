import config from "../constanta/config.js";

const checkPointHomepage = async (page) => {
    let url = await page.url();
    if (url != config.URL) {
        await page.goto(config.URL);
        // await page.goto(process.env.URL, {waitUntil: "networkiddle2"});

    }
    await page.waitForSelector(".sc-w647qe-0.dUWxkQ", {
        visible: true
    });
    const pointAfterOrder = await page.$eval(".sc-w647qe-0.dUWxkQ", el => el.textContent);
    // console.log(pointAfterOrder);
    return pointAfterOrder;

};

const customerDashboard = async (page) => {
    let url = await page.url();
    if (url != config.customerURL) {
        await page.goto(config.customerURL);
    }

    await page.waitForSelector(".sc-w647qe-0.ciRkDR", {
        visible: true
    });
    await page.waitForTimeout(2000);
    const custName = await page.$eval(".sc-w647qe-0.ciRkDR", el => el.textContent);
    const custPoin = await page.$eval(".sc-w647qe-0.dUWxkQ", el => el.textContent);
    const custMembership = await page.$eval(".sc-w647qe-0.jpxmvc", el => el.textContent);

    const customerDetail = {
        name : custName,
        point: custPoin,
        membership : custMembership
    };
    return customerDetail;

};

export {checkPointHomepage,customerDashboard};
