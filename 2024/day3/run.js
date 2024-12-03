
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const line = input.split('\n').filter(l => !!l).join('');

let execute = 1;
const [part1, part2] = line.match(/(mul\(\d+,\d+\)|do\(\)|don't\(\))/g)
  .map(m => {
    if (m === 'do()') { return 1 }
    if (m === 'don\'t()') { return 0 }
    return m.match(/\d+/g).map(Number)
  })
  .reduce(([part1, part2], vals) => {
    if (vals !== 1 && vals !== 0) {
      part1 += vals[0]*vals[1];
      part2 += execute*vals[0]*vals[1]
    } else {
      execute = vals;
    }
    return [part1, part2];
  }, [0,0])

console.log('part1', part1)
console.log('part2', part2)
