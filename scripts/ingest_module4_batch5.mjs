
import fs from 'fs';
import path from 'path';

const questionsPath = path.join(process.cwd(), 'src/lib/questions.ts');
const newQuestionsPath = path.join(process.cwd(), 'src/lib/domain4_batch5.json');

const questionsContent = fs.readFileSync(questionsPath, 'utf8');
const newQuestions = JSON.parse(fs.readFileSync(newQuestionsPath, 'utf8'));

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

console.log(`Successfully ingested ${newQuestions.length} questions from Module 4 Batch 5.`);
