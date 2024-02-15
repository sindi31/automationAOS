const startHtml = async(startTime, endTime, diffTime) =>{
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
         }
         .tbl-order td {
         font-size: 12px;
         }
         .tbl-order th, .tbl-order td, .tbl-price-list td{
         padding: 4px;
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
                              <td style="padding:10px;text-align:center">
                                 <img align="right" src="https://storageb2cprod.blob.core.windows.net/asset-b2c-prod/aop/logo-aop.png" alt="Astra Oto Shop" style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none" width="140px" height="52" border="0">
                              </td>
                           </tr>
                           <tr>
                              <td style="padding-top:5px; border-top:5px solid #0033A0; font-size: 9px;">
                                 <p> The following is your automation test result summary: <br>
                                 <table>
                                 <tr>
                                 <td>Start Date</td>
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
                                 </p>
                                 <table style="width: 100%; border-collapse: collapse; border: 1px solid rgb(234, 234, 234);">
                                    <thead>
                                       <tr class ="tbl-order">
                                          <th>Scenario</th>
                                          <th colspan="2">Data</th>
                                          <th>Process</th>
                                          <th>Status</th>
                                       </tr>
                                    </thead>
                                    <tbody>
   `
   return start
}


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

const getBodyHtml = async(custOrderDetail,recapStatus,start, end, diff) => {
   console.log(start, end, diff)

   let body = "";
   const beginHtml = await startHtml(start,end,diff);
    for (let i = 0; i < custOrderDetail.length; i++) {
        body+=
        `
        <tr>
        <td rowspan="9" style="width:25%;vertical-align: top;border-bottom: 1px solid rgb(234, 234, 234); padding: 4px;font-size: 9px ">
           <b>Scenario ${i+1} </b><br>
           Melakukan order produk ${custOrderDetail[i].productType} dilanjutkan proses pembatalan
        </td>
        <td style="width:10%;vertical-align: top; padding: 4px;font-size: 9px ">
           SKU
        </td>
        <td style="width:45%;vertical-align: top; padding: 4px;font-size: 9px ">
           : ${custOrderDetail[i].productSKU}
        </td>
        <td style="width:40%;vertical-align: top; padding: 4px; font-size: 9px">
           1. Login Account</br>
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].login === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           Product Name
        </td>
        <td style="vertical-align: top; padding: 4px;text-indent: -5px;font-size: 9px ">
           : ${custOrderDetail[i].productName}
        </td>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           2. Cleansing Product Cart
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].cleansingCart === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td style="vertical-align: top; padding: 4px;font-size: 9px ">
           Quantity
        </td>
        <td style="vertical-align: top; padding: 4px;font-size: 9px ">
           : ${custOrderDetail[i].qty}
        </td>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           3. Get Location</br>
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${custOrderDetail[i].productType === 'Layanan Bengkel'? recapStatus[i].getLocCustomer === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-exclamation-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td  style="vertical-align: top; padding: 4px;font-size: 9px ">
           Point
        </td>
        <td style="vertical-align: top; padding: 4px;font-size: 9px ">
           : ${custOrderDetail[i].usedPoint}
        </td>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           4. Get Product Detail
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].getPDP === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td rowspan="5" style="border-bottom: 1px solid rgb(234, 234, 234);vertical-align: top; padding: 4px;font-size: 9px ">
           Coupon
        </td>
        <td rowspan="5" style="border-bottom: 1px solid rgb(234, 234, 234);vertical-align: top; padding: 4px;font-size: 9px ">
           : ${custOrderDetail[i].usedCoupon}
        </td>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           5. Add to Cart</br>
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].addCart === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           6. Apply Point in Cart
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].applyPoint === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           7. Apply Coupon in Cart</br>
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].applyCoupon === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td style="vertical-align: top; padding: 4px; font-size: 9px">
           8. Order Process
        </td>
        <td style="vertical-align: top; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].order === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
        </td>
     </tr>
     <tr>
        <td style="border-bottom: 1px solid rgb(234, 234, 234);vertical-align: top; padding: 4px; font-size: 9px">
           9. Cancelation Process
        </td>
        <td style="border-bottom: 1px solid rgb(234, 234, 234);vertical-align: top;; padding: 4px; text-align: center; font-size: 9px">
           ${recapStatus[i].cancel === true? '<i class="fas fa-check-circle" style="font-size: 1.6em;"></i>':'<i class="fas fa-times-circle" style="font-size: 1.6em;"></i>'}
     </tr>
        `
    }

    let finalHtml = beginHtml+body+endHtml;

    return finalHtml
}


export default getBodyHtml;