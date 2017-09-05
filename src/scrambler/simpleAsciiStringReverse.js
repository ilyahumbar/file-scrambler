/** Simple string reverser.
 * Does not takes into account unicode characters. If your string contains unicode characters you will have unexpected
 * results.
 *
 * @example
 * const reverse = require(./simpleAsciiStringReverse);
 * console.log(reverse('test')); // tset
 */
module.exports = (str) => str.split('').reverse().join('');