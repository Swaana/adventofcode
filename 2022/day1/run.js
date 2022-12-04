const readInput = require('../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const elves = input.split('\n\n');
const totals = elves.map(e => e.split('\n').reduce((total, cal) => total + Number(cal), 0))
const totalsDesc = totals.sort((a, b) => a > b ? -1 : b > a ? 1 : 0);
const top3 = totalsDesc.slice(0, 3);

console.log('part1', top3[0])
console.log('part2', top3.reduce((acc, cal) => acc + cal, 0))
