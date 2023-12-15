const readInput = require('../../utils/readInput');
const runWithCache = require("../../utils/memoize");

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);

// work per line, analyse and work out options
const rows = lines.map((line) => {
    const [springsPart, configPart] = line.split(' ');
    const config = configPart.split(',').map(Number);

    return {
        springs: springsPart,
        config,
    }
})

// console.log(rows)
const countOptions = runWithCache(function (springs, config) {
    if (springs.length === 0) {
        if (config.length === 0) {
            return 1;
        }
        return 0;
    }

    if (config.length === 0) {
        for (let i = 0; i < springs.length; i++) {
            if (springs[i] === "#") {
                return 0;
            }
        }
        return 1;
    }

    if (springs.length < config.reduce((sum, c) => sum + c, 0) + config.length - 1) {
        // not enough springs left to fit config
        return 0;
    }

    if (springs[0] === '.') {
        return countOptions(springs.slice(1), config);
    }

    if (springs[0] === '#') {
      const [dmg, ...restConfig] = config;
        for (let i = 0; i < dmg; i++) {
            if (springs[i] === ".") {
                return 0;
            }
        }
        if (springs[dmg] === "#") {
            return 0;
        }

        return countOptions(springs.slice(dmg + 1), restConfig);
    }
    return (
        countOptions("#" + springs.slice(1), config) +
        countOptions("." + springs.slice(1), config)
    );
});

let part1 = 0
rows.forEach(row => {
    part1 += countOptions(row.springs, row.config)
})

let part2 = 0;
rows.forEach(({ springs, config}) => {
    part2 += countOptions(
        [springs, springs, springs, springs, springs].join('?'),
        [...config, ...config, ...config, ...config, ...config],
    )
})

console.log('part1', part1)
console.log('part2', part2)
