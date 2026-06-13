import fs from 'fs';
import pdf from 'pdf-parse';
import path from 'path';

async function test() {
    const file = 'docs/08_Counseling.pdf';
    const pdfPath = path.join(process.cwd(), file);
    if (!fs.existsSync(pdfPath)) {
        console.error('File does not exist:', pdfPath);
        return;
    }
    console.log('Parsing:', file);
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        console.log('Success!');
        console.log('Page count:', data.numpages);
        console.log('Text length:', data.text.trim().length);
        console.log('First 500 characters of text:\n', data.text.trim().substring(0, 500));
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
