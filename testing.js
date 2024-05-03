// import config from "./constanta/config.js";
// import * as fs from 'fs';
// import { generatePdf } from "./utils/generatePdf.js";
// import getHtmlData from "./html/generateHtml.js";
// import decryptProcess from "./utils/decrypt.js";
// import * as XLSX from 'xlsx/xlsx.mjs';

// // let couponUsed = 'TESTING132'
// // let pointAmount = '5000'
// // let couponName = couponUsed === '' ? '-Tidak Menggunakan Kupon' : '-kupon=' + couponUsed;
// // let pointUsed = pointAmount === '' ? '-Tidak Menggunakan Poin' : '-poin=' + pointAmount;
// // let paymentMethod = 'BSI'



// // let custOrderDetail = [
// //     {
// //         location: '',
// //         productType: 'Suku Cadang',
// //         productName: 'Paket Fast Tune Up Shell Advance AX7SC 10W40 0.8 L untuk Motor Matic+Protego Engine Flush',
// //         productSKU: '550062463+4042292510016',
// //         productMerchant: null,
// //         productPrice: 90080,
// //         productOutlet: '',
// //         orderNumber: '2241700081',
// //         orderDate: '24/04/2024, 14:40:09 WIB',
// //         total: '90080',
// //         qty: 1,
// //         paymentMethod: 'CIMB VA',
// //         vaNumber: '1899000001031134',
// //         receiverName: 'Sindi Yulia',
// //         receiverPhone: '085156174151',
// //         address: 'Jl Kemayoran Gempol RT 12 RW 4 No 09, Gg. Sejahtera  Kec. Kemayoran, Kota. KOTA ADM. JAKARTA PUSAT, Provinsi. DKI JAKARTA, 10630',
// //         courier: 'SICEPAT - SiCepat Besok Sampai Tujuan',
// //         shippingFee: [[Object], [Object], [Object]],
// //         initTotalQty: 4333,
// //         initAvailQty: 2164,
// //         initTotalItemOutlet: '',
// //         initTotalAvailOutlet: '',
// //         initTotalSentOutlet: '',
// //         afterOrderTotalQty: 4331,
// //         afterOrderTotalAvail: 2163,
// //         afterOrderTotalItemOutlet: 'It is not product service order',
// //         afterOrderTotalAvailOutlet: 'It is not product service order',
// //         afterOrderTotalSentOutlet: 'It is not product service order',
// //         afterCancelTotalQty: 4333,
// //         afterCancelTotalAvail: 2164,
// //         afterCancelTotalItemOutlet: 'It is not product service order',
// //         afterCancelTotalAvailOutlet: 'It is not product service order',
// //         afterCancelTotalSentOutlet: 'It is not product service order',
// //         balancePoint: '770.587',
// //         usedPoint: '7000',
// //         applyPoint: {
// //             status: 500,
// //             usePointStatus: false,
// //             message: 'Tidak memenuhi syarat, minimal pembelanjaan 100000'
// //         },
// //         poinAfterOrder: '770.587',
// //         pointAfterCancel: '770.587',
// //         usedCoupon: ['TESTING132'],
// //         useCouponStatus: 'Kupon Diskon tidak tersedia atau kupon sudah tidak berlaku',
// //         useCouponData: ''
// //     },
// //     {
// //         location: {
// //             getLocationResponse: {data:{subDistrictName:'Jogja'}},
// //             latitude: -6.1610423,
// //             longitude: 106.9152554
// //         },
// //         productType: 'Layanan Bengkel',
// //         productName: 'Voucher Motoquick Shell Advance Scooter Gear Oil 0.12L 550066664',
// //         productSKU: 'MQ-550066664',
// //         productMerchant: 'Motoquick ',
// //         productPrice: 15500,
// //         productOutlet: 'MOTOQUICK LAWSON SUNTER KIRANA',
// //         orderNumber: '3241701388',
// //         orderDate: '24/04/2024, 14:41:33 WIB',
// //         total: '15500',
// //         qty: 1,
// //         paymentMethod: 'CIMB VA',
// //         vaNumber: '1899000001031135',
// //         receiverName: 'Cindy',
// //         receiverPhone: '087757921231',
// //         address: '',
// //         courier: 'It is not spareparts order',
// //         shippingFee: '',
// //         initTotalQty: 3990,
// //         initAvailQty: 3990,
// //         initTotalItemOutlet: '41',
// //         initTotalAvailOutlet: '41',
// //         initTotalSentOutlet: '577',
// //         afterOrderTotalQty: 3989,
// //         afterOrderTotalAvail: 3989,
// //         afterOrderTotalItemOutlet: '40',
// //         afterOrderTotalAvailOutlet: '40',
// //         afterOrderTotalSentOutlet: '578',
// //         afterCancelTotalQty: 3990,
// //         afterCancelTotalAvail: 3990,
// //         afterCancelTotalItemOutlet: '41',
// //         afterCancelTotalAvailOutlet: '41',
// //         afterCancelTotalSentOutlet: '577',
// //         balancePoint: '770.587',
// //         usedPoint: '7000',
// //         applyPoint: {
// //             status: 500,
// //             usePointStatus: false,
// //             message: 'Tidak memenuhi syarat, minimal pembelanjaan 100000'
// //         },
// //         poinAfterOrder: '770.587',
// //         pointAfterCancel: '770.587',
// //         usedCoupon: ['TESTING132'],
// //         useCouponStatus: 'Kupon Diskon tidak tersedia atau kupon sudah tidak berlaku',
// //         useCouponData: ''
// //     },
// //     {
// //         location: {
// //             getLocationResponse: {data:{subDistrictName:'Jogja'}},
// //             latitude: -6.1610423,
// //             longitude: 106.9152554
// //         },
// //         productType: 'Homeservice',
// //         productName: 'Voucher Astra Shell Oil 5W30 4 Ltr + Pemasangan (Oli untuk Mobil Bensin)',
// //         productSKU: 'SD-550053104',
// //         productMerchant: 'Homeservice',
// //         productPrice: 416000,
// //         productOutlet: '',
// //         orderNumber: '3241701389',
// //         orderDate: '24/04/2024, 14:42:49 WIB',
// //         total: '409000',
// //         qty: 1,
// //         paymentMethod: 'CIMB VA',
// //         vaNumber: '1899000001031136',
// //         receiverName: 'Sindi Yulia',
// //         receiverPhone: '085156174151',
// //         address: 'Jl Kemayoran Gempol RT 12 RW 4 No 09, Gg. Sejahtera  Kec. Kemayoran, Kota. KOTA ADM. JAKARTA PUSAT, Provinsi. DKI JAKARTA, 10630',
// //         courier: 'It is not spareparts order',
// //         shippingFee: '',
// //         initTotalQty: 204620,
// //         initAvailQty: 204620,
// //         initTotalItemOutlet: '',
// //         initTotalAvailOutlet: '',
// //         initTotalSentOutlet: '',
// //         afterOrderTotalQty: 204619,
// //         afterOrderTotalAvail: 204619,
// //         afterOrderTotalItemOutlet: 'It is not product service order',
// //         afterOrderTotalAvailOutlet: 'It is not product service order',
// //         afterOrderTotalSentOutlet: 'It is not product service order',
// //         afterCancelTotalQty: 204620,
// //         afterCancelTotalAvail: 204620,
// //         afterCancelTotalItemOutlet: 'It is not product service order',
// //         afterCancelTotalAvailOutlet: 'It is not product service order',
// //         afterCancelTotalSentOutlet: 'It is not product service order',
// //         balancePoint: '770.587',
// //         usedPoint: '7000',
// //         applyPoint: {
// //             status: 200,
// //             message: 'success',
// //             usePointStatus: true,
// //             data: [Object]
// //         },
// //         poinAfterOrder: '763.587',
// //         pointAfterCancel: '770.587',
// //         usedCoupon: ['TESTING132'],
// //         useCouponStatus: 'Kupon Diskon tidak tersedia atau kupon sudah tidak berlaku',
// //         useCouponData: ''
// //     }
// // ]


