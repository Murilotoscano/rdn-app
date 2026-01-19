const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const DOCS_DIR = 'docs';
const OUT_DIR = 'docs/extracted';

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function processAll() {
    const files = fs.readdirSync(DOCS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
    console.log(`Found ${files.length} PDF files.`);

    const summary = [];

    for (const file of files) {
        console.log(`Processing ${file}...`);
        try {
            const dataBuffer = fs.readFileSync(path.join(DOCS_DIR, file));
            const data = await pdf(dataBuffer);

            const outName = file.replace('.pdf', '.json');
            const content = {
                filename: file,
                pageCount: data.numpages,
                text: data.text,
                preview: data.text.substring(0, 200)
            };

            fs.writeFileSync(path.join(OUT_DIR, outName), JSON.stringify(content, null, 2));
            summary.push({ file, pages: data.numpages, success: true });
            console.log(`Saved ${outName} (${data.numpages} pages)`);
        } catch (e) {
            console.error(`Failed to process ${file}:`, e.message);
            summary.push({ file, success: false, error: e.message });
        }
    }

    console.log("\nSummary:");
    console.table(summary);
}

processAll();
