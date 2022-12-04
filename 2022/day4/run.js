const readInput = require('../utils/readInput');

const input = readInput(__dirname, 'input.txt');
const pairs = input.split('\n').map(p => {
  return p.split(',').map(e => e.split('-').map(n => Number(n)))
});

pairs.pop()

function hasIntersect(a, b) {
  return a[0] <= b[0] && a[1] >= b[1]
}

function isInRange(value, list) {
  return value >= list[0] && value <= list[1]
}

function hasOverlap(a, b) {
  return isInRange(b[0], a) || isInRange(b[1], a)
}

const completeOverlappedPairs = pairs.filter(p => {
  const elf1 = p[0]
  const elf2 = p[1]
  return hasIntersect(elf1, elf2) || hasIntersect(elf2, elf1)
})

const overlappedPairs = pairs.filter(p => {
  const elf1 = p[0]
  const elf2 = p[1]
  return hasOverlap(elf1, elf2) || hasOverlap(elf2, elf1)
})

console.log('part1', completeOverlappedPairs.length)
console.log('part2', overlappedPairs.length)
