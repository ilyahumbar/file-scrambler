import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { promisify } from 'util';

import { IFileScrambler, ILineScrambler } from './interfaces';
import FileReader from './FileReader';

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);


export class FileScrambler implements IFileScrambler {
    constructor (private scrambler: ILineScrambler) {
    }

    public scramble(filePath: string, outputDir: string): Promise<string> {
        return stat(outputDir)
            .catch((e)=> mkdir(outputDir))
            .then(() => this.processFileAndWriteResults(filePath, outputDir));
    }


    private processFileAndWriteResults(filePath: string, outputDir: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const outputFilePath = path.join(outputDir, path.basename(filePath));
            const fileReader = new FileReader();

            const outputFileStream = fs.createWriteStream(outputFilePath, { flags: 'w+' });
            outputFileStream.on('error', (e) => reject(e));

            fileReader.readLineByLine(filePath, (error, lines) => {
                if(error) {
                    reject(error);
                    return;
                }

                if(lines == null) {
                    outputFileStream.end(null, ()=> resolve(outputFilePath));
                    return;
                }

                this.scrambler.scrambleMulti(lines).forEach((l) => {
                    outputFileStream.write(l);
                    outputFileStream.write(os.EOL);
                })
            })
        });
    }
}
