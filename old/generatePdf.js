import * as fs from 'fs';
import puppeteer from 'puppeteer';

const contentHeader = `
   <span style="font-size: 10px;padding-left : 5px"><i>
         This is a custom PDF for Automation Test Result
       <span>B2C AstraOtoshop</span> (<span> https://astraotoshop.com </span>)</i>
   </span>
   `

const contentFooter = `
   <span style="font-size: 10px;padding-left : 5p"><i>
       Generated on: <span class="date"></span><br/>
       Pages <span class="pageNumber"></span> of <span class="totalPages"></span></i>
   </span>
   `;

const generatePdf = async (content) => {
    // Save HTML content to a file
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await fs.promises.writeFile('message.html', content);
    console.log('HTML file has been saved!');

    // Read HTML content from file and convert to PDF
    const htmlFilePath = 'message.html';
    const pdfFilePath = 'message.pdf';

    const contentPdf = await fs.promises.readFile(htmlFilePath, 'utf-8');
    await page.setContent(content);

    await page.pdf({
        path: pdfFilePath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: contentHeader,
        footerTemplate: contentFooter,
        margin: {
            top: '30px',
            bottom: '50px'
        }
    });


    console.log('PDF file has been generated!');
    await browser.close()
}

export default generatePdf;