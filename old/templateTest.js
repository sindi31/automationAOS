import data from "../constanta/inputData.js";

const template = async(data, data2) => {
    const passed = '<i class="fa fa-check"></i>';
    const failed = ''
    let htmlContent=
    `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
       <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
          <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
          <title>Automation Testing Result #?{orderNumber}</title>
          <meta name="author" content="" />
          <meta name="description" content="" />
          <meta name="keywords"  content="" />
          <meta name="Resource-type" content="Document" />
       </head>
       <style>
          .tbl-order {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid rgb(234, 234, 234);
          }
          .tbl-price-list {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #eeeeee;
          background-color: #eeeeee;
          }
          .tbl-order th {
          background-color: #eeeeee;
          }
          .tbl-order td {
          ;
          }
          .tbl-order th, .tbl-order td, .tbl-price-list td{
          padding: 5px 6px;
          }
          .tbl-price-list td {
          border-bottom: 1px solid #eeeeee;
          }
       </style>
       <body>
          <!--Body Message-->
          <div style="margin:0;padding:0;color:#333;font-style:normal;line-height:1.42857143;font-size:11px;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;text-align:left;background-color:#ffffff">
             <table style="border-collapse:collapse;width:100%;margin:0 auto" width="100%">
             <tbody>
                <tr>
                   <td style="font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;vertical-align:top;padding-bottom:30px;width:100%" align="center">
                      <table style="border-collapse:collapse;width:100%;margin:0 auto;text-align:left" align="center">
                         <tbody>
                            <tr>
                               <td style="font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;vertical-align:top;background-color:#ffffff;padding:25px;text-align:center">
                                  <a href="{baseUrl}" style="color:#1979c3;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://devc.astraotoshop.com/&amp;source=gmail&amp;ust=1628410724448000&amp;usg=AFQjCNFnpMeqxfWQnO3-_l-4LjqKEM4WcQ">
                                  <img src="https://storageb2cprod.blob.core.windows.net/asset-b2c-prod/aop/logo-aop.png" alt="Astra Oto Shop" style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none" width="140px" height="52" border="0" class="CToWUd">
                                  </a>
                               </td>
                            </tr>
                            <tr>
                               <td style="font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;vertical-align:center;background-color:#fff;padding:25px;border-top:5px solid #0033A0; font-size: 11px;">
                                  <table style="width: 100%; border-collapse: collapse; border: 1px solid rgb(234, 234, 234);">
                                     <thead>
                                        <tr>
                                           <th style="background-color: #eeeeee; padding: 10px; font-size: 12px">Scenario</th>
                                           <th colspan="2" style="background-color: #eeeeee; padding: 10px; font-size: 12px">Data</th>
                                           <th style="background-color: #eeeeee; padding: 10px; font-size: 12px">Process</th>
                                           <th style="background-color: #eeeeee; padding: 10px; font-size: 12px">Status</th>
                                        </tr>
                                     </thead>
                                     <tbody>
                                        <tr>
                                           <td rowspan="9" style="width:25%;vertical-align: top;border: 1px solid rgb(234, 234, 234); padding: 5px;font-size: 10px ">
                                              <b>Scenario #$[i]</b><br>
                                              Melakukan order produk ${data[0].productType} dilanjutkan proses pembatalan
                                           </td>
                                           <td style="width:5%;vertical-align: top; padding: 5px; ">
                                              Product
                                           </td>
                                           <td style="width:52%;vertical-align: top; padding: 5px; ">
                                              : ${data[0].productSKU} - ${data[0].productName}
                                           </td>
                                           <td style="width:40%;vertical-align: top; padding: 5px; font-size: 10px">
                                              1. Login Account</br>
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].login === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                        <tr>
                                           
                                           <td style="vertical-align: top; padding: 5px; ">
                                              Quantity
                                           </td>
                                           <td style="vertical-align: top; padding: 5px; ">
                                              : ${data[0].qty}
                                           </td>
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              2. Cleansing Product Cart
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].login === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                        <tr>
                                          
                                           <td style="vertical-align: top; padding: 5px; ">
                                              Point
                                           </td>
                                           <td style="vertical-align: top; padding: 5px; ">
                                              : ${data[0].usedPoint}
                                           </td>
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              3. Get Location</br>
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].login === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                         <tr>
                                           <td rowspan="6" style="vertical-align: top; padding: 5px; ">
                                              Coupon
                                           </td>
                                           <td rowspan="6" style="vertical-align: top; padding: 5px; ">
                                              : ${data[0].usedCoupon}
                                           </td>
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              4. Get Product Detail
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].login === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                        <tr>
                                           
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              5. Add to Cart</br>
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].addCart === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                         <tr>
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              6. Apply Point in Cart
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].applyPoint === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                        <tr>
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              7. Apply Coupon in Cart</br>
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].applyCoupon === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                        <tr>
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              8. Order Process
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].order === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                        <tr>
                                           <td style="vertical-align: top; padding: 5px; font-size: 10px">
                                              9. Cancelation Process
                                           </td>
                                           <td style="vertical-align: top;; padding: 5px; text-align: center; font-size: 10px">
                                              ${data2[0].cancel === true? '<i class="fa fa-check"></i>':'<i class="fas fa-times"></i>'}
                                           </td>
                                        </tr>
                                        
                                        </tr>
                                        </td>
                                        </tr>
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

    return htmlContent
}



export default template