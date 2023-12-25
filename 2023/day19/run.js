const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const [workflowLines, partLines] = input.split('\n\n').map((lines) => lines.split('\n').filter(l => !!l));

const workflows = {};
let accepted = [];
let rejected = [];

class Workflow {
    constructor(id) {
        this.id = id;
        this.rules = [];
        this.expressions = [];
    }

    process(part) {
        let result;
        for (let rule of this.expressions) {
            if (!rule.operator
                || rule.operator === '>' && part[rule.prop] > rule.value
                || rule.operator === '<' && part[rule.prop] < rule.value
            ) {
                result = rule.result;
            }
            if (result) {
                if (result === 'A') {
                    return accepted.push(part);
                }
                if (result === 'R') {
                    return rejected.push(part);
                }
                return workflows[result].process(part);
            }
        }
    }
    processRange(partRange) {
        let testRange = JSON.parse(JSON.stringify(partRange)); // make a copy
        for (let rule of this.expressions) {
            let result;
            let passRange = JSON.parse(JSON.stringify(testRange)); // make another copy
            if (!rule.operator) {
                result = rule.result;
            }
            if (rule.operator === '>' && testRange[rule.prop][1] > rule.value) {
                // split based on check, example x>2662
                testRange[rule.prop][1] = rule.value;
                passRange[rule.prop][0] = rule.value + 1;
                result = rule.result;
            }
            if (rule.operator === '<' && testRange[rule.prop][0] < rule.value) {
                // example s<1351
                testRange[rule.prop][0] = rule.value;
                passRange[rule.prop][1] = rule.value - 1;
                result = rule.result;
            }
            if (result) {
                if (result === 'A') {
                    accepted.push(passRange);
                } else if (result === 'R') {
                    rejected.push(passRange);
                } else {
                    workflows[result].processRange(passRange);
                }
            }
        }
    }
}

workflowLines.forEach((line) => {
    const [id, rulesPart] = line.replace('}', '').split('{');
    workflows[id] = new Workflow(id);
    rulesPart.split(',').forEach((r) => {
        if (r.includes(':')) {
            const [expression, result] = r.split(':');
            const [_, prop, operator, value] = expression.match(/([a-z]+)([<>])(\d+)/);
            workflows[id].expressions.push({prop, operator, value: +value, result});
            workflows[id].rules.push((part) => eval(`part.${expression}`) ? result : false);
        } else {
            workflows[id].expressions.push({result: r});
            workflows[id].rules.push(() => r);
        }
    });
})

const parts = partLines.map((line) => eval(`(${line.replaceAll('=', ':')})`));
parts.forEach((part) => workflows['in'].process(part));
const part1 = accepted.reduce((sum, p) => sum + p.x + p.m + p.a + p.s, 0);
console.log('part1', part1)

accepted = [];
rejected = [];

// right, so now we process a full range of options.
const startingRange = {x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]}
workflows['in'].processRange(startingRange);
const part2 = accepted.reduce((sum, p) => sum + ((p.x[1]-p.x[0] + 1)*(p.m[1]-p.m[0] + 1)*(p.a[1]-p.a[0] + 1)*(p.s[1]-p.s[0] + 1)), 0);
console.log('part2', part2)
