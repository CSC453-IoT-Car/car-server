const exec = require('child_process').exec;
function waitMore() {
    console.log('waiting more...');
}
var startScript = exec('bash /home/debian/car-server/start-server.sh', (error, stdout, stderr) => {
    console.log('Done.');
    while (true) {
        setTimeout(waitMore(), 1000000);
    }
});
