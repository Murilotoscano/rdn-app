
import fs from 'fs';
import pdf from 'pdf-parse';
import path from 'path';




const pdfPath = path.join(process.cwd(), 'docs/Research Concepts _ All Access Dietetics.pdf');



const outputPath = path.join(process.cwd(), 'docs/extracted.txt');

let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync(outputPath, data.text);
    console.log(`Successfully extracted text to ${outputPath}`);
    console.log(`Total pages: ${data.numpages}`);
}).catch(function (error) {
    console.error('Error extracting PDF:', error);
});
