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
    b.analogWrite(pa, 0.4);
  
    b.digitalWrite(b1, b.HIGH);
    b.digitalWrite(b2, b.LOW);
    b.analogWrite(pb, 0.4);
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
    var car = require('./car.js');
    console.log(det);
    if (det[1] != 0) {
      car.stop(a1, a2, b1, b2, pa, pb);
    } else 
    if (det[0] == 0) {
      car.forward(a1, a2, b1, b2, pa, pb);
    } else if (det[0] == 1) {
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        car.stop(a1, a2, b1, b2, pa, pb);
      }, 250);
    } else if (det[0] == 2){
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        car.stop(a1, a2, b1, b2, pa, pb);
      }, 400);
    } else if (det[0] == 3){
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        car.stop(a1, a2, b1, b2, pa, pb);
      }, 500);
    } else if (det[0] == 4){
      b.digitalWrite(a1, b.HIGH);
      b.digitalWrite(a2, b.LOW);
      b.analogWrite(pa, 1);

      b.digitalWrite(b1, b.LOW);
      b.digitalWrite(b2, b.HIGH);
      b.analogWrite(pb, .5);
      setTimeout(function() {
        car.stop(a1, a2, b1, b2, pa, pb);
      }, 625);
    } else if (det[0] == -1){
      b.digitalWrite(a1, b.LOW);
      b.digitalWrite(a2, b.HIGH);
      b.analogWrite(pa, .5);

      b.digitalWrite(b1, b.HIGH);
      b.digitalWrite(b2, b.LOW);
      b.analogWrite(pb, 1);
      setTimeout(function() {
        car.stop(a1, a2, b1, b2, pa, pb);
      }, 250);
    } else if (det[0] == -2){
      console.log("hello");
      b.digitalWrite(a1, b.LOW);
      b.digitalWrite(a2, b.HIGH);
      b.analogWrite(pa, .5);

      b.digitalWrite(b1, b.HIGH);
      b.digitalWrite(b2, b.LOW);
      b.analogWrite(pb, 1);
      setTimeout(function() {
        car.stop(a1, a2, b1, b2, pa, pb);
      }, 400);
    } else if (det[0] == -3){
      b.digitalWrite(a1, b.LOW);
      b.digitalWrite(a2, b.HIGH);
      b.analogWrite(pa, .5);

      b.digitalWrite(b1, b.HIGH);
      b.digitalWrite(b2, b.LOW);
      b.analogWrite(pb, 1);
      setTimeout(function() {
        car.stop(a1, a2, b1, b2, pa, pb);
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
  }

}
