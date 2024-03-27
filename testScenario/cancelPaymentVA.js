import oneFlowOrderCancel from "../index2.js";
import puppeteer from "puppeteer-extra";
import { sendMail, dateDifference } from "../utils/baseService.js";







const cancelBatalkanVA = (async () => {

    const point = ['5000', 'Gunakan Semua', 'Gunakan Semua', '3000', '', ''];
    const coupon = ['TESTING132', 'TESTING132', '', '', 'TESTING132', ''];
    const paymentMethod = ['CIMB VA', 'BRI VA', 'Mandiri VA', 'BCA VA', 'BSI VA', 'Permata VA'];

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

    console.log('start >>', startDate)
    console.log('end >>', endDate)
    console.log('duration>>', dateDiff)


    // console.log('return  data email>>>',dataEmail)
    // console.log('return path>>', dataEmailPath);

    await sendMail(dataFile, dataFilePath);

})();