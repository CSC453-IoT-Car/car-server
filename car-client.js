var b = require("bonescript");
var car = require("./car.js");
var beacon = require("./beacon.js");
var detector = require("./detector.js");
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
var registered = false;
var targetSeen = false;
var currentTarget = '';
var beaconSeenBefore = false;
var otherCars = [];

var pins = {
    "a1" : 'P9_23',
    "a2" : 'P9_17', 
    "b1" : 'P9_24',
    "b2" : 'P9_26',
    "pa" : 'P9_21',
    "pb" : 'P9_22',
    "oe" : 'P9_41',
    "trigger" : 'P8_17',
    "echo"    : 'P8_19'
}
var startTime, pulseTime;
var ms = 250;
var usDistance = 0;

function toolsSetup() {
    //Car
    car.setPinouts(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb, pins.oe);

    //Detector
    detector.enable();

    //Beacon
    beacon.broadcastCode(self.id);

    //Ultrasonic sensor
    b.pinMode(pins.echo, b.INPUT, 7, 'pulldown', 'fast', doAttach);
    function doAttach(x) {
        if (x.err) {
            console.log('x.err =', x.err);
            return;
        }
        b.attachInterrupt(pins.echo, true, b.FALLING, interruptCallback);
    }
    b.pinMode(pins.trigger, b.OUTPUT);
    b.digitalWrite(pins.trigger, 1);

    setInterval(ping, ms);

    function ping() {
        b.digitalWrite(pins.trigger, 0);
        startTime = process.hrtime();
    }

    function interruptCallback(x) {
        if (x.attached) {
            return;
        }
        if (startTime) {
            pulseTime = process.hrtime(startTime);
            b.digitalWrite(pins.trigger, 1);
            usDistance =  (pulseTime[1] / 1000000 - 0.8).toFixed(3);
        }
    }

}

// Car movements
function movement(targetId) {
    var sensors = detector.getRecentDetections(targetId);
    var dir = detector.getDirection(sensors);
    if (dir[0] == NaN) {
        var error = dir[1]
        if (error == -1) console.log("Sensor error. Sensors have no date about this target");
        if (error == 1) console.log("Sensor error. All 4 sensors are picking up the target signal, indeterminate directoin");
        if (error == 2) console.log("Sensor error. Front and Back sensors are picking up the target signal, likely ahead or behind");
        if (error == 3) console.log("Sensor error. Left and Right are picking up the target, likely directly to one of the sides");
        if (error == 4) console.log("Sensor error. Unknown condition.")
        self.status = 'idle'
        return;
    }
    if (usDistance < 3.25) {
        self.status = 'idle'
        for (var item in otherCars) {
            if (detector.getDirection(detector.getRecentDetections(item))[0] == 0) {
                self.blocking = true;

            }
        }
    }
}

function movement(targetId) {
    if (targetId == null) {
        self.status = 'navigating';
        car.forward();
        self.status = 'idle';
        car.stop();
        self.blocking = null;
    } else {
        while (beacon.sees(targetId)) {
            if (!beaconSeenBefore) beaconSeenBefore = true;
            self.status = 'navigating';
            car.forward();
        }
        self.status = 'idle'
        car.stop();
        if (beaconSeenBefore) {
            self.blockedById = beacon.blockedById() ? beacon.obstacleId() : null;
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
                    if (currentTarget != body.targetId) {
                        currentTarget = body.targetId;
                        movement(currentTarget);
                    }
                } else {
                    console.log('Idle car without target')
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
            self.sessionKey = body.sessionKey;
            var updatedConf = {
                id: self.id,
                sessionKey: self.sessionKey
            }
            fs.writeFileSync('config.json', JSON.stringify(updatedConf));
            registered = true;
        }
    });
};

function getOtherObjects() {
    request({
        url: api + "/registered",
        method: "GET"
    }, function (err, res, body) {
        if (res && res.statusCode == 200) {
            console.log('other objects: ', body);
            for (var item in body) {
                if (item.type == "car" && item.id != self.id) {
                    otherCars.push(item.id);
                }
            }
        }
    })
}

function notifyBlocked() {
    request({
        url: api + "/notify/blocked",
        method: "PUSH",
        
    })
}

function runClient() {
    registerClient();
    getOtherObjects();
    
    toolsSetup();
    if (registered) {
        heartbeatInterval = setInterval(heartbeat, 1000);
    }

}

runClient();
