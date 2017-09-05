/**
 * Replacement for ongoing https://github.com/tc39/proposal-string-matchall
 * @param str {string}
 * @param regex {RegExp}
 * @returns {Array}
 */
exports.matchAll = function (str, regex) {
  const matches = [];
  str.replace(regex, function () {
    let match = Array.prototype.slice.call(arguments, 0, -2);
    match.input = arguments[arguments.length - 1];
    match.index = arguments[arguments.length - 2];
    matches.push(match);
  });
  return matches;
};