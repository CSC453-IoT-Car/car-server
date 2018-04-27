const exec = require('child_process').exec;
var startScript = exec('bash /home/debian/car-server/start-server.sh', (error, stdout, stderr) => {
    // Hope
});