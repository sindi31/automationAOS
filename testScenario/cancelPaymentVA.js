import oneFlowOrderCancel from "../index2.js";
import puppeteer from "puppeteer-extra";

const cancelBatalkanVA = (async() => {

    const point = ['5000','Gunakan Semua','Gunakan Semua','3000',''];
    const coupon = ['TESTING132','TESTING132','','','TESTING132'];
    const paymentMethod =['CIMB VA','BRI VA','Mandiri VA', 'BCA VA','BSI VA'];
    let orderCancelation =[];

    for (let i = 0; i < paymentMethod.length; i++) {
        orderCancelation[i] = await oneFlowOrderCancel(paymentMethod[i],point[i],[coupon[i]]);

    }

    console.log(orderCancelation);
    await sendMail(filename, pdfFilePath);

})();