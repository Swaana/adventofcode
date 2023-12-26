function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}
function lcm(numbers) {
    return numbers.reduce((a, b) => (a * b) / gcd(a, b));
}

module.exports = {
    lcm
};