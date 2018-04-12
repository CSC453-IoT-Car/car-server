var request = require('request');
var config = require('./config.json');
var os = require('os');
var fs = require('fs');
var self = {
    id: config.id,
    sessionKey: config.sessionKey,
    target: null,
    status: 'idle',
    type: 'car',
    networks: os.networkInterfaces()
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
        if (res && res.statusCode == 403) {
            console.log("Heartbeat rejected. Re-registering with backend.");
            clearInterval(heartbeatInterval);
            registerClient();
        } else if (!res || res.statusCode != 200) {
            console.log("Error sending heartbeat to backend.");
        } else {
            if (body) {
                if (body.targetId) {
                    self.target = body.targetId;
                }
                if (body.blocking) {
                    console.log('Got command to resolve blockage with: ' + body.blocking);
                }
            }
        }
    });
}

function registerClient() {
    console.log("Registering with id " + self.id + " and session key " + self.sessionKey);
    request({
        url: api + '/register',
        method: "POST",
        json: self
    }, function (err, res, body) {
        if (res && res.statusCode == 403) {
            console.log("Backend refused register request. The configured id may be in use.");
        } else if (!res || res.statusCode != 200) {
            console.log("Error registering with backend.");
        } else {
            console.log('Registered with backend as ' + self.id);
            self.sessionKey = body.sessionKey;
            var updatedConf = {
                id: self.id,
                sessionKey: self.sessionKey
            }
            fs.writeFileSync('config.json', JSON.stringify(updatedConf));
            console.log('Using session key ' + self.sessionKey);
            heartbeatInterval = setInterval(heartbeat, 1000);
        }
    });
};

function runClient() {
    registerClient();
}

runClient();
