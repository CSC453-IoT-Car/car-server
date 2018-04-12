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
var oe='P9_30';


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
  
  function turnClockwise90(b, a1, a2, b1, b2, pa, pb) {
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, 1);

    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, 0);
    setTimeout ( function() {
      stop(b, a1, a2, b1, b2, pa, pb);
    }, 525);
  }

forward(b, a1, a2, b1, b2, pa, pb);
//setTimeout(function (){stop(b, a1, a2, b1, b2, pa, pb)}, 500);
//turnClockwise90(b, a1, a2, b1, b2, pa, pb);
