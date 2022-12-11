const readInput = require('../utils/readInput')
const { sortByNumberDesc } = require('../utils/sortUtils')
const input = readInput(__dirname, 'input.txt')

const operator = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
  '^2': (a) => a * a,
}

const monkeysInput = input
  .split('\n\n')
  .map((m) => {
    const lines = m.split('\n')
    const items = lines[1].substring(18).split(', ').map(Number)

    const worryLevelParts = lines[2].substring(13).split(' ')
    const sign = worryLevelParts[4] === 'old' ? '^2' : worryLevelParts[3]
    const b = Number(worryLevelParts[4])

    const testValue = Number(lines[3].split(' ').pop())
    const trueMonkey = Number(lines[4].split(' ').pop())
    const falseMonkey = Number(lines[5].split(' ').pop())

    return { items, sign, b, testValue, trueMonkey, falseMonkey, itemsInspected: 0 }
  })

const denominator = monkeysInput.map(m => m.testValue).reduce((a, b) => a * b)

let monkeys

function monkeyTurn (monkey) {
  while (monkey.items.length > 0) {
    const currentItem = monkey.items.shift()
    const worryLevel = monkey.getWorryLevel(currentItem) % denominator;
    const nextMonkey = worryLevel % monkey.testValue === 0 ? monkey.trueMonkey : monkey.falseMonkey
    monkeys[nextMonkey].items.push(worryLevel)

    monkey.itemsInspected++
  }
}

function runRounds (x, hasRelief, isLog) {
  monkeys = JSON.parse(JSON.stringify(monkeysInput)).map(m => ({
    ...m,
    getWorryLevel: hasRelief
      ? (v) => Math.floor(operator[m.sign](v, m.b) / 3)
      : (v) => operator[m.sign](v, m.b)
  }))
  let roundNr = 0
  while (roundNr < x) {
    roundNr++
    monkeys.forEach(monkeyTurn)

    if (isLog && [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, x].includes(roundNr)) {
      console.log('After round', roundNr)
      console.log(monkeys.map(m => m.itemsInspected))
    }
  }
  const activity = monkeys.map(m => m.itemsInspected).sort(sortByNumberDesc)
  return activity[0] * activity[1]
}

console.log('part1', runRounds(20, true))
console.log('part2', runRounds(10000))
