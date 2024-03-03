const first = async (startTime, endTime, diffTime) => {
    let start = "";
    start +=
        `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
           <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
           <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
           <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.7/css/all.css">
           <title>Automation Testing Result</title>
        </head>
        <style>
           @media print {
              .pagebreak {
                 page-break-after: always;
              }
        
              /* page-break-after works, as well */
           }
        
           body {
              margin: 25px;
              padding: 0;
              color: #333;
              font-style: normal;
              font-family: 'Open Sans', sans-serif;
              text-align: left;
              background-color: white;
           }
        
           table,
           validation,
           summary {
              border-collapse: collapse;
              width: 100%;
           }
        
           .detail,
           .flow {
              font-size: 9px;
              padding-top: 5px;
           }
        
           .flow td {
              padding-left: 5px;
              padding-right: 5px;
        
           }
        
           .detail th {
              font-size: 10px;
              color: #333;
              padding-left: 5px;
           }
        
           .detail td {
              text-indent: -5px;
              padding-left: 10px;
              padding-right: 5px;
        
           }
        
           .validation td {
              text-align: center;
              border: 1px solid lightgrey
           }
        
           .summary td {
              font-size: 9px;
              vertical-align: top;
              padding-left: 5px;
           }
        
           .summary i {
              font-size: 1.5em;
           }
        
           .detail td,
           .flow td,
           .validation td {
              vertical-align: top;
           }
        
           .validation th,
           .summary th {
              font-size: 9px;
              text-align: center;
              background-color: lightgrey;
              padding: 2px;
              width: 33%;
              border: 1px solid lightgrey
           }
        
           .summary th {
              padding-left: 5px;
           }
        
           .fa-minus {
              color: gold
           }
        
           .fa-times {
              color: red;
           }
        
           .fa-check {
              color: green;
           }
        </style>
        
        <body>
           <tbody>
              <!-- image-->
              <div>
                 <tr>
                    <td>
                       <img align="right" src="https://storageb2cprod.blob.core.windows.net/asset-b2c-prod/aop/logo-aop.png"
                          alt="Astra Oto Shop" style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none"
                          width="140px" height="52" border="0">
                    </td>
                 </tr>
              </div>
              <!-- report-->
              <div class="pagebreak">
                 <tr>
                    <td>
                       <!-- summary -->
                       <div class="detail">
                          <p> The following is your automation test result summary: <br></p>
                          <table>
                             <tr>
                                <td style="width: 10%;">Start Date</td>
                                <td>: ${startTime} </td>
                             </tr>
                             <tr>
                                <td>End Date</td>
                                <td>: ${endTime} </td>
                             </tr>
                             <tr>
                                <td>Duration</td>
                                <td>: ${diffTime} </td>
                             </tr>
                          </table>
                       </div>
                       <!-- recap -->
                       <div style="padding-top: 10px;">
                          <table class="summary" style="border: 1px solid rgb(234, 234, 234);">
                             <thead>
                                <tr>
                                   <th style="width: 75%;text-align: left;">Scenario</th>
                                   <th colspan="2" style="text-align: left;">Process</th>
                                </tr>
                             </thead>
                             <tbody>
    `
    return start
}

const summaryEnd =
`
                     </tbody>
                  </table>
               </div>
            </td>
         </tr>
      </div>
`

const getSummary = async (custOrderDetail, recapStatus, start, end, diff) => {
    let body = "";
    const firstHtml = await first(start, end, diff);
    for (let i = 0; i < custOrderDetail.length; i++) {
        body +=
            `
            <tr>
            <td rowspan="9" style="border-bottom: 1px solid rgb(234, 234, 234)">
               <a href="#scenario-${i+1}"><b>#${i+1} </b> Melakukan order produk ${custOrderDetail[i].productType} dilanjutkan proses pembatalan</a>
            </td>
            <td style="width: 20% ;">1. Login Account</td>
            <td style="text-align: center">${recapStatus[i].login === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
         <tr>
            <td>2. Cleansing Product Cart</td>
            <td style="text-align: center">${recapStatus[i].cleansingCart === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
         <tr>
            <td>3. Get Location</td>
            <td style="text-align: center">${custOrderDetail[i].productType === 'Layanan Bengkel'? recapStatus[i].getLocCustomer === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>':'<i class="fas fa-minus"></i>'}</td>
         </tr>
         <tr>
            <td>4. Get Product Detail</td>
            <td style="text-align: center">${recapStatus[i].getPDP === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
         <tr>
            <td>5. Add to Cart</td>
            <td style="text-align: center">${recapStatus[i].addCart === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
         <tr>
            <td>6. Apply Point in Cart</td>
            <td style="text-align: center">${recapStatus[i].applyPoint === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
         <tr>
            <td>7. Apply Coupon in Cart</br></td>
            <td style="text-align: center;">${recapStatus[i].applyCoupon === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
         <tr>
            <td> 8. Order Process</td>
            <td style="text-align: center">${recapStatus[i].order === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
         <tr>
            <td style="border-bottom: 1px solid rgb(234, 234, 234) "> 9. Cancelation Process </td>
            <td style="text-align: center;border-bottom: 1px solid rgb(234, 234, 234);">${recapStatus[i].cancel === true? '<i class="fas fa-check"></i>':'<i class="fas fa-times"></i>'}</td>
         </tr>
                `
    }

    let summaryHtml = firstHtml + body + summaryEnd;

    return summaryHtml
}

