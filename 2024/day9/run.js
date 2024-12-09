console.time('part1')
console.time('part2')
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const line = input.split('\n').filter(l => !!l)[0];

// ok lets read the disc
// odd index is fileblocks and even index is free space

let id = 0;
let number = 0;
const disc = [...line].map((char, i) => {
  number = Number(char)
  if (i % 2 === 0) {
    // file block
    return new Array(number).fill(id);
  }
  if (i % 2 === 1) {
    // increment after free space
    id++;

    // free space
    return new Array(number).fill('.');
  }
});

const disc1 = disc.flatMap((v) => v);
const disc2 = [...disc];

function findNextEmpty(disc1, from) {
  for (let i = from + 1; i < disc1.length - 1; i++) {
    if (disc1[i] === '.') {
      return i;
    }
  }
}

let caret = findNextEmpty(disc1, 0);

for (let i = disc1.length - 1; i > caret; i--) {
  if (disc1[i] !== '.') {
    disc1[caret] = disc1[i];
    disc1[i] = '.'
    caret = findNextEmpty(disc1, caret);
  }
}

const part1 = disc1.slice(0,caret).reduce((checksum, char, i) => {
  return checksum + Number(char)*i;
}, 0)
console.timeEnd('part1')

function findNextAvailableEmpty (file, index) {
  for (let i = 0; i < index; i++) {
    if (disc2[i][0] === '.' && disc2[i].length >= file.length) {
      return i
    }
  }
  return -1
}

for (let i = disc2.length - 1; i > 0; i--) {
  if (disc2[i][0] !== '.') {
    const available = findNextAvailableEmpty(disc2[i], i)
    if (available > 0) {
      const restEmpty = new Array(disc2[available].length - disc2[i].length).fill('.')
      disc2[available] = disc2[i]
      disc2[i] = new Array(disc2[i].length).fill('.')
      if (restEmpty.length > 0) {
        disc2.splice(available + 1, 0, restEmpty)
        i++
      }
    }
  }
}

const part2 = disc2.flatMap(v => v).reduce((checksum, char, i) => {
  return char !== '.' ? checksum + Number(char)*i : checksum;
}, 0)
console.timeEnd('part2')

console.log('part1', part1)
console.log('part2', part2)
