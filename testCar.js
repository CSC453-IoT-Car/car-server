var b = require('bonescript');

var pa = 'P9_21';
var pb='P9_22';
var a1='P9_23';
var a2='P9_17';
var b1='P9_24';
var b2='P9_26';
var oe='P9_30';

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

setTimeout( function() {
/**
 * Reverse A
 */
b.digitalWrite(a1, b.LOW);
b.digitalWrite(a2, b.HIGH);
b.analogWrite(pa, 1);

/**
 * Reverse B
 */
b.digitalWrite(b1, b.LOW);
b.digitalWrite(b2, b.HIGH);
b.analogWrite(pb, 1);

}, 3000);

setTimeout( function() {
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

}, 6000);

 