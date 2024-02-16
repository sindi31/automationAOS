const starthtml = 
`
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
      <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.7/css/all.css">
      <title>Automation Testing Result</title>
      <meta name="author" content="" />
      <meta name="description" content="" />
      <meta name="keywords"  content="" />
      <meta name="Resource-type" content="Document" />
   </head>
   <style>
      .fa-exclamation-circle {color:gold}
      .fa-times-circle {color:red;}
      .fa-check-circle {color:green;}
      .tbl-order th {
      background-color: #eeeeee;
      text-align:center;
      }
      .tbl-order td {
      font-size: 10px;
      }
      .tbl-order th, .tbl-order td, .tbl-price-list td{
      padding: 0px;
      }
   </style>
   <body>
      <!--Body Message-->
      <div style="margin:0;padding:0;color:#333;font-style:normal;line-height:1.42857143;font-size:11px;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;text-align:left;background-color:#ffffff">
         <table style="border-collapse:collapse;width:100%;margin:10 auto;" >
         <tbody>
            <tr>
               <td>
                  <table>
                     <tbody>
                        <tr>
                           <td style="padding-top:5px; border-top:5px solid #0033A0; font-size: 11px;">
                              <p style="font-size:13px"> <b>TEST DETAIL</b> <br>
                              </p>
                              <table style="width: 100%; border-collapse: collapse;">
                                 <tbody>
`;

const endHtml =
`
                                </tbody>
                              </table>
                           </td>
                        </tr>
                     </tbody>
                  </table>
      </div>
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
      <script type="text/javascript" src="js/fullpage.js"></script>
      <script type="text/javascript" src="js/examples.js"></script>
   </body>
</html>
`

