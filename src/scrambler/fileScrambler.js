const path = require('path');
const fs = require('fs');
const os = require('os');
const { promisify } = require('util');

const FileReader = require('./FileReader');

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

/**
 * String scramble callback
 *
 * @callback scrambleMultiCallback
 * @param {string[]} lines - Array of strings to scramble
 * @returns {string[]} Scrambled string (new instances)
 */


/**
 * Scrambles entire file. Saves result to the output directory specified in the parameter under original file name.
 * @see FileScrambler for implementation details
 * @param {string} filePath - Path to a file to be scrambled.
 * @param {string} outputDir - Output directory for resulting file. Will be created if it does not exist.
 * @param scrambleMulti {scrambleMultiCallback}
 * @returns {Promise.<string>} Promise, resolved with output file path if everything is ok.
 */
function scramble (filePath, outputDir, scrambleMulti) {
  return stat(outputDir)
    .catch(() => mkdir(outputDir))
    .then(() => processFileAndWriteResults(filePath, outputDir, scrambleMulti));
}

function processFileAndWriteResults (filePath, outputDir, scrambleMulti) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const outputFilePath = path.join(outputDir, path.basename(filePath));
    const fileReader = new FileReader();

    const outputFileStream = fs.createWriteStream(outputFilePath, {flags: 'w+'});
    outputFileStream.on('error', (e) => reject(e));

    fileReader.readLineByLine(filePath, (error, lines) => {
      if (error) {
        reject(error);
        return;
      }

      if (lines === null) {
        outputFileStream.end(null, () => resolve(outputFilePath));
        return;
      }

      scrambleMulti(lines).forEach((l) => {
        outputFileStream.write(l);
        outputFileStream.write(os.EOL);
      });
    });
  });
}

module.exports = scramble;
