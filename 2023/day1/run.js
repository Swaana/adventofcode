const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');
const input2 = readInput(__dirname, 'input.txt');

const codes = input.split('\r\n');
const codes2 = input2.split('\r\n');

function numberFromWord(word) {
    if (word.startsWith('one')) {
        return 1;
    }
    if (word.startsWith('two')) {
        return 2;
    }
    if (word.startsWith('three')) {
        return 3;
    }
    if (word.startsWith('four')) {
        return 4;
    }
    if (word.startsWith('five')) {
        return 5;
    }
    if (word.startsWith('six')) {
        return 6;
    }
    if (word.startsWith('seven')) {
        return 7;
    }
    if (word.startsWith('eight')) {
        return 8;
    }
    if (word.startsWith('nine')) {
        return 9;
    }
}

function getFirstNumber(code, withWords) {
    for (let i=0;i<code.length;i++) {
        if (!isNaN(code[i])) {
            return code[i];
        }
        if (withWords && !isNaN(numberFromWord(code.substring(i)))) {
            return numberFromWord(code.substring(i));
        }
    }
}

function getLastNumber(code, withWords) {
    for (let i=code.length - 1;i>=0;i--) {
        if (!isNaN(code[i])) {
            return code[i];
        }
        if (withWords && !isNaN(numberFromWord(code.substring(i)))) {
            return numberFromWord(code.substring(i));
        }
    }
}

const calibrationValuesPart1 = codes.map((code) => Number(`${getFirstNumber(code)}${getLastNumber(code)}`))
const calibrationValuesPart2 = codes2.map((code) => Number(`${getFirstNumber(code, true)}${getLastNumber(code, true)}`))

console.log('part1', calibrationValuesPart1.reduce((acc, cal) => acc + cal, 0))
console.log('part2', calibrationValuesPart2.reduce((acc, cal) => acc + cal, 0))