const getBodyHtmlPage2 = async(custOrderDetail) => {
   let body = "";
    for (let i = 0; i < custOrderDetail.length; i++) {
        body+=
`
<tr>
<td style="vertical-align: top; padding-top: 5px;padding-left: 5px;font-size: 12px ">
   <b>SCENARIO #${i+1} </b><br>
</td>
</tr>
<tr>
<td style="vertical-align: top; padding-left: 5px;font-size: 9px ">
   Melakukan order produk ${custOrderDetail[i].productType} dilanjutkan proses pembatalan
</td>
</tr>
<tr class ="tbl-order">
<td style="padding-top:10px">
   <table style="width: 100%; border-collapse: collapse;">
      <tr>
         <td style="vertical-align: top; width:10%; padding-left: 5px;font-size: 9px ">
            Receiver
         </td>
         <td style="vertical-align: top;width:50%; font-size: 9px ">
            : ${custOrderDetail[i].receiverName}
         </td>
         <td style="vertical-align: top; width:13%;font-size: 9px ">
            Order Number
         </td>
         <td style="vertical-align: top; font-size: 9px ">
            : <b>${custOrderDetail[i].orderNumber}</b>
         </td>
      </tr>
      <tr >
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px ">
            Phone
         </td>
         <td style="vertical-align: top; font-size: 9px ">
            : ${custOrderDetail[i].receiverPhone}
         </td>
         <td style="vertical-align: top;font-size: 9px ">
            Order Date
         </td>
         <td style="vertical-align: top; font-size: 9px ">
            : ${custOrderDetail[i].orderDate}
         </td>
      </tr>
      <tr>
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px ">
            Address
         </td>
         <td style="vertical-align: top;padding-right:15px;padding-left:5px;text-indent: -5px; font-size: 9px ">
            : ${custOrderDetail[i].productType === 'Suku Cadang'? custOrderDetail[i].address : '-'}
         </td>
      </tr>
   </table>
</td>
</tr>
<tr class ="tbl-order">
<td>
   <table style="width: 100%; border-collapse: collapse;">
      <tr style=" font-size: 10px">
         <td colspan="2" style="padding-top:10px;width:60%;vertical-align: top; padding-left: 5px;">
            <b>Product Detail</b>
         </td>
         <td colspan="2" style="padding-top:10px;vertical-align: top;">
            <b>Shipment & Payment</b>
         </td>
      </tr>
      <tr style="font-size: 9px">
         <td style="width:10%;vertical-align: top; padding-left: 5px;font-size: 9px ">
         ${custOrderDetail[i].productType === 'Layanan Bengkel'? 'SKU / Outlet':'SKU'}
         </td>
         <td style="width:50%;vertical-align: top;font-size: 9px ">
            : ${custOrderDetail[i].productType === 'Layanan Bengkel'? custOrderDetail[i].productSKU+' ( '+ custOrderDetail[i].productOutlet+' )' : custOrderDetail[i].productSKU}
         </td>
         <td style="width:13%;vertical-align: top;font-size: 9px">
            Shipping Method
         </td>
         <td style="vertical-align: top;font-size: 9px">
            : ${custOrderDetail[i].courier === 'It is not spareparts order'? '-':custOrderDetail[i].courier}
         </td>
      </tr>
      <tr>
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px">
            Name
         </td>
         <td style="vertical-align: top; padding-right:15px;padding-left:5px;text-indent: -5px;font-size: 9px">
            : ${custOrderDetail[i].productName}
         </td>
         <td style="vertical-align: top;font-size: 9px">
            Shipping Fee
         </td>
         <td style="vertical-align: top;font-size: 9px">
            : ${custOrderDetail[i].shippingFee}
         </td>
      </tr>
      <tr >
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px">
            Product Price
         </td>
         <td style="vertical-align: top; font-size: 9px;padding-right:5px">
            : ${custOrderDetail[i].productPrice}
         </td>
         <td style="vertical-align: top;font-size: 9px">
            Payment Method
         </td>
         <td style="vertical-align: top;font-size: 9px">
            : ${custOrderDetail[i].paymentMethod}
         </td>
      </tr>
      <tr >
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px ">
            Qty Order
         </td>
         <td style="vertical-align: top;font-size: 9px; padding-right:5px">
            : ${custOrderDetail[i].qty}
         </td>
      </tr>
      <tr >
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px ">
            Grand Total
         </td>
         <td style="vertical-align: top; font-size:9px; padding-right:5px">
            : ${custOrderDetail[i].total}
         </td>
      </tr>
      <tr>
         <td colspan="2" style="width:50%;vertical-align: top; padding-left: 5px;font-size: 10px; padding-top:10px ">
            <b>Coupon Detail</b>
         </td>
      </tr>
      <tr >
         <td style="width:10%;vertical-align: top; padding-left: 5px;font-size: 9px ">
            Coupon Code
         </td>
         <td style="vertical-align: top; font-size: 9px ">
            : ${custOrderDetail[i].usedCoupon}
         </td>
      </tr>
      <tr >
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px ">
            Status
         </td>
         <td style="vertical-align: top; font-size: 9px; padding-right:5px">
            : ${custOrderDetail[i].useCouponStatus}
         </td>
      </tr>
      <tr>
         <td colspan="2" style="width:50%;vertical-align: top; padding-left: 5px;font-size: 10px; padding-top:10px ">
            <b>Point Validation</b>
         </td>
      </tr>
      <tr >
         <td style="width:10%;vertical-align: top; padding-left: 5px;font-size: 9px ">
            Amount
         </td>
         <td style="vertical-align: top; font-size: 9px ">
            : ${custOrderDetail[i].usedPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? '0': custOrderDetail[i].usedPoint}
         </td>
      </tr>
      <tr >
         <td style="vertical-align: top; padding-left: 5px;font-size: 9px ">
            Status
         </td>
         <td style="vertical-align: top;font-size: 9px; padding-right:5px">
            : ${custOrderDetail[i].usedPoint === 'Tidak memenuhi syarat, minimal pembelanjaan 50.000' ? custOrderDetail[i].usedPoint : 'Successfully apply point'}
         </td>
      </tr>
      <tr class ="tbl-order">
         <td colspan="4" style="padding:5px;">
            <table style="text-align:center;width: 100%; border-collapse: collapse; border: 0.5px solid rgb(234, 234, 234);font-size: 9px">
               <th style="width:33%;">Before Order</th>
               <th style="width:33%;">After Order</th>
               <th style="width:33%;">After Cancel</th>
               <tr>
                  <td style="font-size: 9px">${custOrderDetail[i].balancePoint}</td>
                  <td style="font-size: 9px">${custOrderDetail[i].poinAfterOrder}</td>
                  <td style="font-size: 9px">${custOrderDetail[i].pointAfterCancel}</td>
               </tr>
            </table>
         </td>
      </tr>
      <tr>
         <td colspan="2" style="width:50%;vertical-align: top; padding-left: 5px;font-size: 10px; padding-top:10px ">
            <b>Stock Validation</b>
         </td>
      </tr>
      <tr class ="tbl-order">
         <td colspan="4" style="padding:5px;">
            <table style="text-align:center;width: 100%; border-collapse: collapse; border: 0.5px solid rgb(234, 234, 234);font-size: 9px">
               <th style="width:33%;">Before Order</th>
               <th style="width:33%;">After Order</th>
               <th style="width:33%;">After Cancel</th>
               <tr>
                  <td style="font-size: 9px">${custOrderDetail[i].initTotalAvailOutlet === 'It is not product service order' ? custOrderDetail[i].initAvailQty : custOrderDetail[i].initTotalAvailOutlet}</td>
                  <td style="font-size: 9px">${custOrderDetail[i].afterOrderTotalAvailOutlet === 'It is not product service order' ? custOrderDetail[i].afterOrderTotalAvail : custOrderDetail[i].afterOrderTotalAvailOutlet}</td>
                  <td style="font-size: 9px">${custOrderDetail[i].afterCancelTotalAvailOutlet === 'It is not product service order' ? custOrderDetail[i].afterCancelTotalAvail : custOrderDetail[i].afterCancelTotalAvailOutlet}</td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</td>
</tr>

`
    }
    let finalHtml = starthtml+body+endHtml;
    console.log('page2 ok')

    return finalHtml
}


export default getBodyHtmlPage2;