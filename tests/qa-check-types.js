import { QuestionBank } from '../js/question-bank.js';

const all = QuestionBank.getAll();
const types = {};
all.forEach(q => {
  types[q.type] = (types[q.type] || 0) + 1;
});

console.log('Total question types in catalog:', types);

const byLangAndType = {};
all.forEach(q => {
  if (!byLangAndType[q.language]) byLangAndType[q.language] = {};
  byLangAndType[q.language][q.type] = (byLangAndType[q.language][q.type] || 0) + 1;
});
console.table(byLangAndType);
