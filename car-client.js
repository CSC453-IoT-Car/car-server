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

var prevDistArray = new Array(3);
prevDistArray[0] = 9999;
prevDistArray[1] = 999;
prevDistArray[2] = 999;

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
            prevDistArray[0] = prevDistArray[1];
            prevDistArray[1] = prevDistArray[2];
            prevDistArray[2] = (pulseTime[1] / 1000000 - 0.8).toFixed(3);
        }
    }	    
}
//added from ultrasonicMovement.js
function avoidance(x) {
    var det = new Array(2);
    det[0] = 2;
    det[1] = 0;
    
    var det2 = new Array(2);
    det2[0] = -2;
    det2[1] = 0;
            
    car.stop(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
    setTimeout(function(){
        car.pivot(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb, det);
                
        setTimeout(function (){
            car.stop(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
            setTimeout(function(){
                car.forward(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
                setTimeout( function(){
                    car.stop(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
                    setTimeout(function(){
                        car.pivot(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb, det2);
                            setTimeout(function(){
                                prevDistArray[0] = 9999;
                                prevDistArray[1] = 999;
                                prevDistArray[2] = 999;
                                b.attachInterrupt(echo, true, b.FALLING, interruptCallback);
                                b.digitalWrite(trigger, 1);
                            }, 1000);
                    }, 1000);
                }, 2000);
            }, 500);
        }	, 2000);
    }, 500);
}
// Car movements
function movement(targetId) {
    var sensors = detector.getRecentDetections(targetId);
    var dir = detector.getDirection(sensors);
    if (dir[1] != 0) {
        var error = dir[1]
        if (error == -1) console.log("Sensor error. Sensors have no date about this target");
        if (error == 1) console.log("Sensor error. All 4 sensors are picking up the target signal, indeterminate directoin");
        if (error == 2) console.log("Sensor error. Front and Back sensors are picking up the target signal, likely ahead or behind");
        if (error == 3) console.log("Sensor error. Left and Right are picking up the target, likely directly to one of the sides");
        if (error == 4) console.log("Sensor error. Unknown condition.")
        self.status = 'idle'
    }
    if (prevDistArray[2] <= 3 && prevDistArray[1] <= 3) {
        car.stop(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
        self.status = 'idle'
        var carBlockage = false;
        for (var otherCarId in otherCars) {
            carBlockage = true;
            if (detector.getDirection(detector.getRecentDetections(otherCarId))[0] == 0) {
                self.blocking = true;
                if (registered) {
                    notifyBlocked(self.id, otherCarId);
                } else {
                    carBlockage = false;
                }
                break;
            }
        }
        if (!carBlockage) {
            b.detachInterrupt(echo, avoidance);
        }
    } else {
        car.pivot(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb, dir);
        car.forward(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
    }
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
                } else {
                    self.status = 'idle';
                    car.stop(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
                }
                if (body.blocking) {
                    self.status = 'navigating'
                    car.forward(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
                    setTimeout(function() {
                        car.stop(pins.a1, pins.a2, pins.b1, pins.b2, pins.pa, pins.pb);
                        self.status = 'idle'
                    }, 3000)
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

function notifyBlocked(id, blockindId) {
    var body = {
        id : id,
        blockindId : blockindId
    };
    request({
        url: api + "/notify/blocked",
        method: "POST",
        json: body
    }, function (err, res, body) {

    })
}

function runClient() {
    registerClient();
    getOtherObjects();
    toolsSetup();
    setTimeout(function() {
        if (registered) {
            heartbeatInterval = setInterval(heartbeat, 1000);
            movement(self.target);
        } else {
            movement(0);
        }
    }, 1000)
}

runClient();
