const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')
const tests = input.split('\n')

function hasDuplicateChars (value) {
  const charArray = [value[0]]
  for (let i = 1; i < value.length; i++) {
    if (charArray.includes(value[i])) {
      return true;
    }
    charArray.push(value[i]);
  }
  return false;
}

function getStartOfPacketIndex (data, nrOfDistinct) {
  for (let i = 0; i < data.length - nrOfDistinct; i++) {
    if (!hasDuplicateChars(data.substring(i, i + nrOfDistinct))) {
      return i + nrOfDistinct;
    }
  }
}

console.log('part1', getStartOfPacketIndex(tests[0], 4))
console.log('part2', getStartOfPacketIndex(tests[0], 14))
