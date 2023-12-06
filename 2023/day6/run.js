const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')

const [timesLine, distanceLine] = input.split('\n')
const times = timesLine.split(':')[1].match(/\d+/g).map(Number);
const distances = distanceLine.split(':')[1].match(/\d+/g).map(Number);
const options = [];

function getOptions (time, distance) {
    let option = 0;
    for(let ms=0;ms<time;ms++) {
        if (ms * (time - ms) > distance) {
            option++
        }
    }
  return option;
}

for (let i=0;i<times.length;i++) {
    options.push(getOptions(times[i], distances[i]));
}

const time = Number(timesLine.split(':')[1].replaceAll(' ', ''));
const distance = Number(distanceLine.split(':')[1].replaceAll(' ', ''));

const part1 = options.reduce((acc, val) => acc * val, 1)
const part2 = getOptions(time, distance);

console.log('part1', part1)
console.log('part2', part2)
