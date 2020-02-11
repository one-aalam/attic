const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // Get total CPU cores.

export const clusturize = (initApp: Function) => {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on( 'online', function( worker: any ) {
      console.log( 'Worker ' + worker.id + ' is online.' );
    });
    cluster.on( 'exit', function( worker: any, _code: any, _signal: any ) {
      console.log( 'worker ' + worker.id + ' died.' );
      console.log(`Staring a new one...`);
      cluster.fork();
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is our Express's HTTP server
    initApp();
  }
}