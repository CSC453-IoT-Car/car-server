var b = require('bonescript');

var car = require('./car.js');

var pa = 'P9_21';
var pb='P9_22';
var a1='P9_23';
var a2='P9_17';
var b1='P9_24';
var b2='P9_26';
var oe='P9_41';

b.pinMode(a1, b.OUTPUT);
b.pinMode(a2, b.OUTPUT);
b.pinMode(b1, b.OUTPUT);
b.pinMode(b2, b.OUTPUT);
b.pinMode(oe, b.OUTPUT);

/**
 * Car Signal to Motors
 */
b.analogWrite(pa, 0); 

b.analogWrite(pb, 0);

b.digitalWrite(oe, b.HIGH);
b.digitalWrite(a1, b.HIGH);
b.digitalWrite(a2, b.HIGH);
b.digitalWrite(b1, b.HIGH);
b.digitalWrite(b2, b.HIGH);

var trigger = 'P8_17',
	echo 	= 'P8_19',
	ms 	= 250;

var startTime, pulseTime;

b.pinMode(echo, b.INPUT, 7, 'pulldown', 'fast', doAttach);
function doAttach(x) {
	if (x.err) {
		console.log('x.err =', x.err);
		return;
	}
	b.attachInterrupt(echo, true, b.FALLING, interruptCallback);
}
b.pinMode(trigger, b.OUTPUT);
b.digitalWrite(trigger, 1);

var prevDistArray = new Array(3);
prevDistArray[0] = 9999;
prevDistArray[1] = 999;
prevDistArray[2] = 999;
var arrayIndex = 0;

var first = true;
var second = false;
var third = false;

var interval = setInterval(ping, ms);
var distance = 0;

function ping() {
	b.digitalWrite(trigger, 0);
	startTime = process.hrtime();
}

function interruptCallback(x) {
	if (x.attached) {
		return;
	}
	if (startTime) {
		pulseTime = process.hrtime(startTime);
		b.digitalWrite(trigger, 1);
		distance = (pulseTime[1] / 1000000 - 0.8).toFixed(3)
		console.log('distance', distance);
		if (distance > 3.0 && (prevDistArray[2] > 3.0)) {
            car.forward(a1, a2, b1, b2, pa, pb);
			
		} else if (distance <= 3.0 && (prevDistArray[2] <= 3.0)) {
            car.stop(a1, a2, b1, b2, pa, pb);
            //console.log("8");
            
            //var det = [2,1];
        	
        	//car.pivot(a1, a2, b1, b2, pa, pb, det);
        	
        	//car.forward(a1, a2, b1, b2, pa, pb);
        	
        	//det = [-2,1];
        	
        	//car.pivot(a1, a2, b1, b2, pa, pb, det);
            
		}
			prevDistArray[0] = prevDistArray[1];
			prevDistArray[1] = prevDistArray[2];
			prevDistArray[2] = distance;
			console.log("Post Shift: "+prevDistArray);
	}
}


 
