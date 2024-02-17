const starthtml =
    `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    
    <head>
       <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
       <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
       <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.7/css/all.css">
       <link rel="stylesheet" href="style.css">
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
          margin: 15px;
          padding: 0;
          color: #333;
          font-style: normal;
          font-family: 'Open Sans', sans-serif;
          text-align: left;
          background-color: white;
       }
    
       table,
       validation {
          border-collapse: collapse;
          width: 100%;
          margin: 10 auto;
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
    
       .validation th {
          font-size: 9px;
          text-align: center;
          background-color: lightgrey;
          padding: 2px;
          width: 33%;
          border: 1px solid lightgrey
       }
    
       .validation td {
          text-align: center;
          border: 1px solid lightgrey
       }
    
       .detail td,
       .flow td,
       .validation td {
          vertical-align: middle;
       }
    </style>
    
    <body>
       <tbody>
    `;

const endHtml =
    `
    </tbody>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/javascript" src="js/fullpage.js"></script>
    <script type="text/javascript" src="js/examples.js"></script>
 </body>
 
 </html>
    `

const htmlPage2 = async (custOrderDetail) => {
    let body = "";
    for (let i = 0; i < custOrderDetail.length; i++) {
        body +=
            `
            <div class="pagebreak">
            <table class="flow">
            <tr>
               <td colspan="4" style="font-size:14px;">
                  <b>SCENARIO ${i+1} </b><br>
               </td>
            </tr>
            <tr>
               <td colspan="4">
                  - Melakukan order produk <b><i>${custOrderDetail[i].productType}</i></b> <br>
                  - Melakukan pembatalan order : <b><i>Klik Batalkan Pesanan</i></b>
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
                  <th colspan="4">
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Get Location' : ''}
                  </th>
   
               </tr>
               <tr>
                  <td style="width:12%">
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Latitude' : ''}
                  </td>
                  <td colspan="3">
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].location.latitude : ''}
                  </td>
               </tr>
               <tr>
                  <td>
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Longitude' : ''}
                  </td>
                  <td colspan="3">
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].location.longitude : ''}
                  </td>
               </tr>
               <tr>
                  <td>
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Nearest Place' : ''}
                  </td>
                  <td colspan="3">
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].location.getLocationResponse.data.subDistrictName + 
                  ', Kec. '+custOrderDetail[i].location.getLocationResponse.data.districtName +', '+custOrderDetail[i].location.getLocationResponse.data.cityName : ''}
                  </td>
               </tr>
   
            </div>
            <!-- customer & order -->
            <div>
               <tr>
                  <th colspan="2">
                     Customer Information
                  </th>
               </tr>
               <tr>
                  <td style="width:12%">
                     Name
                  </td>
                  <td style="width:40%">
                     : ${custOrderDetail[i].receiverName}
                  </td>
               </tr>
               <tr>
                  <td>
                     Phone
                  </td>
                  <td>
                     : ${custOrderDetail[i].receiverPhone}
                  </td>
               </tr>
               <tr>
                  <td>
                  ${custOrderDetail[i].productType != 'Layanan Bengkel'? 'Address': ''}
                  </td>
                  <td colspan="3">
                     ${custOrderDetail[i].productType != 'Layanan Bengkel'? ': '+custOrderDetail[i].address : ''}
                  </td>
               </tr>
            </div>
            <!-- product -->
            <div>
               <tr>
                  <th colspan="2">
                     Product Detail
                  </th>
               </tr>
               <tr>
                  <td>
                     SKU
                  </td>
                  <td colspan="3">
                     : ${custOrderDetail[i].productSKU}
                  </td>
               </tr>
               <tr>
                  <td>
                     Name
                  </td>
                  <td colspan="3">
                     : ${custOrderDetail[i].productName}
                  </td>
               </tr>
               <tr>
                  <td>
                     Price
                  </td>
                  <td colspan="3">
                     : ${custOrderDetail[i].productPrice}
                  </td>
               </tr>
               <tr>
                  <td>
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? 'Merchant': ''}
                  </td>
                  <td>
                  ${custOrderDetail[i].productType === 'Layanan Bengkel'? ': '+custOrderDetail[i].productOutlet: ''}
                  </td>
               </tr>
            </div>
            <!-- coupon & point -->
            <div>
               <tr>
                  <th colspan="2">
                     Coupon & Point Usage
                  </th>
               </tr>
               <tr>
                  <td>
                     Coupon Code
                  </td>
                  <td colspan="3">
                     : ${custOrderDetail[i].usedCoupon} ( <i>${custOrderDetail[i].useCouponStatus}</i> )
                  </td>
               </tr>
               <tr>
                  <td>
                     Point Amount
                  </td>
                  <td colspan="3">
                     : ${custOrderDetail[i].usedPoint} ( <i>${custOrderDetail[i].applyPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? custOrderDetail[i].applyPoint : 'Successfully apply point'}</i> )
                  </td>
               </tr>
            </div>
            <!-- order-->
            <div>
               <tr>
                  <th colspan="4">
                     Order Detail
                  </th>
               </tr>
               <tr>
                  <td>Payment Method</td>
                  <td>: ${custOrderDetail[i].paymentMethod}</td>
                  <td>
                     Quantity
                  </td>
                  <td style="text-align:right;">
                  ${custOrderDetail[i].qty}
                  </td>
               </tr>
               <tr>
                  <td>${custOrderDetail[i].productType === 'Suku Cadang'? 'Shipment Method' : ''}</td>
                  <td>${custOrderDetail[i].courier === 'It is not spareparts order'? '':': '+custOrderDetail[i].courier}</td>
                  <td>
                     Subtotal
                  </td>
                  <td style="text-align:right;">
                  ${custOrderDetail[i].qty*custOrderDetail[i].productPrice}
                  </td>
               </tr>
               <tr>
                  <td colspan="2"></td>
                  <td>
                  ${custOrderDetail[i].applyPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? '': 'Point'}
                  </td>
                  <td style="text-align:right;">
                  ${custOrderDetail[i].applyPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? '': '-'+custOrderDetail[i].applyPoint.point}
                  </td>
               </tr>
               <tr>
                  <td colspan="2"></td>
                  <td>
                    ${custOrderDetail[i].useCouponData != ''? 'Coupon Disc.':'' }
                  </td>
                  <td style="text-align:right;">
                    ${custOrderDetail[i].useCouponData != ''? '- '+custOrderDetail[i].useCouponData.discount_amount.replace('.00000','') :'' }
                  </td>
               </tr>
               <tr>
                  <td colspan="2"></td>
                  <td>
                  ${custOrderDetail[i].productType === 'Suku Cadang'? 'Shipment Fee' : ''}
                  </td>
                  <td style="text-align:right;">
                  ${custOrderDetail[i].productType === 'Suku Cadang'? custOrderDetail[i].shippingFee[1].value : ''}
                  </td>
               </tr>
               <tr>
                  <td colspan="2"></td>
                  <td>
                  ${custOrderDetail[i].productType === 'Suku Cadang'? 'Shipment Disc.' : ''}
                  </td>
                  <td style="text-align:right;">
                  ${custOrderDetail[i].productType === 'Suku Cadang'? custOrderDetail[i].shippingFee[2].value : ''}
                  </td>
               </tr>
               <tr>
                  <td colspan="2"></td>
                  <td style="border-top: 1px solid grey">
                     <b>Grand Total </b>
                  </td>
                  <td style="text-align:right;border-top: 1px solid grey">
                  ${custOrderDetail[i].total}
                  </td>
               </tr>
            </div>
            <!-- validation-->
            <div>
               <tr>
                  <th colspan="4">
                     Validation
                  </th>
               </tr>
               <tr>
                  <td colspan="4" style="padding-left: 20px;">
                     POINT
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
         </table>
         </div>
            `
    }
    let finalHtml = starthtml + body + endHtml;
    console.log('page2 ok')

    return finalHtml
}


export default htmlPage2;