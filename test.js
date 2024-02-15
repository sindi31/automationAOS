import template from "./templateTest.js";
import getBodyHtml from "./testHtml.js";
import getBodyHtmlPage2 from "./page2Html.js";
import {generatePdf,mergePdf} from "./utils/generatePdf.js";
import PDFMerger from "pdf-merger-js";
import path from "path";

const data = [
    {
      productType: 'Suku Cadang',
      productName: 'Paket Fast Tune Up Shell Advance AX7SC 10W40 0.8 L untuk Motor Matic+Protego Engine Flush',
      productSKU: '550062463+4042292510016',
      productMerchant: null,
      productPrice: 90080,
      productOutlet: 'It is not product service order',
      orderNumber: '2240600068',
      orderDate: '08/02/2024, 22:20:58 WIB',
      total: '85080',
      qty: 1,
      paymentMethod: 'Mandiri VA',
      vaNumber: '8889940021542304',
      receiverName: 'Sindi Yulia',
      receiverPhone: '085156174151',
      address: 'Jl Kemayoran Gempol RT 12 RW 4 No 09, Gg. Sejahtera Kec. Kemayoran, Kota. KOTA ADM. JAKARTA PUSAT, Provinsi. DKI JAKARTA, 10630',
      courier: 'SICEPAT - SiCepat Besok Sampai Tujuan',
      initTotalQty: 382,
      initAvailQty: 146,
      initTotalItemOutlet: 'It is not product service order',
      initTotalAvailOutlet: 'It is not product service order',
      initTotalSentOutlet: 'It is not product service order',
      afterOrderTotalQty: 380,
      afterOrderTotalAvail: 145,
      afterOrderTotalItemOutlet: 'It is not product service order',
      afterOrderTotalAvailOutlet: 'It is not product service order',
      afterOrderTotalSentOutlet: 'It is not product service order',
      afterCancelTotalQty: 382,
      afterCancelTotalAvail: 146,
      afterCancelTotalItemOutlet: 'It is not product service order',
      afterCancelTotalAvailOutlet: 'It is not product service order',
      afterCancelTotalSentOutlet: 'It is not product service order',
      balancePoint: '775.069',
      usedPoint: 5000,
      poinAfterOrder: '770.069',
      pointAfterCancel: '775.069',
      usedCoupon: 'HOME001',
      useCouponStatus: 'Coupon Not Found!'
    },
    {
      productType: 'Layanan Bengkel',
      productName: 'Voucher Motoquick Shell Advance AX7SC 10W40 0.8 L untuk Motor Matic',
      productSKU: 'MQ-550062463',
      productMerchant: 'Motoquick ',
      productPrice: 54000,
      productOutlet: 'MOTOQUICK PASAR MINGGU 2',
      orderNumber: '3240604463',
      orderDate: '08/02/2024, 22:22:04 WIB',
      total: '49000',
      qty: 1,
      paymentMethod: 'Mandiri VA',
      vaNumber: '8889940021542327',
      receiverName: 'Cindy',
      receiverPhone: '087757921231',
      address: null,
      courier: 'It is not spareparts order',
      initTotalQty: 4179,
      initAvailQty: 4179,
      initTotalItemOutlet: '49',
      initTotalAvailOutlet: '49',
      initTotalSentOutlet: '1168',
      afterOrderTotalQty: 4178,
      afterOrderTotalAvail: 4178,
      afterOrderTotalItemOutlet: '48',
      afterOrderTotalAvailOutlet: '48',
      afterOrderTotalSentOutlet: '1169',
      afterCancelTotalQty: 4179,
      afterCancelTotalAvail: 4179,
      afterCancelTotalItemOutlet: '49',
      afterCancelTotalAvailOutlet: '49',
      afterCancelTotalSentOutlet: '1168',
      balancePoint: '775.069',
      usedPoint: 5000,
      poinAfterOrder: '770.069',
      pointAfterCancel: '775.069',
      usedCoupon: 'HOME001',
      useCouponStatus: 'Coupon Not Found!'
    },
    {
      productType: 'Homeservice',
      productName: 'Voucher Shell Helix Astra Oil 10W30 4 Ltr + Pemasangan (Oli untuk Mobil Bensin)',
      productSKU: 'SD-550043469',
      productMerchant: 'Homeservice',
      productPrice: 314000,
      productOutlet: 'It is not product service order',
      orderNumber: '3240604464',
      orderDate: '08/02/2024, 22:23:06 WIB',
      total: '309000',
      qty: 1,
      paymentMethod: 'Mandiri VA',
      vaNumber: '8889940021542357',
      receiverName: 'Sindi Yulia',
      receiverPhone: '085156174151',
      address: 'Jl Kemayoran Gempol RT 12 RW 4 No 09, Gg. Sejahtera Kec. Kemayoran, Kota. KOTA ADM. JAKARTA PUSAT, Provinsi. DKI JAKARTA, 10630',
      courier: 'It is not spareparts order',
      initTotalQty: 99625,
      initAvailQty: 99625,
      initTotalItemOutlet: 'It is not product service order',
      initTotalAvailOutlet: 'It is not product service order',
      initTotalSentOutlet: 'It is not product service order',
      afterOrderTotalQty: 99624,
      afterOrderTotalAvail: 99624,
      afterOrderTotalItemOutlet: 'It is not product service order',
      afterOrderTotalAvailOutlet: 'It is not product service order',
      afterOrderTotalSentOutlet: 'It is not product service order',
      afterCancelTotalQty: 99625,
      afterCancelTotalAvail: 99625,
      afterCancelTotalItemOutlet: 'It is not product service order',
      afterCancelTotalAvailOutlet: 'It is not product service order',
      afterCancelTotalSentOutlet: 'It is not product service order',
      balancePoint: '775.069',
      usedPoint: 5000,
      poinAfterOrder: '770.069',
      pointAfterCancel: '775.069',
      usedCoupon: 'HOME001',
      useCouponStatus: 'Coupon Not Found!'
    }
  ]

  const data2 =   [
    {
      login: true,
      cleansingCart: true,
      getLocCustomer: '',
      getPDP: true,
      addCart: true,
      applyPoint: true,
      applyCoupon: false,
      order: true,
      cancel: true
    },
    {
      login: true,
      cleansingCart: true,
      getLocCustomer: true,
      getPDP: true,
      addCart: true,
      applyPoint: true,
      applyCoupon: false,
      order: true,
      cancel: true
    },
    {
      login: true,
      cleansingCart: true,
      getLocCustomer: true,
      getPDP: true,
      addCart: true,
      applyPoint: true,
      applyCoupon: false,
      order: true,
      cancel: true
    }
  ]

  // const temporary = await getBodyHtml(data,data2);
  // const page1= await generatePdf(temporary,'1');

  const temporaryPage2 = await getBodyHtmlPage2(data);
  const page2= await generatePdf(temporaryPage2,'2');

  // let filePdf = [page1,page2];
  // await mergePdf(filePdf);
  // const merger = new PDFMerger();
  // await merger.add(page1,page2)
  // await merger.save('merged.pdf');
  // console.log(data[0])
