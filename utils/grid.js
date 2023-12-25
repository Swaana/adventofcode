const move = {
    down: { x: 0, y: 1 },
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 }
}

function asCoordKey (x,y) {
    return `${x},${y}`
}

module.exports = {
    move,
    asCoordKey,
};