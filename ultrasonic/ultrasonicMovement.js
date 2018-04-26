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
var arrayIndex = 0;

var start = true;

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
		if (start && distance > 3.0){
			start = true;
		} else {
			start = false;
		}
		if (distance > 3.0 && (Math.abs(prevDistArray[0] - distance) <= 1 || start)) {
            car.forward(a1, a2, b1, b2, pa, pb);
            
			start = false;
			if (arrayIndex > 2) {
				prevDistArray[0] = prevDistArray[1];
				prevDistArray[1] = prevDistArray[2];
				prevDistArray[2] = distance;
			} else {
				prevDistArray[arrayIndex] = distance;
				if (arrayIndex <= 2) {
					arrayIndex++;
				}
			}
			
		} else {
            car.stop(a1, a2, b1, b2, pa, pb);
            
            //var det = [2,1];
        	
        	//car.pivot(a1, a2, b1, b2, pa, pb, det);
        	
        	//car.forward(a1, a2, b1, b2, pa, pb);
        	
        	//det = [-2,1];
        	
        	//car.pivot(a1, a2, b1, b2, pa, pb, det);
            
		}
	}
}


 
