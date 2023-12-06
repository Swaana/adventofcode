const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')
const lines = input.split('\n')
lines.pop()

const commands = lines.map(l => l.split(' ').map((p, i) => i > 0 ? Number(p) : p))

const cmds = {
  noop: 'noop',
  addx: 'addx',
}

let x = 1
let cycleNr = 0
const xValues = []
const signalValues = []
let line = []
const screen = []


function runCycleTick () {
  xValues.push(x);
  cycleNr++;

  const pixel = cycleNr % 40 - 1;
  if (pixel >= x - 1 && pixel <= x + 1) {
    line.push('#');
  } else {
    line.push(' ');
  }

  if (cycleNr % 40 === 0) {
    screen.push(line);
    line = [];
  }

  if ((cycleNr - 20) % 40 === 0) {
    signalValues.push(x * cycleNr);
  }
}

commands.forEach(([cmd, amount]) => {
  if (cmd === cmds.noop) {
    runCycleTick()
  } else if (cmd === cmds.addx) {
    runCycleTick()
    runCycleTick()
    x += amount
  }
})

console.log('part1', signalValues.reduce((sum, v) => sum + v, 0));
console.log('part2');
console.log(screen.map(l => l.join('')).join('\n'));
