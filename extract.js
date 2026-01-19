const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('docs/Management+Concepts_OCT2022-color+(1).pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('docs/extracted.txt', data.text);
    console.log("Success! Extracted characters:", data.text.length);
    console.log("Pages:", data.numpages);
    console.log("Preview:", data.text.substring(0, 500).replace(/\n/g, ' '));
}).catch(e => console.error("Error:", e));
