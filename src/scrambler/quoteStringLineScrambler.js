/**
 * String processing callback
 *
 * @callback processString
 * @param {string} str - String to process
 * @returns {string} Processed string (new instance)
 */

/***/
function scrambleSingle(line, process) {
  let currentIndex = 0;
  let re = /".*?"/g;
  let result = '';

  let match;
  while (match = re.exec(line)) {
    result += line.substr(currentIndex, match.index - currentIndex);
    result += process(match[0]);
    currentIndex = match.index + match[0].length;
  }

  result += line.substr(currentIndex);

  return result;
}

/**
 * Scrambles lines by passing all strings in double quotes to processing function.
 * @param lines {string[]} - Lines to scramble
 * @param process {processString} - Callback for string processing
 * @returns {string[]} Scrambled strings
 */
exports.scrambleMulti = (lines, process) => lines.map((l) => scrambleSingle(l, process));

/**
 * Scrambles a line by passing all strings in double quotes to processing function.
 * @param line {string} - Line to scramble
 * @param process {processString} - Callback for string processing
 * @returns {string} Scrambled string
 */
exports.scrambleSingle = scrambleSingle;