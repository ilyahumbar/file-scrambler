const readline = require('readline');
const fs = require('fs');

/**
 * Class that allows to read/process a file by group of lines.
 * Number of lines to read at once is passed as a constructor parameter
 */
class FileReader {
  constructor (numberOfLinesInBuffer = 20) {
    this._buffer = [];
    this._numberOfLinesInBuffer = numberOfLinesInBuffer;
  }

  /**
   * Reads file line by line to a buffer until buffer size reaches configuration value
   * @see this._numberOfLinesInBuffer
   * @param path {string} - Path to file to be read.
   * @param processLinesCallback {function} - Node-style callback to be called if error occurs or next group of lines
   * is available. When end of file is reached both arguments are null.
   */
  readLineByLine (path, processLinesCallback) {
    const flushBuffer = () => {
      processLinesCallback(null, this._buffer);
      this._buffer = [];
    };

    const inputStream = fs.createReadStream(path);
    inputStream.on('error', (e) => processLinesCallback(e, null));

    const lineReader = readline.createInterface({input: inputStream});

    lineReader.on('line', (l) => {
      this._buffer.push(l);
      if (this._buffer.length >= this._numberOfLinesInBuffer) {
        flushBuffer();
      }
    });
    lineReader.on('close', () => {
      if (this._buffer.length > 0) {
        flushBuffer();
      }
      processLinesCallback(null, null);
    });
  }
}

module.exports = FileReader;