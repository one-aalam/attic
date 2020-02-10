const cluster = require('cluster');
const os = require('os');

export const clusturize = (initApp: Function) => {
  if (cluster.isMaster) {
    // Get total CPU cores.
    const cpuCount = os.cpus().length;

    // Spawn a worker for every core.
    for (let j = 0; j < cpuCount; j++) {
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
    initApp();
  }
}