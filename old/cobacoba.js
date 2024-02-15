import { sendMail } from "./utils/baseService.js"


const filename = ["automation-result-2024-02-14T171622.pdf", "automation-result-2024-02-14T1712.mp4"]
const filePath = ["./document/automation-result-2024-02-14T171622.pdf", "./document/automation-result-2024-02-14T1712.mp4"]


// const filename = "automation-result-2024-02-14T171622.pdf"
// const filePath = "./document/automation-result-2024-02-14T171622.pdf"
// let arrayAttach = [];
// for (let i = 0; i < filename.length; i++) {
//   arrayAttach[i] = {
//     filename: filename[i],
//     path: filePath[i],
//   }

// }
// console.log(arrayAttach)
await sendMail(filename, filePath);