
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l)
  .map(l => [...l]);

const SEARCH_WORD = 'XMAS';

function letterAtCoord({x, y}) {
  return lines[y]?.[x];
}

function isWord(nextCoord) {
  for (let i = 1; i < SEARCH_WORD.length; i++) {
    if (letterAtCoord(nextCoord(i)) !== SEARCH_WORD[i]) {
      return 0;
    }
  }
  return 1;
}

function isCrossMas({x,y}) {
  const corners = [
    letterAtCoord({x: x - 1, y: y - 1}),
    letterAtCoord({x: x + 1, y: y - 1}),
    letterAtCoord({x: x + 1, y: y + 1}),
    letterAtCoord({x: x - 1, y: y + 1}),
  ].join('');

  // console.log(`corners for ${x}${y} is ${corners}`);

  if (corners === 'MMSS'
  || corners === 'MSSM'
  || corners === 'SSMM'
  || corners === 'SMMS') {
    return 1;
  }
  return 0;
}

const part1 = lines.reduce((rowAcc, row, y) => {
  return rowAcc + row.reduce((acc, char, x) => {
    if (char === SEARCH_WORD[0]) {
      let found = 0;
      // left
      if (isWord((i) => ({x: x - i, y}))) found++;
      // left_up
      if (isWord((i) => ({x: x - i, y: y - i}))) found++;
      // up
      if (isWord((i) => ({x, y: y - i}))) found++;
      // up_right
      if (isWord((i) => ({x: x + i, y: y - i}))) found++;
      // right
      if (isWord((i) => ({x: x + i, y}))) found++;
      // right_down
      if (isWord((i) => ({x: x + i, y: y + i}))) found++;
      // down
      if (isWord((i) => ({x, y: y + i}))) found++;
      // down_left
      if (isWord((i) => ({x: x - i, y: y + i}))) found++;
      // console.log(`found ${SEARCH_WORD[0]} at ${x},${y} with ${found} matches`)
      return acc + found;
    }
    return acc;
  }, 0)
}, 0)

const part2 = lines.reduce((rowAcc, row, y) => {
  return rowAcc + row.reduce((acc, char, x) => {
    if (char === 'A') {
      return acc + isCrossMas({x, y});
    }
    return acc;
  }, 0)
}, 0)

console.log('part1', part1)
console.log('part2', part2)
