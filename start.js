const exec = require('child_process').exec;
function waitMore() {
    console.log('waiting more...');
    setTimeout(waitMore(), 1000000);
}
var startScript = exec('bash /home/debian/car-server/start-server.sh', (error, stdout, stderr) => {
    console.log('Done.');
    setTimeout(waitMore(), 1000000);
});