import * as cluster from 'cluster';
import * as commandLineArgs from 'command-line-args';

import { MirrorQuoteStringLineScrambler, SimpleAsciiStringReverser, FileScrambler } from './scrambler';


const commandLineArgsDefinitions: Array<commandLineArgs.OptionDefinition> = [
    { name: 'src', type: String, multiple: true, defaultOption: true },
    { name: 'outputDir', alias: 'o', type: String, multiple: false, defaultValue: 'output' },
];

let appArgs: IApplicationArguments;

export function start() : void {
    appArgs = commandLineArgs(commandLineArgsDefinitions, {partial: true});

    if(appArgs.src == null) {
        console.warn("No files specified.");
        return;
    }

    if (cluster.isMaster) {
        initMaster();
    } else {
        initWorker();
    }
}

function initMaster(): void {
    for (let i = 0; i < appArgs.src.length; i++) {
        const worker = cluster.fork();

        worker.on('message', (msg: IWorkerMessage) => {
            if (msg.isSuccess) {
                console.log(`Successfully processed file ${msg.filePath} into ${msg.outputPath}`);
            } else {
                console.error(`Error while processing file ${msg.filePath}`);
                console.error(msg.error);
            }
        });

        worker.on('online', () => {
            const message: IMasterMessage = {
                filePath: appArgs.src[i],
                outputDir: appArgs.outputDir
            };

            worker.send(message);
        });
    }
}

function initWorker() {
    // Receive messages from the master process.
    process.on('message', (msg: IMasterMessage) => {
        processSingleFile(msg.filePath, msg.outputDir);
    });
}

function processSingleFile(filePath: string, outputDir: string) {
    const scrambler = new MirrorQuoteStringLineScrambler(new SimpleAsciiStringReverser());
    const converter = new FileScrambler(scrambler);

    converter.scramble(filePath, outputDir)
        .then((r) => {
            const message: IWorkerMessage = {
                filePath: filePath,
                outputPath: r,
                isSuccess: true
            };
            process.send(message);
        })
        .catch((e) => {
            const message: IWorkerMessage = {
                error: e,
                filePath: filePath,
                isSuccess: false
            };
            process.send(message);
        })
        .then(() => {
            process.exit();
        });
}


interface IApplicationArguments {
    src: Array<string>;
    workers?: number;
    outputDir: string;
}

/**
 * Interface for messages passed from Workers to master process
 */
interface IWorkerMessage {
    filePath: string;
    isSuccess: boolean;
    outputPath?: string;
    error?: any;
}

/**
 * Interface for messages passed from master process to workers to initiate file processing
 */
interface IMasterMessage {
    filePath: string;
    outputDir: string;
}

