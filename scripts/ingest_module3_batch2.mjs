
import fs from 'fs';
import path from 'path';

const questionsPath = path.join(process.cwd(), 'src/lib/questions.ts');
const newQuestionsPath = path.join(process.cwd(), 'src/lib/domain3_batch2.json');

const questionsContent = fs.readFileSync(questionsPath, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(newQuestionsPath, 'utf8'));

// Find the end of the SAMPLE_QUESTIONS array
// We look for "];" that closes the array. 
// Ideally we find `];` followed by `export async function getQuestions` or just the last `];` before the function.

// A robust way in this file (which ends with the function) is to look for `];` before `export async function`.
const functionStart = questionsContent.indexOf('export async function getQuestions');
if (functionStart === -1) {
    console.error('Could not find getQuestions function export');
    process.exit(1);
}

const closingMarker = '];';
const insertionPoint = questionsContent.lastIndexOf(closingMarker, functionStart);

if (insertionPoint === -1) {
    console.error('Could not find insertion point (];) in src/lib/questions.ts');
    process.exit(1);
}

let newContentString = '';
newQuestions.forEach(q => {
    let jsonStr = JSON.stringify(q, null, 4);
    newContentString += '    ' + jsonStr + ',\n';
});

const updatedContent = questionsContent.slice(0, insertionPoint) + '\n' + newContentString + questionsContent.slice(insertionPoint);

fs.writeFileSync(questionsPath, updatedContent);

console.log(`Successfully ingested ${newQuestions.length} questions from Batch 2.`);
