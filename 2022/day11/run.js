const readInput = require('../utils/readInput')
const { sortByNumberDesc } = require('../utils/sortUtils')
const start = process.hrtime();
const input = readInput(__dirname, 'inputTst.txt')

const operator = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
}

const monkeys = input
  .split('\n\n')
  .map((m) => {
    const lines = m.split('\n')
    const items = lines[1].substring(18).split(', ').map(BigInt)

    const worryLevelParts = lines[2].substring(13).split(' ');
    const sign = worryLevelParts[3];
    const b = isNaN(worryLevelParts[4]) ? false : BigInt(worryLevelParts[4]);

    // part1
    // const getWorryLevel = (v) => operator[sign](v, b || v) / 3n;

    //part 2
    const getWorryLevel = (v) => operator[sign](v, b || v);

    const mod = BigInt(lines[3].split(' ').pop())
    const trueMonkey = Number(lines[4].split(' ').pop())
    const falseMonkey = Number(lines[5].split(' ').pop())
    return { items, getWorryLevel, mod, trueMonkey, falseMonkey, itemsInspected: 0 }
  });
// console.log(monkeys)
function monkeyTurn (monkey, index) {
  while (monkey.items.length > 0) {
    const currentItem = monkey.items.shift();
    const worryLevel = monkey.getWorryLevel(currentItem);
    monkey.itemsInspected++;
    const nextMonkey = worryLevel % monkey.mod === 0n ? monkey.trueMonkey : monkey.falseMonkey;
    monkeys[nextMonkey].items.push(worryLevel)
  }
}

let roundNr = 0;
function runRound () {
  roundNr++;
  monkeys.forEach(monkeyTurn);
}

function runRounds (x) {
  while(roundNr < x) {
    runRound();
    if ([1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, x].includes(roundNr)) {
      console.log('After round', roundNr);
      console.log(monkeys.map(m => m.itemsInspected))
    }
  }
}
runRounds(700);
// console.log(monkeys.map(m => ({ nr: m.itemsInspected, items: m.items })));
const activity = monkeys.map(m => m.itemsInspected).sort(sortByNumberDesc);
console.log('activity', activity)
console.log('part2', activity[0] * activity[1])

const elapsed = process.hrtime(start);

console.log(`${elapsed[0]}s`, `${(elapsed[1] / 1000000).toFixed(3)}ms`)
