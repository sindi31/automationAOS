import generatePdf from "./generatePdf.js"


let htmlContent = `
<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8" />
      <title>Automation Test Result</title>
   </head>
   <body style ="font-family: 'Calibri', sans-serif; color: #555;">
      <div>
         <p>The following is the result for your automation test:</p>
         <table style="width: 100%; text-align:right;font-family: 'Lato', sans-serif">
            <tr>
               <td><b>#{order.data.orderNumber}</b></td>
            </tr>
         </table>
         <table style="width: 100%; padding-top: 10px">
            <tr style = "background: #92a8d1;font-weight: bold;">
               <td colspan="2">
                  Customer Detail
               </td>
            </tr>
            <tr>
               <td style="font-size:13px">
                  {order.data.customerName} </br>{order.data.phoneNumber} 
               </td>
            </tr>
            <tr style = "background: #eee;font-weight: bold;">
               <td colspan="2">
                  Order Detail
               </td>
            </tr>
            <tr>
               <td>
                  <table style="font-size:13px">
                     <tr>
                        <td >Product Type</td>
                        <td>: {productType}</td>
                     </tr>
                     <tr>
                        <td>SKU</td>
                        <td>: {product.data.sku}</td>
                     </tr>
                     <tr>
                        <td>Name</td>
                        <td>: {product.data.name}</td>
                     </tr>
                     <tr>
                        <td>Quantity</td>
                        <td>: {order.data.totalQuantity}</td>
                     </tr>
                     <tr>
                        <td>Total</td>
                        <td>: {order.data.total}</td>
                     </tr>
                  </table>
               </td>
            </tr>
            <tr style = "background: #eee;font-weight: bold;">
               <td colspan="2">
                  Point Validation
               </td>
            </tr>
            <tr>
               <td>
                  <table style="font-size:13px">
                     <tr>
                        <td >Before</td>
                        <td>: </td>
                     </tr>
                     <tr>
                        <td>After Order</td>
                        <td>: </td>
                     </tr>
                     <tr>
                        <td>After Cancel</td>
                        <td>: </td>
                     </tr>
                  </table>
               </td>
            </tr>
            <tr style = "background: #eee;font-weight: bold;">
               <td colspan="2">
                  Stock Validation
               </td>
            </tr>
            <tr>
               <td>
                  <table style="font-size:13px">
                     <tr>
                        <td >Before</td>
                        <td>: </td>
                     </tr>
                     <tr>
                        <td>After Order</td>
                        <td>: </td>
                     </tr>
                     <tr>
                        <td>After Cancel</td>
                        <td>: </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </div>
   </body>
</html>
`

await generatePdf(htmlContent);
