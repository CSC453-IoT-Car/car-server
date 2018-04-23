var movements = require("./car.js");
var beacons = require("./beacon.js");
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
    networks: os.networkInterfaces(),
    blocking: null
}
var heartbeatInterval = null;
var api = 'http://zeroparticle.net:3000';
var targetSeen = false;
var currentTarget = '';
var beaconSeenBefore = false;

movements.setPinouts();

function movement(targetId) {
    if (targetId == null) {
        self.status = 'navigating';
        movements.forward();
        self.status = 'idle';
        movements.stop();
        self.blocking = null;
    } else {
        while (beacons.sees(targetId)) {
            if (!beaconSeenBefore) beaconSeenBefore = true;
            self.status = 'navigating';
            movements.forward();
        }
        self.status = 'idle'
        movements.stop();
        if (beaconSeenBefore) {
            self.blockedById = beacons.blockedById() ? beacons.obstacleId() : null;
            request({
                url: api + "/notify/blocked",
                method: "POST",
                json: self
            }, function(err, res, body) {
                if (!res || res.statusCode != 200) {
                    console.log("Error sending blockage to backend.");
                } else {
                    if (body) {
                        if (body.action == 'resolve-loval') {
                            obstacleObject();
                        } else {
                            obstacleCar();
                        }
                    }
                }
            })
        }
    }
}

function obstacleCar() {
    setTimeout(function() {
        movement(targetId);
    }, 5000)
}

function obstacleObject() {
    self.status = 'navigating'
    movements.pivot();
    self.status = 'idle'
    movements.stop();
    movement(targetId);
}

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
                    if (currentTarget != body.targetId ||) {
                        currentTarget = body.targetId;
                        movement(currentTarget);
                    }
                }
                if (body.blocking) {
                    console.log('Got command to resolve blockage with: ' + body.blocking);
                    movement(null);
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
