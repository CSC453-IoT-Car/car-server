var b = require('bonescript');
/**
* pinouts for motors and power
*/

var pa='P9_21';
var pb='P9_22';
var a1='P9_23';
var a2='P9_17';
var b1='P9_24';
var b2='P9_26';
var oe='P9_41';//used to be P9_30

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

function forward(b, a1, a2, b1, b2, pa, pb){
  b.digitalWrite(a1, b.HIGH);
  b.digitalWrite(a2, b.LOW);
  b.analogWrite(pa, 1);
  
  b.digitalWrite(b1, b.HIGH);
  b.digitalWrite(b2, b.LOW);
  b.analogWrite(pb, 1);
}
  
function reverse(b, a1, a2, b1, b2, pa, pb) {
  b.digitalWrite(a1, b.LOW);
  b.digitalWrite(a2, b.HIGH);
  b.analogWrite(pa, 1);
    
  b.digitalWrite(b1, b.LOW);
  b.digitalWrite(b2, b.HIGH);
  b.analogWrite(pb, 1);
}
  
function stop(b, a1, a2, b1, b2, pa, pb) {
  b.digitalWrite(a1, b.LOW);
  b.digitalWrite(a2, b.HIGH);
  b.analogWrite(pa, 0);
  
  b.digitalWrite(b1, b.LOW);
  b.digitalWrite(b2, b.HIGH);
  b.analogWrite(pb, 0);  
  
}

/**function pivot(b, a1, a2, b1, b2, pa, pb, deg, det1, det2, det3, det4) {
  if (deg > 0) {
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, 1);

    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, deg/180);
  } else {
    b.digitalWrite(a1, b.LOW);
    b.digitalWrite(a2, b.HIGH);
    b.analogWrite(pa, deg/180);

    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.LOW);
    b.analogWrite(pb, 1);
  }*/
  
function pivot(b, a1, a2, b1, b2, pa, pb, det) {
  if (det[1] != 0) {
    stop(b, a1, a2, b1, b2, pa, pb);
  } 
  if (det[0] == 0) {
    forward(b, a1, a2, b1, b2, pa, pb);
  } else if (det[0] == 1) {
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, 1);

    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, .5);
    setTimeout(function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 250);
  } else if (det[0] == 2){
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, 1);

    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, .5);
    setTimeout(function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 400);
  } else if (det[0] == 3){
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, 1);

    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, .5);
    setTimeout(function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 500);
  } else if (det[0] == 4){
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, 1);

    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, .5);
    setTimeout(function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 625);
  } else if (det[0] == -1){
    b.digitalWrite(a1, b.LOW);
    b.digitalWrite(a2, b.HIGH);
    b.analogWrite(pa, .5);

    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.LOW);
    b.analogWrite(pb, 1);
    setTimeout(function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 250);
  } else if (det[0] == -2){
    b.digitalWrite(a1, b.LOW);
    b.digitalWrite(a2, b.HIGH);
    b.analogWrite(pa, .5);

    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.LOW);
    b.analogWrite(pb, 1);
    setTimeout(function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 400);
  } else if (det[0] == -3){
    b.digitalWrite(a1, b.LOW);
    b.digitalWrite(a2, b.HIGH);
    b.analogWrite(pa, .5);

    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.LOW);
    b.analogWrite(pb, 1);
    setTimeout(function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 625);
  }
  
}

//forward(b, a1, a2, b1, b2, pa, pb);
//reverse(b, a1, a2, b1, b2, pa, pb);
var arg = [4, 0];
pivot(b, a1, a2, b1, b2, pa, pb, arg);
//setTimeout(function (){forward(b, a1, a2, b1, b2, pa, pb)}, 500);
//setTimeout(function (){stop(b, a1, a2, b1, b2, pa, pb)}, 500);
