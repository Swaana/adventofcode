const readInput = require('../../utils/readInput')
const input = readInput(__dirname, 'input.txt')

const pairs = input
  .substring(0, input.length - 1)
  .split('\n\n')
  .map(pair => pair.split('\n').map(JSON.parse));

function isArrayCorrectOrder(left, right, pairNr) {
  if (!Array.isArray(left)) {
    left = [left]
  }
  if (!Array.isArray(right)) {
    right = [right]
  }

  for (let i = 0; i < left.length; i++) {
    if (right[i] === undefined) {
      return false;
    }
    if (Array.isArray(left[i]) || Array.isArray(right[i])) {
      const checkResult = isArrayCorrectOrder(left[i], right[i], pairNr)
      if (checkResult !== undefined) {
        return checkResult;
      }
    }
    if (left[i] < right[i]) {
      return true;
    }

    if (left[i] > right[i]) {
      return false;
    }
  }
  if (right.length > left.length) {
    return true;
  }
}

const check = pairs.map(([left, right], index) => {
  const checkResult = isArrayCorrectOrder(left, right, index + 1)
  if (checkResult || checkResult === undefined) {
    return index + 1;
  }
  return 0;
})

const packets = input
  .split('\n')
  .filter(l => `${l}`.length > 0)
  .map(JSON.parse);

const dividerPackets = [[[2]], [[6]]]
packets.push(dividerPackets[0]);
packets.push(dividerPackets[1]);
packets.sort((a, b) => isArrayCorrectOrder(a, b) ? -1 : 1)
const indices = [packets.indexOf(dividerPackets[0]) + 1, packets.indexOf(dividerPackets[1]) + 1]

console.log('part1', check.reduce((sum, v) => sum + v, 0))
console.log('part2', indices[0]*indices[1])
