import fs from 'fs';
import pdf from 'pdf-parse';
import path from 'path';

const pdfPath = path.join(process.cwd(), 'public/RD_Exam_Practice_Questions_with_Rationales_September_2024_Corrected.pdf');
const outputPath = path.join(process.cwd(), 'docs/cdr_extracted.txt');

console.log('Reading PDF from:', pdfPath);
let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync(outputPath, data.text);
    console.log(`Successfully extracted text to ${outputPath}`);
    console.log(`Total pages: ${data.numpages}`);
}).catch(function (error) {
    console.error('Error extracting PDF:', error);
});
