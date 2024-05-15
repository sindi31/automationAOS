// import puppeteer from "puppeteer-extra";
import { sendMail, dateDifference, readExcelFile } from "../utils/baseService.js";
import oneFlowOrderCancel from "../indexNew.js";


const newScenario = (async () => {

    let inputData = await readExcelFile('../scenario_testing.xlsx');

    const scenario = inputData.scenario;
    const qty = inputData.qty;
    const urlKeySukuCadang = inputData.urlKeySukuCadang;
    const urlKeyLayananBengkel = inputData.urlKeyLayananBengkel;
    const urlKeyHomeservice = inputData.urlKeyHomeservice;
    const paymentMethod = inputData.paymentMethod;
    const point = inputData.point;
    const coupon = inputData.coupon;



    let dataFile = [];
    let dataFilePath = []
    let orderCancelationFilePath = []
    let startDate = new Date();

    for (let i = 0; i < scenario.length; i++) {

        orderCancelationFilePath[i] = await oneFlowOrderCancel(qty[i], urlKeySukuCadang[i], urlKeyLayananBengkel[i], urlKeyHomeservice[i], paymentMethod[i], point[i], coupon[i]);
        dataFile[i] = orderCancelationFilePath[i].filename;
        dataFilePath[i] = orderCancelationFilePath[i].pdfFilePath;

    }
    let endDate = new Date();
    let dateDiff = await dateDifference(endDate, startDate);
    let timeExecution = { startDate, endDate, dateDiff };

    await sendMail(dataFile, dataFilePath, timeExecution);

})();