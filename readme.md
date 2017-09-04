## Node.js test application

### Environment
The application has been tested on Node.js v8.4.0 (npm v5.4.0)

### Run
Running application should be as easy as follows:
+ Clone the repo to your hard drive
+ run `npm install && npm start`

### Implementation details
Parallel file processing is implemented using [node.js clusters](https://nodejs.org/api/cluster.html).
Each file is divided into blocks (20 lines each) which are processed asynchronously (not really parallel, but file isn't loaded entirely into memory. Only one block is processed at once).