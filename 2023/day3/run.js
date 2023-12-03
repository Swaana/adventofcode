const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);

const LINE_LENGTH = lines[0].length;

const symbols = {};
const numbers = [];
const partNumbers = [];
const nonPartNumbers = [];

function setSymbol (symbol, x, y) {
  symbols[`${x},${y}`] = symbol;
}

function setNumber (number, x, y) {
  numbers.push({
    value: Number(number),
    digits: number.length,
    x: x - number.length,
    y,
  })
}

function isSymbol (char) {
  return char !== '.' && isNaN(char);
}

let number = ''
for (let y=0;y<lines.length;y++) {
  if (number) {
    setNumber(number, LINE_LENGTH, y - 1);
    number = ''
  }
  for (let x=0;x<lines[y].length;x++) {
    const char = lines[y][x];
    if (!isNaN(char)) {
      // working on a number now
      number += char;
    } else {
      if (number) {
        setNumber(number, x, y);
        number = ''
      }
      if (isSymbol(char)) {
        setSymbol(char, x, y);
      }
    }
  }
}

const gears = {}

function isPartNumber (number) {
  const { x, y, digits } = number;
  const matches = [];
  // left
  if (symbols[`${x - 1},${y}`]) {
    // console.log('Match:', number, `${x - 1},${y}`, symbols[`${x - 1},${y}`], '(left)');
    matches.push(`${x - 1},${y}`)
  }
  // right
  if (symbols[`${x + digits},${y}`]) {
    // console.log('Match:', number, `${x + digits},${y}`, symbols[`${x + digits},${y}`], '(right)');
    matches.push(`${x + digits},${y}`)
  }
  // top row
  for (let i = x-1; i < x + digits + 1; i++) {
    if (symbols[`${ i },${ y - 1 }`]) {
      // console.log('Match:', number, `${ i },${ y - 1 }`, symbols[`${ i },${ y - 1 }`], '(top row)')
      matches.push(`${ i },${ y - 1 }`)
    }
  }

  // bottom row
  for (let i =x-1; i < x + digits + 1; i++) {
    if (symbols[`${ i },${ y + 1 }`]) {
      // console.log('Match:', number, `${ i },${ y + 1 }`, symbols[`${ i },${ y + 1 }`], '(bottom row)')
      matches.push(`${ i },${ y + 1 }`)
    }
  }
  matches.forEach((coord) => {
    if (symbols[coord] === '*') {
      gears[coord] = gears[coord] || [];
      gears[coord].push(number);
    }
  })
  return matches.length > 0;
}

// now find part numbers and sum them up
let part1 = 0;
numbers.forEach(number => {
  if (isPartNumber(number)) {
    partNumbers.push(number);
    part1 += number.value;
  } else {
    nonPartNumbers.push(number);
  }
})

const part2 = Object.keys(gears).reduce((acc, gear) => {
  if (gears[gear].length === 2) {
    acc += gears[gear][0].value * gears[gear][1].value;
  }
  return acc;
}, 0);

// console.log(gears)
// console.log(symbols);
// console.log(numbers);
// console.log(partNumbers);
// console.log(nonPartNumbers);

console.log('part1', part1)
console.log('part2', part2)
