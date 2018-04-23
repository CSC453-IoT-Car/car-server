var b = require('bonescript');

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
		if (distance > 1.5) {
		    /**
             * Forward A
             */
            b.digitalWrite(a1, b.HIGH);
            b.digitalWrite(a2, b.LOW);
            b.analogWrite(pa, 1);
            
            
            /**
             * Forward B
             */
            b.digitalWrite(b1, b.HIGH);
            b.digitalWrite(b2, b.LOW);
            b.analogWrite(pb, 1);
		} else {
            console.log('stopped!');
            clearInterval(interval);
            /**
             * Reverse A
             */
            b.digitalWrite(a1, b.LOW);
            b.digitalWrite(a2, b.HIGH);
            b.analogWrite(pa, 0);
            
            /**
             * Reverse B
             */
            b.digitalWrite(b1, b.LOW);
            b.digitalWrite(b2, b.HIGH);
            b.analogWrite(pb, 0);
		}
	}
}


 
