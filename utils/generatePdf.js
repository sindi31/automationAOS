import * as fs from 'fs';
import puppeteer from 'puppeteer';
import { pdf } from 'puppeteer-report';
import { PDFDocument } from "pdf-lib";

const contentHeader = `
   <span style="font-size: 10px;padding-left : 5px"><i>
         This is a custom PDF for Automation Test Result
       <span>B2C AstraOtoshop</span> (<span> https://astraotoshop.com </span>)</i>
   </span>
   `

const contentFooter =
    `
        <span style="font-size: 10px;padding-left : 5p"><i>
            Generated on: <span class="date"></span><br/>
        </span>
        `

const generatePdf = async (content, hal) => {
    // Save HTML content to a file
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();


    //    const browser = await puppeteer.launch();
    //    const page = await browser.newPage();

    // Read HTML content from file and convert to PDF
    let htmlFilePath = "";
    let pdfFilePath = "";
    if (hal === '1') {
        await fs.promises.writeFile('html/page1.html', content);
        console.log('HTML file has been saved!');
        htmlFilePath = '.html/page1.html';
        // pdfFilePath = 'document/pdf-download-page1-' + new Date().toJSON().slice(0, 10).replace(/-/g, '') +'T'+ new Date().getHours() + new Date().getMinutes() +new Date().getSeconds()+'.pdf';
        pdfFilePath = 'document/pdf-page1-' + new Date().toJSON().slice(0, 10) +'.pdf';
    } else {
        await fs.promises.writeFile('html/page2.html', content);
        console.log('HTML file has been saved!');
        htmlFilePath = '.html/page2.html';
        // pdfFilePath = 'document/pdf-page2-' + new Date().toJSON().slice(0, 10).replace(/-/g, '') +'T'+new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.pdf';
        pdfFilePath = 'document/pdf-page2-' + new Date().toJSON().slice(0, 10) +'.pdf';
    }
    // const contentPdf = await fs.promises.readFile(htmlFilePath, 'utf-8');
    await page.setContent(content, {
        waitUntil: "networkidle0"
    });

    await page.pdf({
        path: pdfFilePath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: contentHeader,
        footerTemplate: contentFooter,
        margin: {
            top: '40px',
            bottom: '40px'
        }
    });


    console.log('PDF file has been generated!');
    await browser.close();
    // console.log(pdfFilePath)
    return pdfFilePath;
}

const mergePdf = async (file) => {
    var pdfBuffer1 = fs.readFileSync('./document/pdf-page1-' + new Date().toJSON().slice(0, 10) +'.pdf');
    var pdfBuffer2 = fs.readFileSync('./document/pdf-page2-' + new Date().toJSON().slice(0, 10) +'.pdf');

    var pdfsToMerge = [pdfBuffer1, pdfBuffer2]

    const mergedPdf = await PDFDocument.create();
    for (const pdfBytes of pdfsToMerge) {
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    }

    const buf = await mergedPdf.save();        // Uint8Array

    let path = './document/automation-result-' +  new Date().toJSON().slice(0, 10) +'T'+new Date().getHours() + new Date().getMinutes() + '.pdf';
    fs.open(path, 'w', function (err, fd) {
        fs.write(fd, buf, 0, buf.length, null, function (err) {
            fs.close(fd, function () {
                console.log('wrote the file successfully');
            });
        });
    });

    return path

}

export { generatePdf, mergePdf };