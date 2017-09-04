import * as readline from 'readline';
import * as fs from 'fs';

/**
 * Class that allows to read/process a file by group of lines.
 * Number of lines to read at once is passed as a constructor parameter
 */
export default class FileReader {
    private _buffer: Array<string> = [];

    constructor(private numberOfLinesInBuffer: number = 20) {
    }

    /**
     * Reads file line by line to a buffer until buffer size reaches configuration value
     * @see this.numberOfLinesInBuffer
     * @param path {string} - Path to file to be read.
     * @param processLinesCallback {function} - Node-style callback to be called if error occurs or next group of lines
     * is available. When end of file is reached both arguments are null.
     */
    public readLineByLine(path: string, processLinesCallback: (err: any, lines: Array<string>) => void) {
        const flushBuffer = () => {
            processLinesCallback(null, this._buffer);
            this._buffer = [];
        };

        let inputStream = fs.createReadStream(path);
        inputStream.on("error", (e) => processLinesCallback(e, null));

        const rl = readline.createInterface({input: inputStream});

        rl.on("line", (l) => {
            this._buffer.push(l);
            if (this._buffer.length >= this.numberOfLinesInBuffer) {
                flushBuffer();
            }
        });
        rl.on("close", () => {
            if (this._buffer.length > 0) {
                flushBuffer();
            }
            processLinesCallback(null, null);
        })
    }
}