var request = require('request');
var self = {
    id: -1,
    target: null
}
var heartbeatInterval = null;
var api = 'http://zeroparticle.net:3000';
api = 'http://127.0.0.1:3000';

function heartbeat() {
    console.log('Sending heartbeat.');
    request({
        url: api + '/heartbeat',
        method: "POST",
        json: self
    }, function (err, res, body) {
        if (!res || res.statusCode != 200) {
            console.log("Error sending heartbeat to backend.");
        } else {
            if (body.commands && body.commands.length > 0) {
                console.log("Received commands " + body.commands);
            }
        }
    });
}

function runClient() {
    request({
        url: api + '/register',
        method: "POST",
        json: self
    }, function (err, res, body) {
        if (!res || res.statusCode != 200) {
            console.log("Error registering with backend.");
        } else {
            console.log('Registered with backend.');
            self.id = body.id;
            console.log('Updated id to: ' + self.id);
            heartbeatInterval = setInterval(heartbeat, 1000);
        }
    });
};

runClient();