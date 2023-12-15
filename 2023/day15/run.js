const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const sequence = input.split('\n')[0].split(',');

function hash(value) {
    let currentValue = 0;
    value.split('').forEach(char => {
        currentValue += char.charCodeAt(0);
        currentValue *= 17;
        currentValue %= 256;
    })
    return currentValue;
}

const hashes = sequence.map(hash)
const part1 = hashes.reduce((sum, v) => sum + v, 0)

const boxes = new Map();

function getStep(step) {
    const [label, operator, focal] = step.match(/([a-z]+|[=-]|\d+)/g);
    return {label, operator, focal}
}

sequence
    .map(getStep)
    .forEach(step => {
        const boxNr = hash(step.label);
        const box = boxes.get(boxNr) || [];
        if (step.operator === '=') {
            const existingLens = box.find(b => b.label === step.label)
            if (existingLens) {
               box[box.indexOf(existingLens)] = step
            } else {
                box.push(step)
            }
        }
        if (step.operator === '-') {
            const existingLens = box.find(b => b.label === step.label)
            if (existingLens) {
                box.splice(box.indexOf(existingLens), 1)
            }
        }
        boxes.set(boxNr, box)
    })

// console.log(boxes);

const part2 = [...boxes.keys()].reduce((sum, boxNr) => {
    const box = boxes.get(boxNr)
    return sum + box.reduce((power, lens, i) => power + (boxNr + 1) * (i + 1) * Number(lens.focal), 0)
}, 0)

console.log('part1', part1)
console.log('part2', part2)
