const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);

const moveInstructions = lines[0];

function Node(name) {
    this.name = name;
    this.left = null;
    this.right = null;
}

const nodes = new Map()

lines.slice(1).forEach(line => {
    const name = line.substring(0, 3);
    const left = line.substring(7, 10);
    const right = line.substring(12, 15);
    let node = nodes.get(name) || new Node(name);
    nodes.set(name, node)
    node.left = nodes.get(left) || new Node(left);
    nodes.set(left, node.left);
    node.right = nodes.get(right) || new Node(right);
    nodes.set(right, node.right);
});

function getStepsToEnd(node) {
    if (!node) return 0;
    let currentNode = node;
    let step = 0;
    let arrived = false;
    while (!arrived) {
        const move = moveInstructions[step % moveInstructions.length];
        if (move === 'L') {
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }
        arrived = currentNode.name[2] === 'Z';
        step++;
    }
    return { steps: step, endNode: currentNode.name } ;
}
// PART 1
const part1 = getStepsToEnd(nodes.get('AAA')).steps;

// PART 2
const currentNodes = [...nodes.values()].filter(n => n.name.endsWith('A'));
const endNodes = currentNodes.map(node => ({ startNode: node.name, ...getStepsToEnd(node) }))

function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}
function lcm(numbers) {
    return numbers.reduce((a, b) => (a * b) / gcd(a, b));
}

const part2 = lcm(endNodes.map(n => n.steps));

console.log('part1', part1)
console.log('part2', part2)
