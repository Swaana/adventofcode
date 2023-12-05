const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);
const copies = {};

const cards = lines.map((line) => {
  const [namePart, numberPart] = line.split(':');
  const cardNumber = Number(namePart.split(' ')[namePart.split(' ').length - 1]);
  const [winPart, scratchPart] = numberPart.trim().split('|')
  const winningNumbers = new Set(winPart.trim().split(' ').map(Number).filter((i) => i > 0))
  const scratchNumbers = new Set(scratchPart.trim().split(' ').map(Number))
  const sameNumbers = new Set([...winningNumbers].filter(i => scratchNumbers.has(i)))
  const nrOfCards = 1 + (copies[cardNumber] || 0)
  for (let i=0;i<sameNumbers.size;i++) {
    copies[cardNumber + 1 + i] = copies[cardNumber + 1 + i] || 0;
    copies[cardNumber + 1 + i] += nrOfCards;
  }
  return {
    line,
    cardNumber,
    winningNumbers,
    scratchNumbers,
    sameNumbers,
    nrOfCards,
    match: sameNumbers.size,
    points: sameNumbers.size ? Math.pow(2, sameNumbers.size - 1) : 0,
  }
})

// console.log(cards[0])
// console.log(copies)

console.log('part1', cards.reduce((sum, val) => sum + val.points, 0))
console.log('part2', lines.length + Object.keys(copies).reduce((sum, key) => sum + copies[key], 0))
