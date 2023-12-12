
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'inputTst.txt');

const lines = input.split('\n').filter(l => !!l);

// work per line, analyse and work out options
lines.forEach((line) => {
    const [springsPart, configPart] = line.split(' ');
    const configs = configPart.split(',').map(Number);
    const springs = springsPart.split('').map((s) => {
        if (s === '.') {
            return { damaged : false }
        }
        if (s === '#') {
            return { damaged : true }
        }
        if (s === '?') {
            return { unknown: true }
        }
    })
    // find the groups of damaged
    // or, just go from left to right and check options
    // each ? is ether . or #
    // each # is part of broken springs group

    // I think I have it, you walk forward and backtrack once you find an error


    console.log(springs, configs)
})

// console.log('part1', part1)
// console.log('part2', part2)
