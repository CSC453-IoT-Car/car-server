var b = require('bonescript');

var trigger = 'P8_17', //outpin
	echo 	= 'P8_19', //inpin
	ms 	= 250;

var startTime, pulseTime;

b.pinMode(echo, b.INPUT, 7, 'pulldown', 'fast', doAttach);
function doAttach(x) {
	if (x.err) {
		console.log('x.err =', x.err);
		return;
	} else {
		console.log('it"s all good');
	}
	b.attachInterrupt(echo, true, b.FALLING, interruptCallback);
}
b.pinMode(trigger, b.OUTPUT);
b.digitalWrite(trigger, 1);

setInterval(ping, ms);

function ping() {
	console.log('ping');
	b.digitalWrite(trigger, 0);
	startTime = process.hrtime();
}

function interruptCallback(x) {
	if (x.attached) {
		console.log('Interrupt handler attached', x);
		return;
	}
	console.log('hello?')
	if (startTime) {
		pulseTime = process.hrtime(startTime);
		b.digitalWrite(trigger, 1);
		console.log('pulseTime = ' + (pulseTime[1] / 1000000 - 0.8).toFixed(3));
	}
}