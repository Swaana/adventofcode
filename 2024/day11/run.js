
console.time('part1')
console.time('part2')

const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);

function split(number) {
  const half = number.length / 2
  return [Number(number.substring(0, half)), Number(number.substring(half, number.length))]
}

let stones = lines[0].split(' ').reduce((a, v) => {
  a[v] = 1;
  return a;
}, {});

function blink () {
  stones = Object.keys(stones).reduce((a, k) => {
    if (k === '0') {
      a[1] = stones[k];
      return a;
    }
    if (k.length % 2 === 1) {
      const v = Number(k) * 2024;
      a[v] = (a[v] || 0) + stones[k];
    } else {
      const [left, right] = split(k);
      a[left] = (a[left] || 0) + stones[k];
      a[right] = (a[right] || 0) + stones[k];
    }
    return a;
  }, {})
}

let blinks = 0;
while (blinks < 25) {
  blinks += 1;
  blink()
}

const part1 = Object.keys(stones).reduce((nr, s) => nr + stones[s], 0);
console.log('part1', part1)
console.timeEnd('part1')

while (blinks < 75) {
  blinks += 1;
  blink()
}

const part2 = Object.keys(stones).reduce((nr, s) => nr + stones[s], 0);
console.log('part2', part2)
console.timeEnd('part2')
