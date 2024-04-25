import oneFlowOrderCancel from "../index2.js";
import puppeteer from "puppeteer-extra";
import { sendMail, dateDifference } from "../utils/baseService.js";







const cancelBatalkanVA = (async () => {

    // const point = ['7000', 'Gunakan Semua', 'Gunakan Semua', '3000', '', ''];
    // const coupon = ['TESTING132', 'TESTING132', '', '', 'TESTING132', ''];
    // const paymentMethod = ['CIMB VA', 'BRI VA', 'Mandiri VA', 'BCA VA', 'BSI VA', 'Permata VA'];
    const point = ['Gunakan Semua',''];
    const coupon = ['','TESTING132'];
    const paymentMethod = ['Mandiri VA','BSI VA'];

    let dataFile = [];
    let dataFilePath = []
    let orderCancelationFilePath = []
    let startDate = new Date();

    for (let i = 0; i < paymentMethod.length; i++) {

        orderCancelationFilePath[i] = await oneFlowOrderCancel(paymentMethod[i], point[i], [coupon[i]]);
        dataFile[i] = orderCancelationFilePath[i].filename;
        dataFilePath[i] = orderCancelationFilePath[i].pdfFilePath;

    }
    let endDate = new Date();
    let dateDiff = await dateDifference(endDate, startDate);
    let timeExecution = { startDate, endDate, dateDiff };

    await sendMail(dataFile, dataFilePath, timeExecution);

})();