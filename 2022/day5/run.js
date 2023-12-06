const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')
const [cargo, movements] = input.split('\n\n').map(i => i.split('\n'))
movements.pop()

const stackPositions = [];
[...cargo.pop()].forEach((s, i) => {
  if (s !== ' ') {
    stackPositions.push(i)
  }
})

const stacks = new Array(...stackPositions.map(() => ([])))
cargo.forEach(c => {
  stackPositions.forEach((p, i) => {
    if (c[p] && c[p] !== ' ') {
      stacks[i].push(c[p])
    }
  })
})

const stacks2 = stacks.map(s => [...s])

movements.forEach((m) => {
  const parts = m.split(' ');
  let amount = Number(parts[1]);
  const from = Number(parts[3]) - 1;
  const to = Number(parts[5]) - 1;
  stacks2[to].splice(0, 0, ...stacks2[from].splice(0, amount))
  while (amount > 0) {
    stacks[to].unshift(stacks[from].shift())
    amount--;
  }
})

console.log('part1', stacks.map(s => s[0]).join(''))
console.log('part2', stacks2.map(s => s[0]).join(''))
