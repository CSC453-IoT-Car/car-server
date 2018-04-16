var b = require('bonescript');

module.exports = {
  /**
    * Needs to be called before any of the other functions are run
    */
  setPinouts: function(a1, a2, b1, b2, pa, pb, oe) {
    b.pinMode(a1, b.OUTPUT);
    b.pinMode(a2, b.OUTPUT);
    b.pinMode(b1, b.OUTPUT);
    b.pinMode(b2, b.OUTPUT);
    b.pinMode(oe, b.OUTPUT);


    b.analogWrite(pa, 0); 

    b.analogWrite(pb, 0);

    b.digitalWrite(oe, b.HIGH);
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.HIGH);
    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.HIGH);
  }

  forward: function(a1, a2, b1, b2, pa, pb){
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, 1);
  
    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.LOW);
    b.analogWrite(pb, 1);
  }
  
  reverse: function(a1, a2, b1, b2, pa, pb) {
    b.digitalWrite(a1, b.LOW);
    b.digitalWrite(a2, b.HIGH);
    b.analogWrite(pa, 1);
      
    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, 1);
  }
  
  stop: function(a1, a2, b1, b2, pa, pb) {
    b.digitalWrite(a1, b.LOW);
    b.digitalWrite(a2, b.HIGH);
    b.analogWrite(pa, 0);
  
    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, 0);  
  
  }
  
  pivot: function(a1, a2, b1, b2, pa, pb, det) {
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

}
