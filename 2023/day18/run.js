const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);
const digPlan = lines.map(l => {
    const [direction, number, color] = l.split(' ')
    return {
        direction,
        number: +number,
        color: color.replace(/([()])/g, ''),
    }
});
const digPlan2 = lines.map(l => {
    const [_, __, color] = l.split(' ')
    let colorCode = color.replace(/([(#)])/g, '')

    const number = parseInt(colorCode.substring(0, colorCode.length - 1), 16);
    const direction = colorCode.substring(colorCode.length - 1);

    return {
        direction: direction === '0' ? 'R' : direction === '1' ? 'D' : direction === '2' ? 'L' : 'U',
        number,
        color: color.replace(/([()])/g, ''),
    }
});

function getVolume(plan) {
    let currentX = 0, currentY = 0;
    const coords =  [];
    let pointsOnLine = 0;
    plan.forEach(({direction, number}) => {
        pointsOnLine += number;
        if (direction === 'R') {
            currentX += number;
        }
        if (direction === 'L') {
            currentX -= number;
        }
        if (direction === 'U') {
            currentY -= number;
        }
        if (direction === 'D') {
            currentY += number;
        }
        coords.push([currentX, currentY]);
    })

    let area = 0;
    // A = 1/2 * sum (i = 1 => n) |(x(i+1) + x(i)) (y(i+1) - y(i))|
    let j;
    for (let i=0;i<coords.length;i++) {
        j = (i + 1) % coords.length;
        area += (coords[i][1] + coords[j][1]) * (coords[i][0] - coords[j][0]);
    }
    area = Math.abs(area/2);
    // Picks theorem: https://en.wikipedia.org/wiki/Pick's_theorem
    // A = i + b/2 - 1 -> i = A + 1 - b/2
    const pointsInside = area + 1 - pointsOnLine/2;
    return pointsInside + pointsOnLine;
}

const part1 = getVolume(digPlan);
console.log('part1', part1)

const part2 = getVolume(digPlan2);
console.log('part2', part2)
