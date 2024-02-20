import oneFlowOrderCancel from "../index2.js";
import puppeteer from "puppeteer-extra";

const cancelBatalkanVA = (async() => {
    await oneFlowOrderCancel('Credit Card');

})();