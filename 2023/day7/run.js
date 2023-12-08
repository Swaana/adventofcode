const readInput = require('../../utils/readInput');
const { sortByNumber } = require('../../utils/sortUtils');

const input = readInput(__dirname, 'input.txt');

const lines = input.split('\n').filter(l => !!l);

const cardRank = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2
}

const handRank = {
    fiveOfAKind: 6,
    fourOfAKind: 5,
    fullHouse: 4,
    threeOfAKind: 3,
    twoPairs: 2,
    onePair: 1,
    highCard: 0,
}

const hands = lines.map(line => {
    const [cardPart, betPart] = line.split(' ');
    const cards = [...cardPart];
    const bet = Number(betPart);
    const type = getTypeOfHand(cards);
    return {cards, bet, type};
})

function getTypeOfHand (cards, includeJokers) {
    const cardCounts = cards.reduce((acc, card) => {
        acc[card] = acc[card] ? acc[card] + 1 : 1;
        return acc;
    }, {});
    let jokerCount = 0;
    if (includeJokers && cardCounts.J) {
        jokerCount = cardCounts.J;
        cardCounts.J = 0;
    }
    const counts = Object.values(cardCounts).sort(sortByNumber).reverse();
    if ((counts[0] + jokerCount) === 5) {
        return 'fiveOfAKind';
    }
    if ((counts[0] + jokerCount) === 4) {
        return 'fourOfAKind';
    }
    if (counts[0] === 3 && counts[1] === 2 || (counts[0] + jokerCount) === 3 && counts[1] === 2) {
        return 'fullHouse';
    }
    if ((counts[0] + jokerCount) === 3) {
        return 'threeOfAKind';
    }
    if (counts[0] === 2 && counts[1] === 2) {
        return 'twoPairs';
    }
    if ((counts[0] + jokerCount) === 2) {
        return 'onePair';
    }
    return 'highCard';
}

function getSortFunction (cardRank) {
    return (a, b) => {
        if (handRank[a.type] > handRank[b.type]) {
            return 1;
        }
        if (handRank[a.type] < handRank[b.type]) {
            return -1;
        }
        for (let i = 0; i < a.cards.length; i++) {
            if (cardRank[a.cards[i]] > cardRank[b.cards[i]]) {
                return 1;
            }
            if (cardRank[a.cards[i]] < cardRank[b.cards[i]]) {
                return -1;
            }
        }
        return 0; // should never happen
    }
}
hands.sort(getSortFunction(cardRank));

const hands2 = hands.map(hand => {
    return {
        ...hand,
        type: getTypeOfHand(hand.cards, true),
    }
});
hands2.sort(getSortFunction({ ...cardRank, J: -1 }))

const part1 = hands.reduce((acc, hand, index) => acc + hand.bet * (index + 1), 0);
const part2 = hands2.reduce((acc, hand, index) => acc + hand.bet * (index + 1), 0);
console.log('part1', part1)
console.log('part2', part2)
