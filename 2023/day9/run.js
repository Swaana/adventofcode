
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);
const sequences = lines.map(line => line.split(' ').map(Number))
// console.log(sequences)

function getEdgeValues (sequence) {
  const diffSequence = sequence.reduce((acc, val, i) => {
    if (i > 0) {
      acc.push(val - sequence[i-1]);
    }
    return acc
  }, [])
  // console.log(sequence, diffSequence)
  if (diffSequence[0] === 0 && new Set(diffSequence).size === 1) {
    return {
      prevValue: sequence[0],
      nextValue: sequence[sequence.length - 1]
    }
  }
  const edgeValues = getEdgeValues(diffSequence);
  // console.log(`next is ${sequence[sequence.length - 1]} + ${nextValue} = ${sequence[sequence.length - 1] + nextValue}`)
  return {
    prevValue: sequence[0] - edgeValues.prevValue,
    nextValue: sequence[sequence.length - 1] + edgeValues.nextValue
  }
}
const allEdgeValues = sequences.map(getEdgeValues);
// console.log(allNextValues)
const part1 = allEdgeValues.reduce((sum, val) => sum + val.nextValue, 0);
const part2 = allEdgeValues.reduce((sum, val) => sum + val.prevValue, 0);
console.log('part1', part1)
console.log('part2', part2)
