const readInput = require('../../utils/readInput');
const input = readInput(__dirname, 'input.txt');
const grid = input.split('\n').filter(l => !!l).map(l => l.split('').map(Number));

const coordKey = (x, y, d) => `${x},${y}_${d}`;

// Dijkstra's algorithm for finding the shortest path from a source vertex to all other vertices in a weighted graph
class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(key, priority) {
        this.queue.push({key, priority});
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.queue.shift().key;
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

let visited = new Set();
let nodes = {};

function shortestPath(x, y, minMoves, maxMoves) {
    const startKeyV = coordKey(x, y, 'v');
    const startKeyH = coordKey(x, y, 'h');
    const pq = new PriorityQueue();

    // Build graph first
    // Set all nodes as vertical or horizontal, a vertical can only move horizontal and a horizontal can only move vertical
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const keyV = coordKey(row, col, 'v');
            const keyH = coordKey(row, col, 'h');

            nodes[keyV] = {dist: Infinity, connections: {}};
            nodes[keyH] = {dist: Infinity, connections: {}};

            for (let i = minMoves; i <= maxMoves; i++) {
                // check left (only v can move)
                if (grid[col - i]) {
                    nodes[keyV].connections[coordKey(row, col - i, 'h')] = 0;
                    for (let j = 1; j <= i; j++) {
                        nodes[keyV].connections[coordKey(row, col - i, 'h')] += grid[col - j][row];
                    }
                }
                // check right (only v can move)
                if (grid[col + i]) {
                    nodes[keyV].connections[coordKey(row, col + i, 'h')] = 0;
                    for (let j = 1; j <= i; j++) {
                        nodes[keyV].connections[coordKey(row, col + i, 'h')] += grid[col + j][row];
                    }
                }
                // check up (only h can move)
                if (grid[col][row - i]) {
                    nodes[keyH].connections[coordKey(row - i, col, 'v')] = 0;
                    for (let j = 1; j <= i; j++) {
                        nodes[keyH].connections[coordKey(row - i, col, 'v')] += grid[col][row - j];
                    }
                }
                // check down (only h can move)
                if (grid[col][row + i]) {
                    nodes[keyH].connections[coordKey(row + i, col, 'v')] = 0;
                    for (let j = 1; j <= i; j++) {
                        nodes[keyH].connections[coordKey(row + i, col, 'v')] += grid[col][row + j];
                    }
                }
            }
        }
    }

    // Then walk through Dijkstra
    // concat vertical and horizontal connections for starting node
    nodes[startKeyV].connections = {...nodes[startKeyV].connections, ...nodes[startKeyH].connections}
    nodes[startKeyV].dist = 0;
    pq.enqueue(startKeyV, 0);

    while (!pq.isEmpty()) {
        const key = pq.dequeue();

        if (visited.has(key)) continue;
        visited.add(key);

        const node = nodes[key];

        for (const connKey of Object.keys(node.connections)) {

            const target = nodes[connKey];
            if (!visited.has(connKey) &&
                node.dist + node.connections[connKey] < target.dist) {
                target.dist = node.dist + node.connections[connKey];
                pq.enqueue(connKey, target.dist);
            }
        }
    }
}

const endX = grid[0].length - 1;
const endY = grid.length - 1;

shortestPath(0, 0, 1, 3);
const part1 = Math.min(nodes[coordKey(endX, endY, 'v')].dist, nodes[coordKey(endX, endY, 'h')].dist);
console.log('part1', part1)

visited = new Set();
nodes = {};

shortestPath(0, 0, 4, 10);
const part2 = Math.min(nodes[coordKey(endX, endY, 'v')].dist, nodes[coordKey(endX, endY, 'h')].dist);

console.log('part2', part2)
