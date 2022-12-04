const readInput = require('../utils/readInput');

const input = readInput(__dirname, 'input.txt');
const elves = input.split('\n')
const bags = elves.map(b => {
  const nrOfItems = b.length / 2;
  return { left: b.substring(0, nrOfItems), right: b.substring(nrOfItems)}
})
const items = bags.map(b => {
  for (let i=0; i < b.left.length; i++) {
    if (b.right.includes(b.left[i])) {
      return b.left[i]
    }
  }
})

function findCommonChars(a, b) {
  return [...a].map(c => b.includes(c) ? c : '').join('')
}

function getPriorityForChar(char) {
  if (!char) {
    return 0
  }
  const ascii = char.charCodeAt(0)
  if (ascii < 91) {
    return ascii - 65 + 27
  }
  return ascii - 96;
}

console.log('part1', items.map(getPriorityForChar).reduce((sum, code) => sum + code, 0))

const groups = []
let currentGroup = []
elves.forEach((e, i) => {
  if (i % 3 === 0 && currentGroup.length > 0) {
    groups.push(currentGroup)
    currentGroup = []
  }
  currentGroup.push(e)
})
const items2 = groups.map(g => {
  const commonChars = findCommonChars(g[0], g[1]);
  return findCommonChars(commonChars, g[2])[0]
})
console.log('part2', items2.map(getPriorityForChar).reduce((sum, code) => sum + code, 0))
