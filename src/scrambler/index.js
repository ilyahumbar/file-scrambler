const quoteStringLineScrambler = require('./quoteStringLineScrambler');
const simpleAsciiStringReverse  = require('./simpleAsciiStringReverse');
const scramble = require('./fileScrambler');
const f = require('jfp');

module.exports = f.rpartial(scramble, f.rpartial(quoteStringLineScrambler.scrambleMulti, simpleAsciiStringReverse));