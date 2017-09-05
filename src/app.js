const cluster = require('cluster');
const commandLineArgs = require('command-line-args');

const scramble = require('./scrambler');

const appArgs = commandLineArgs([
  { name: 'src', type: String, multiple: true, defaultOption: true },
  { name: 'outputDir', alias: 'o', type: String, multiple: false, defaultValue: 'output' },
], {partial: true});

exports.start = ()=> {
  if (appArgs.src === null || appArgs.src === undefined) {
    console.warn('No files specified.')
    return;
  }

  cluster.isMaster ? initMaster() : initWorker();
}

function initMaster() {
  for (let i = 0; i < appArgs.src.length; i++) {
    const worker = cluster.fork();

    worker.on('message', (msg) => {
      if (msg.isSuccess) {
        console.log(`Successfully processed file ${msg.filePath} into ${msg.outputPath}`);
      } else {
        console.error(`Error while processing file ${msg.filePath}`);
        console.error(msg.error);
      }
    });

    worker.on('online', () => {
      const message = {
        filePath: appArgs.src[i],
        outputDir: appArgs.outputDir
      };

      worker.send(message);
    });
  }
}

function initWorker() {
  // Receive messages from the master process.
  process.on('message', (msg) => {
    processSingleFile(msg.filePath, msg.outputDir);
  });
}

function processSingleFile(filePath, outputDir) {
  scramble(filePath, outputDir)
    .then((r) => {
      const message = {
        filePath: filePath,
        outputPath: r,
        isSuccess: true
      };
      process.send(message);
    })
    .catch((e) => {
      const message = {
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