// // let recapStatus = [
// //     {
// //         login: true,
// //         cleansingCart: true,
// //         getLocCustomer: '',
// //         getPDP: true,
// //         addCart: true,
// //         applyPoint: false,
// //         applyCoupon: false,
// //         order: true,
// //         cancel: true
// //     },
// //     {
// //         login: true,
// //         cleansingCart: true,
// //         getLocCustomer: true,
// //         getPDP: true,
// //         addCart: true,
// //         applyPoint: false,
// //         applyCoupon: false,
// //         order: true,
// //         cancel: true
// //     },
// //     {
// //         login: true,
// //         cleansingCart: true,
// //         getLocCustomer: true,
// //         getPDP: true,
// //         addCart: true,
// //         applyPoint: true,
// //         applyCoupon: false,
// //         order: true,
// //         cancel: true
// //     }
// // ]

// // let startDate = new Date();
// // let endDate = new Date();

// // const htmlResult = await getHtmlData(custOrderDetail, recapStatus, startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB", '0');
// // const pdfFilePath = await generatePdf(htmlResult, 'BCA VA', '5000', 'Tanpa Kupon');

// // const decryptProcess = async (ivData, data, type)
// var workbook = XLSX.readFile("data_input.xlsx");

// let worksheet = workbook.Sheets[workbook.SheetNames[0]];
// for (let index = 2; index < 7; index++) {
//     const id = worksheet[`A${index}`].v;
//     const name = worksheet[`B${index}`].v;

//     console.log({
//         id: id, name: name
//     })


// }

import fs from 'fs';
import * as XLSX from 'xlsx';

// Reading the Excel file using fs.readFile
fs.readFile('./data_input.xlsx', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    
    // Parsing the Excel data
    const workbook = XLSX.read(data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    
    let pointAmount = [];
    let couponName =[];
    let paymentMethod =[];


    for (let index = 0; index < jsonData.length; index++) {
        pointAmount[index]=jsonData[index].pointAmount?jsonData[index].pointAmount:'';
        couponName[index]=jsonData[index].couponName?jsonData[index].couponName:'';
        paymentMethod[index]=jsonData[index].paymentMethod?jsonData[index].paymentMethod:'';
    }

    console.log(pointAmount);
    console.log(couponName);
    console.log(paymentMethod);
    
});

