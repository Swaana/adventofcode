const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'inputTst.txt');

const lines = input.split('\n').filter(l => !!l);

// work per line, analyse and work out options
const rows = lines.map((line) => {
    const [springsPart, configPart] = line.split(' ');
    const config = configPart.split(',').map(Number);

    return {
        springs: springsPart.split(''),
        config,
    }
})

// console.log(rows)
let found = [];
function check(index, springs, config, damageLength, damageIndex) {
    // console.log('checking', index, springs.join(''), damageLength, damageIndex, config)
    if (index === springs.length) {
        const dmgs = springs.join('').match(/#+/g)
        if (!dmgs || dmgs.length !== config.length) {
            return;
        }
        for(let i=0;i<dmgs.length;i++) {
            if (dmgs[i].length !== config[i]) {
                return;
            }
        }
        found.push(springs.join(''))
        // console.log('found', springs.join(''), springs.join('').match(/#+/g))
        return;
    }
    const current = springs[index];

    if (current === '#') {
        if (damageLength && config[damageIndex] === damageLength) {
            return;
        }
        check(index + 1, springs, config, damageLength + 1, damageIndex)
    }

    if (current === '.') {
        if (damageLength && config[damageIndex] !== damageLength) {
            return;
        }
        if (damageLength) {
            check(index + 1, springs, config, 0, damageIndex + 1)
        } else {
            check(index + 1, springs, config, 0, damageIndex)
        }
    }

    if (current === '?') {
        // try it as # first, and then as .
        if (config[damageIndex] > damageLength) {
            springs[index] = '#';
            check(index + 1, springs, config, damageLength + 1, damageIndex)
        }
        if (damageLength && config[damageIndex] !== damageLength) {
            springs[index] = '?';
            return;
        }
        springs[index] = '.';
        if (damageLength) {
            check(index + 1, springs, config, 0, damageIndex + 1)
        } else {
            check(index + 1, springs, config, 0, damageIndex)
        }
        springs[index] = '?';
    }
}

rows.forEach(row => {
    check(0, row.springs, row.config, 0, 0)
})

// console.log(found, found.length)
const part1 = found.length;

found = [];
rows.forEach((row, i) => {
    console.log('checking row', i)
    check(0,
        [...row.springs, '?', ...row.springs, '?', ...row.springs, '?', ...row.springs, '?', ...row.springs],
        [...row.config, ...row.config, ...row.config, ...row.config, ...row.config], 0, 0)
})

const part2 = found.length;
console.log('part1', part1)
console.log('part2', part2)
