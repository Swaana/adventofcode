const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const nodes = input.split('\n\n').map(n => n.split('\n').filter(l => !!l));

function hasSmudge(row1, row2) {
    let diffs = 0;
    row1.split('').forEach((r, i) => {
        if (r !== row2[i]) {
            diffs++;
        }
    })
    return diffs === 1;
}

function findHorizontalReflection(rows, smudge) {
    let smudgeUsed = false;
    let i = 0;
    let r = 0;
    while (i < rows.length - 1) {
        smudgeUsed = false;
        const j = i + 1;
        if (rows[i] === rows[j] || smudge && hasSmudge(rows[i], rows[j])) {
            if (rows[i] !== rows[j]) {
                smudgeUsed = true;
            }
            // found reflection, check if it goes to edge
            let k = 1;
            let isPerfect = true;
            while (rows[i - k] && rows[j + k]) {
                if (rows[i - k] !== rows[j + k]) {
                    if (smudge && !smudgeUsed && hasSmudge(rows[i - k], rows[j + k])) {
                        // console.log('used smudge')
                        smudgeUsed = true;
                    } else {
                        isPerfect = false;
                        break;
                    }
                }
                k++;
            }
             r = isPerfect && (!smudge || smudge && smudgeUsed) ? j : r;
        }
        i++;
    }
    return r;
}

function findVerticalReflection(rows, smudge) {
    const cols = [];
    for (let i = 0; i < rows[0].length; i++) {
        cols.push(rows.map(r => r[i]).join(''))
    }
    // console.log(cols.join('\n'))
    return findHorizontalReflection(cols, smudge)
}

const results = nodes.map(n => {
    const horizontal = findHorizontalReflection(n);
    if (horizontal) {
        return 100 * horizontal;
    }
    return findVerticalReflection(n)
})
// console.log(results);

const results2 = nodes.map(n => {
    const horizontal = findHorizontalReflection(n, true);
    if (horizontal) {
        return 100 * horizontal;
    }
    return findVerticalReflection(n, true)
})
// console.log(results2);
const part1 = results.reduce((sum, r) => sum + r, 0);
const part2 = results2.reduce((sum, r) => sum + r, 0);
console.log('part1', part1)
console.log('part2', part2)
