
import fs from 'fs';
import path from 'path';

const questionsPath = path.join(process.cwd(), 'src/lib/questions.ts');
const newQuestionsPath = path.join(process.cwd(), 'src/lib/domain3_batch1.json');

const questionsContent = fs.readFileSync(questionsPath, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(newQuestionsPath, 'utf8'));

// Find the end of the SAMPLE_QUESTIONS array
// We look for "];" but before "export async function getQuestions" to be safe, 
// or just find the last occurrence of "];" before the end of the file/start of function.
// Actually, looking for the `];` that closes the variable declaration is best.

const closingMarker = '];';
const insertionPoint = questionsContent.lastIndexOf(closingMarker);

if (insertionPoint === -1) {
    console.error('Could not find insertion point (];) in src/lib/questions.ts');
    process.exit(1);
}

// Prepare the new content
// We need to format the objects to look like TypeScript objects (keys can be unquoted, but JSON is valid JS/TS too).
// However, to match the style, we might want to just dump the JSON content (minus strict JSON quotes on keys if we cared, but TS allows quoted keys).
// We also want to add "as Question," casting if we want to follow the pattern, though the array is typed so it's not strictly necessary. 
// The existing file uses `} as Question,`.

let newContentString = '';

newQuestions.forEach(q => {
    // Stringify with indentation
    let jsonStr = JSON.stringify(q, null, 4);
    // Add "as Question" to the closing brace
    // jsonStr = jsonStr.replace(/}\s*$/, '} as Question,'); 
    // Actually, simply appending the JSON object is fine, typescript will infer it matches the interface.
    // But let's follow the existing pattern if possible.
    // The existing pattern in the file seems to be:
    // {
    //    ...
    // } as Question,

    // Let's just append a comma to the previous item (which we need to handle) and then add the new items.
    // The file effectively ends with `... } as Question, \n ];` or just `... } \n ];`

    // To be safe, we just insert the objects followed by a comma.
    newContentString += '    ' + jsonStr + ',\n';
});

// We need to insert this BEFORE the insertionPoint.
// We also need to make sure the item *before* the insertion point has a trailing comma.
// The easiest way is to ensure our new content starts with a comma if the previous element didn't have one, 
// BUT simpler is just to rely on the fact that the array list usually allows trailing commas.
// Let's perform the splice.

const updatedContent = questionsContent.slice(0, insertionPoint) + '\n' + newContentString + questionsContent.slice(insertionPoint);

fs.writeFileSync(questionsPath, updatedContent);

console.log(`Successfully ingested ${newQuestions.length} questions.`);
