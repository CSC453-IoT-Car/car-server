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
            b.detachInterrupt(echo, avoidance);
        	
        	//setTimeout(car.stop, 100);
            
		}
		prevDistArray[0] = prevDistArray[1];
		prevDistArray[1] = prevDistArray[2];
		prevDistArray[2] = distance;
		console.log("Post Shift: "+prevDistArray);
	}
}

function avoidance(x) {
	var det = new Array(2);
	det[0] = 2;
	det[1] = 0;
	
	var det2 = new Array(2);
    det2[0] = -2;
    det2[1] = 0;
        	
    car.stop(a1,a2,b1,b2,pa,pb);
    setTimeout(function(){
	    car.pivot(a1, a2, b1, b2, pa, pb, det);
	        	
	    setTimeout(function (){
	    	car.stop(a1, a2, b1, b2, pa, pb);
	    	setTimeout(function(){
		    	car.forward(a1, a2, b1, b2, pa, pb);
		    	setTimeout( function(){
		    		car.stop(a1, a2, b1, b2, pa, pb);
		    		setTimeout(function(){
			    		car.pivot(a1, a2, b1, b2, pa, pb, det2);
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
 
