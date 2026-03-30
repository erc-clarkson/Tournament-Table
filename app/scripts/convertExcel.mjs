import pkg from 'xlsx';
const { readFile, utils } = pkg;
import fs from 'fs';

const workbook = readFile('./app/data/data.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = utils.sheet_to_json(sheet);

fs.writeFileSync('./app/data/data.json', JSON.stringify(json, null, 2));
console.log(`✓ Converted ${json.length} rows`);