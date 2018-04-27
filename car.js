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
  },

  forward: function(a1, a2, b1, b2, pa, pb){
    b.digitalWrite(a1, b.HIGH);
    b.digitalWrite(a2, b.LOW);
    b.analogWrite(pa, .40);
  
    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.LOW);
    b.analogWrite(pb, 0.35);
  },
  
  reverse: function(a1, a2, b1, b2, pa, pb) {
    b.digitalWrite(a1, b.LOW);
    b.digitalWrite(a2, b.HIGH);
    b.analogWrite(pa, 1);
      
    b.digitalWrite(b1, b.LOW);
    b.digitalWrite(b2, b.HIGH);
    b.analogWrite(pb, 1);
  },
  
  stop: function(a1, a2, b1, b2, pa, pb) {
    b.analogWrite(pa, 0);
  
    b.analogWrite(pb, 0);
  },
  
  /**
   * Accepts the following inputs to determine direction from detector.js getDirection function
   * 
   * If the status is 0, then no special case occured, and the direction is centered such
   * that 0 is forward, < 0 is more left, >0 is more right.
   *              FRONT
   *                0
   *             -1   1
   *  LEFT    -2   CAR  2      RIGHT
   *             -3   3
   *                4
   *              BACK
   * */
  pivot: function(a1, a2, b1, b2, pa, pb, det) {
    if (det[1] != 0) {
      this.stop(a1, a2, b1, b2, pa, pb);
      return 'idle'
    } 
    if (det[0] == 0) {
      this.forward(a1, a2, b1, b2, pa, pb);
      return 'navigating'
    } else if (det[0] == 1) {
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        this.stop(a1, a2, b1, b2, pa, pb);
      }, 250);
    } else if (det[0] == 2){
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        this.stop(a1, a2, b1, b2, pa, pb);
      }, 400);
    } else if (det[0] == 3){
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        this.stop(a1, a2, b1, b2, pa, pb);
      }, 500);
    } else if (det[0] == 4){
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        this.stop(a1, a2, b1, b2, pa, pb);
      }, 625);
    } else if (det[0] == -1){
      b.digitalWrite(a1, b.LOW);
      b.digitalWrite(a2, b.HIGH);
      b.analogWrite(pa, .5);

      b.digitalWrite(b1, b.HIGH);
      b.digitalWrite(b2, b.LOW);
      b.analogWrite(pb, 1);
      setTimeout(function() {
        this.stop(a1, a2, b1, b2, pa, pb);
      }, 250);
    } else if (det[0] == -2){
      b.digitalWrite(a1, b.LOW);
      b.digitalWrite(a2, b.HIGH);
      b.analogWrite(pa, .5);

      b.digitalWrite(b1, b.HIGH);
      b.digitalWrite(b2, b.LOW);
      b.analogWrite(pb, 1);
      setTimeout(function() {
        this.stop(a1, a2, b1, b2, pa, pb);
      }, 400);
    } else if (det[0] == -3){
      b.digitalWrite(a1, b.LOW);
      b.digitalWrite(a2, b.HIGH);
      b.analogWrite(pa, .5);

      b.digitalWrite(b1, b.HIGH);
      b.digitalWrite(b2, b.LOW);
      b.analogWrite(pb, 1);
      setTimeout(function() {
        this.stop(a1, a2, b1, b2, pa, pb);
      }, 625);
    }
  
  },
  
  /**
   * Avoid objects without consulting the backend.
   **/
  objectAvoidance: function(a1, a2, b1, b2, pa, pb, trigger, echo){
    var car = require('./car.js');
    //from ultrasonicMovement.js
    var ms = 250;
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

    var prevDist = 0;

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
		    if (distance > 3.25 && (Math.abs(prevDist - distance) <= 1 || start)) {
		      car.forward(a1, a2, b1, b2, pa, pb);
		      prevDist = distance;
			    start = false;
		    } else if (prevDist - distance >= 0){
          //added to avoid objects and try again.
          prevDist = distance;
          car.stop(a1, a2, b1, b2, pa, pb);
          var det = [2,1];
          car.pivot(a1, a2, b1, b2, pa, pb, det);
          car.forward(a1, a2, b1, b2, pa, pb);
          det = [-2,1];
          car.pivot(a1, a2, b1, b2, pa, pb, det);
          car.objectAvoidance(a1, a2, b1, b2, pa, pb, trigger, echo);
		    }
	    }
    }
  }

}
