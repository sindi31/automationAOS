import * as fs from 'fs';
import puppeteer from 'puppeteer';
import { pdf } from 'puppeteer-report';
import { PDFDocument } from "pdf-lib";
import config from '../constanta/config.js';

const contentHeader = `
   <span style="font-size: 10px;padding-left : 15px"><i>
         This is a custom PDF for Automation Test Result
       <span>B2C AstraOtoshop</span> (<span> https://astraotoshop.com </span>)</i>
   </span>
   `

const contentFooter =

    `
        <span style="font-size: 10px;padding-left : 15px"><i>
            Generated on: <span class="date"></span><br/>
            Page <span class="pageNumber"></span> of <span class="totalPages "></span>
        </span>
        `

const generatePdf = async (content, paymentMethod, pointAmount, couponUsed) => {
    // Save HTML content to a file

    // console.log('kupon:',couponUsed[0]);
    // console.log('point:',pointAmount);

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    // Read HTML content from file and convert to PDF
    let htmlFilePath = "";
    let pdfFilePath = "";

    // await fs.promises.writeFile('../html/page1.html', content);
    await fs.promises.writeFile(config.BASE_DIRECTORY + 'page.html', content);
    htmlFilePath = config.BASE_DIRECTORY + 'page1.html';



    // pdfFilePath = 'document/pdf-download-page1-' + new Date().toJSON().slice(0, 10).replace(/-/g, '') +'T'+ new Date().getHours() + new Date().getMinutes() +new Date().getSeconds()+'.pdf';
    let couponName = couponUsed[0] === '' ? '-Tidak Menggunakan Kupon' : '-kupon=' + couponUsed;
    let pointUsed = pointAmount === '' ? '-Tidak Menggunakan Poin' : '-poin=' + pointAmount;

    let folder = config.BASE_DIRECTORY + new Date().toJSON().slice(0, 10);
    console.log('folder', folder);
    console.log('coba 1')
    await fs.access(config.BASE_DIRECTORY + new Date().toJSON().slice(0, 10), function (err) {
        if (err && err.code === 'ENOENT') {
            fs.mkdir(config.BASE_DIRECTORY + new Date().toJSON().slice(0, 10), { recursive: true }, (err) => {
                if (err) throw err;
            })
        }
    });
    console.log('coba 2')
    pdfFilePath = config.BASE_DIRECTORY + new Date().toJSON().slice(0, 10) + '/' + 'Result-' + new Date().toJSON().slice(0, 10) + '-' + paymentMethod.replace("/", "") +
        pointUsed + couponName + '.pdf';

    console.log('pdfFilePath', pdfFilePath)
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
            top: '30px',
            bottom: '40px'
        }
    });


    console.log('PDF file has been generated!');
    await browser.close();
    // console.log(pdfFilePath)
    return pdfFilePath;
}

const mergePdf = async (file) => {
    var pdfBuffer1 = fs.readFileSync('./document/pdf-page1-' + new Date().toJSON().slice(0, 10) + '.pdf');
    var pdfBuffer2 = fs.readFileSync('./document/pdf-page2-' + new Date().toJSON().slice(0, 10) + '.pdf');

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

    let path = './document/automation-result-' + new Date().toJSON().slice(0, 10) + 'T' + new Date().getHours() + new Date().getMinutes() + '.pdf';
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