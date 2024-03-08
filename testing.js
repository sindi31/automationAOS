import config from "./constanta/config.js";

let couponUsed='TESTING132'
let pointAmount='5000'
let couponName = couponUsed === '' ? '-Tidak Menggunakan Kupon' : '-kupon=' + couponUsed;
let pointUsed = pointAmount === '' ? '-Tidak Menggunakan Poin' : '-poin=' + pointAmount;
let paymentMethod = 'BSI'

// pdfFilePath = 'document/pdf-download-page1-' + new Date().toJSON().slice(0, 10).replace(/-/g, '') +'T'+ new Date().getHours() + new Date().getMinutes() +new Date().getSeconds()+'.pdf';
let pdfFilePath = config.BASE_DIRECTORY + 'Automation-result-'  + new Date().toJSON().slice(0, 10) +'-'+ paymentMethod.replace("/", "") +

    pointUsed + couponName + '.pdf';

console.log(pdfFilePath)