const detailHtml = async (custOrderDetail) => {
    let body = "";
    for (let i = 0; i < custOrderDetail.length; i++) {
        body +=
            `
        <div class="pagebreak">
            <table class="flow">
               <tr>
                  <td colspan="4" style="font-size:14px;padding-bottom: 10px; padding-top:20px">
                     <b id="scenario-${i+1}">SCENARIO ${i+1} </b><br>
                  </td>
               </tr>
               <tr>
                  <td colspan="4">
                     - Melakukan order produk <b><i>${custOrderDetail[i].productType}</i></b> <br>
                     - Melakukan pembatalan order : <b><i>${custOrderDetail[i].paymentMethod.includes('VA')?'Klik Batalkan Pesanan':custOrderDetail[i].paymentMethod.includes('Alfa')?'Klik Batalkan Pesanan':custOrderDetail[i].paymentMethod.includes('Credit')?'Klik Back CC Page':'Batalkan via Admin'}</i></b>
                  </td>
               </tr>
               <tr>
                  <td colspan="4" style="font-size:14px; text-align: right;">
                     <b>#${custOrderDetail[i].orderNumber}</b>
                  </td>
               </tr>
               <tr>
                  <td colspan="4" style="font-size:9px; text-align: right; ">
                     Order date: ${custOrderDetail[i].orderDate}
                  </td>
               </tr>
            </table>
            <table class="detail">
               <!-- get location -->
               <div>
                  <tr>
                     <th colspan="4">${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Get Location' : ''}</th>
                  </tr>
                  <tr>
                     <td style="width:12%">${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Latitude' : ''}</td>
                     <td colspan="3">${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].location.latitude : ''}</td>
                  </tr>
                  <tr>
                     <td>${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Longitude' : ''}</td>
                     <td colspan="3"> ${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].location.longitude : ''}</td>
                  </tr>
                  <tr>
                     <td>${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Nearest Place' : ''}</td>
                     <td colspan="3">${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].location.getLocationResponse.data.subDistrictName + 
                     ', Kec. '+custOrderDetail[i].location.getLocationResponse.data.districtName +', '+custOrderDetail[i].location.getLocationResponse.data.cityName : ''}</td>
                  </tr>
               </div>
               <!-- customer & order -->
               <div>
                  <tr>
                     <th colspan="2">Customer Information</th>
                  </tr>
                  <tr>
                     <td style="width:12%">Name</td>
                     <td style="width:40%">: ${custOrderDetail[i].receiverName}</td>
                  </tr>
                  <tr>
                     <td>Phone</td>
                     <td>: ${custOrderDetail[i].receiverPhone}</td>
                  </tr>
                  <tr>
                     <td> ${custOrderDetail[i].productType != 'Layanan Bengkel'? 'Address': ''}</td>
                     <td colspan="3">${custOrderDetail[i].productType != 'Layanan Bengkel'? ': '+custOrderDetail[i].address : ''}</td>
                  </tr>
               </div>
               <!-- product -->
               <div>
                  <tr>
                     <th colspan="2">Product Detail</th>
                  </tr>
                  <tr>
                     <td>SKU</td>
                     <td colspan="3">: ${custOrderDetail[i].productSKU}</td>
                  </tr>
                  <tr>
                     <td>Name</td>
                     <td colspan="3">: ${custOrderDetail[i].productName}</td>
                  </tr>
                  <tr>
                     <td>Price</td>
                     <td colspan="3">: ${custOrderDetail[i].productPrice}</td>
                  </tr>
                  <tr>
                     <td>${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Merchant': ''}</td>
                     <td> ${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].productOutlet: ''}</td>
                  </tr>
               </div>
               <!-- coupon & point -->
               <div>
                  <tr>
                     <th colspan="2">Coupon & Point Usage</th>
                  </tr>
                  <tr>
                     <td>Coupon Code</td>
                     <td colspan="3">: ${custOrderDetail[i].usedCoupon} ( <i>${custOrderDetail[i].useCouponStatus}</i> )</td>
                  </tr>
                  <tr>
                     <td>Point</td>
                     <td colspan="3">: ${custOrderDetail[i].usedPoint} ( <i>${custOrderDetail[i].applyPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? custOrderDetail[i].applyPoint : 'Successfully apply point'}</i> )</td>
                  </tr>
               </div>
               <!-- order-->
               <div>
                  <tr>
                     <th colspan="4">Order Detail</th>
                  </tr>
                  <tr>
                     <td>Quantity</td>
                     <td>: ${custOrderDetail[i].qty}</td>
                  </tr>
                  <tr>
                     <td>Payment Method</td>
                     <td>: ${custOrderDetail[i].paymentMethod}</td>
                  </tr>
                  <tr>
                     <td>${custOrderDetail[i].productType === 'Suku Cadang'? 'Shipment Method' : ''}</td>
                     <td>${custOrderDetail[i].courier === 'It is not spareparts order'? '':': '+custOrderDetail[i].courier}</td>
                  </tr>
                  <tr>
                     <td colspan="4" style="padding-top: 25px; text-align: right;">
                        <table>
                           <tr>
                              <td colspan="2" style="width: 50%;"></td>
                              <td style="text-align: left">Subtotal</td>
                              <td>${custOrderDetail[i].qty*custOrderDetail[i].productPrice}</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${custOrderDetail[i].applyPoint === 'Tidak Menggunakan Poin' ? '': custOrderDetail[i].applyPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? '': 'Point'}</td>
                              <td>${custOrderDetail[i].applyPoint === 'Tidak Menggunakan Poin' ? '': custOrderDetail[i].applyPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? '': '- '+custOrderDetail[i].applyPoint.point}</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${custOrderDetail[i].useCouponData != ''? custOrderDetail[i].useCouponData != 'Tidak menggunakan kupon'? 'Coupon Disc.':''  :'' }</td>
                              <td>${custOrderDetail[i].useCouponData != ''? custOrderDetail[i].useCouponData != 'Tidak menggunakan kupon'? '- '+custOrderDetail[i].useCouponData.discount_amount.replace('.00000','') :''  :'' }</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${custOrderDetail[i].productType === 'Suku Cadang'? 'Shipment Fee' : ''}</td>
                              <td> ${custOrderDetail[i].productType === 'Suku Cadang'? custOrderDetail[i].shippingFee[1].value : ''}</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left">${custOrderDetail[i].productType === 'Suku Cadang'? 'Shipment Disc.' : ''}</td>
                              <td>${custOrderDetail[i].productType === 'Suku Cadang'? custOrderDetail[i].shippingFee[2].value : ''}</td>
                           </tr>
                           <tr>
                              <td colspan="2"></td>
                              <td style="text-align: left;border-top: 1px solid grey"><b>Grand Total</b></td>
                              <td style="border-top: 1px solid grey">${custOrderDetail[i].total}</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </div>
               <!-- validation-->
               <div>
                  <tr>
                     <th colspan="4">Validation</th>
                  </tr>
                  <tr>
                     <td colspan="4" style="padding-left: 20px;">
                        Point
                     </td>
                  </tr>
                  <tr>
                     <td colspan="4">
                        <table class="validation">
                           <th>Before Order</th>
                           <th>After Order</th>
                           <th>After Cancel</th>
                           <tr>
                              <td>${custOrderDetail[i].balancePoint}</td>
                              <td>${custOrderDetail[i].poinAfterOrder}</td>
                              <td>${custOrderDetail[i].pointAfterCancel}</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td colspan="4" style="padding-left: 20px;">
                        Stock (QTY)
                     </td>
                  </tr>
                  <tr>
                     <td colspan="4">
                        <table class="validation">
                           <th>Before Order</th>
                           <th>After Order</th>
                           <th>After Cancel</th>
                           <tr>
                                <td>${custOrderDetail[i].initTotalAvailOutlet === 'It is not product service order' ? custOrderDetail[i].initAvailQty : custOrderDetail[i].initTotalAvailOutlet}</td>
                                <td>${custOrderDetail[i].afterOrderTotalAvailOutlet === 'It is not product service order' ? custOrderDetail[i].afterOrderTotalAvail : custOrderDetail[i].afterOrderTotalAvailOutlet}</td>
                                <td>${custOrderDetail[i].afterCancelTotalAvailOutlet === 'It is not product service order' ? custOrderDetail[i].afterCancelTotalAvail : custOrderDetail[i].afterCancelTotalAvailOutlet}</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </div>
            </table>
         </div>
    `
    }
    let recapHtml = body + endHtml;
    console.log('page2 ok')

    return recapHtml
}

const endHtml =
`
   </tbody>
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
   <script type="text/javascript" src="js/fullpage.js"></script>
   <script type="text/javascript" src="js/examples.js"></script>
</body>

</html>
`

const getHtmlData = async(custOrderDetail, recapStatus, start, end, diff) => {
    let section1 = await getSummary(custOrderDetail,recapStatus,start,end,diff);
    let section2 = await detailHtml(custOrderDetail);

    let finalResult = section1+section2;
    return finalResult
}


export default getHtmlData;