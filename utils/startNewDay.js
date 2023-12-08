const fs = require('fs');
const path = require('path');

// check if year and day are provided as arguments
if (process.argv.length !== 4) {
    console.error('Usage: node createFolders.js <year> <daynumber>');
    process.exit(1);
}

const year = process.argv[2];
const day = process.argv[3];

// Create folder structure for the year
const yearFolder = path.join(__dirname, '..', year);
const dayFolder = path.join(yearFolder, 'day' + day);
const runJsFile = path.join(dayFolder, 'run.js');

if (!fs.existsSync(dayFolder)) {
    // Create folders
    fs.mkdirSync(yearFolder, {recursive: true});
    fs.mkdirSync(dayFolder, {recursive: true});
}
if (!fs.existsSync(runJsFile)) {
    // Create run.js file
    fs.writeFileSync(runJsFile, `
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'inputTst.txt');

const lines = input.split('\\n').filter(l => !!l);

// console.log('part1', part1)
// console.log('part2', part2)
`);
} else {
    console.error(`Skipping: ${runJsFile} already exists`);
}

// Create data folder structure
const dataFolder = path.join(__dirname, '..', 'data');
const yearDataFolder = path.join(dataFolder, year);
const dayDataFolder = path.join(yearDataFolder, 'day' + day);
const inputDataFile = path.join(dayDataFolder, 'input.txt');
const inputTstDataFile = path.join(dayDataFolder, 'inputTst.txt');

if (!fs.existsSync(dayDataFolder)) {
    // Create data folders
    fs.mkdirSync(dataFolder, {recursive: true});
    fs.mkdirSync(yearDataFolder, {recursive: true});
    fs.mkdirSync(dayDataFolder, {recursive: true});
}
// Create input.txt and inputTst.txt files
if (!fs.existsSync(inputDataFile)) {
    fs.writeFileSync(inputDataFile, 'input goes here');
} else {
    console.error(`Skipping: ${inputDataFile} already exists`);
}
if (!fs.existsSync(inputTstDataFile)) {
    fs.writeFileSync(inputTstDataFile, 'test input goes here');
} else {
    console.error(`Skipping: ${inputTstDataFile} already exists`);
}

console.log('Folders and files created successfully.');