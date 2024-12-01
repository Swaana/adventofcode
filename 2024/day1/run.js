
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);

const leftList = []
const rightList = []

const appearsInRightList = {}

lines.forEach(line => {
  const [leftNumber, rightNumber] = line.split('   ').map(Number);
  leftList.push(leftNumber);
  rightList.push(rightNumber);
  appearsInRightList[rightNumber] = (appearsInRightList[rightNumber] || 0) + 1;
})

leftList.sort();
rightList.sort();

const part1 = leftList.reduce((acc, value, i) => acc + Math.abs(value - rightList[i]), 0)
const part2 = leftList.reduce((acc, value) => acc + value * (appearsInRightList[value] || 0), 0)

console.log('part1', part1)
console.log('part2', part2)
