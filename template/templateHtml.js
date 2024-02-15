import fs from 'fs';
import puppeteer from 'puppeteer';

const contentPdf = async (loginResponse) => {
   let htmlContent = `
  <!DOCTYPE html>
      <html>
         <head>
            <title>Automation Test Result</title>
         </head>
         <body>
            <p><b>The following is a report of your test results:</b>
            <p/>
            <table style="width: 1000px; height: 140px;">
               <tbody>
                  <tr>
                     <td style="width: 140px;">Product Type</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Product SKU</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"> </td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Product Name</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;">${loginResponse.message}</td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">
                        <b>Order Detail</b>
                     </td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Order Number</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Order Date</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Payment Method</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Total</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">
                        <b>Qty Validation</b>
                     </td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Qty Before Order</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Qty Order</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Qty After Order</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;">belum scraping hehe</td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">
                        <b>Customer Info</b>
                     </td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Name</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
                  <tr>
                     <td style="width: 140px;">Phone Number</td>
                     <td style="width: 10px;">:</td>
                     <td style="width: 500px;"></td>
                  </tr>
               </tbody>
            </table>
         </body>
      </html>
  `
  return htmlContent;
};



export default contentPdf