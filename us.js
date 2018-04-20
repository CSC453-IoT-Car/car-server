var b = require("bonescript");

outpin = "P8_17"
//inpin = "P8_19"
//600 Milliseconds
/**
 * Conversion of Thomas' code
b.pinMode(outpin, b.OUTPUT);
b.pinMode(inpin, b.INPUT);
var to;

b.digitalWrite(outpin, b.HIGH);
setInterval(function(){
    to = Date.now() + 3.5;
    b.digitalWrite(outpin, b.LOW);
    while (!b.digitalRead(inpin) && Date.now() < to) { }
    if (Date.now() >= to) {
        setTimeout(function(){
            console.log("to");
            //skip = true;
        }, 200);
    } else {
        var start = Date.now();
        to = start + 3.5;
        //console.log(to);
        while (b.digitalRead(inpin) && Date.now() < to) { }
        var end = Date.now();
        var print = b.digitalRead(inpin);
        //var print = end-start;
        console.log(print);
    }
},1000);*/

// from http://beagleboard.org/Support/BoneScript/Ultrasonic_Sensor/
var analogVoltage = 0;
b.digitalWrite(outpin, b.HIGH);
/* Check the sensor values every 2 seconds*/
setInterval(read, 2000);

function read(){
    b.digitalWrite(outpin, b.LOW);
    b.analogRead(inpin, printStatus);
}

function printStatus(x) {
    var distanceInches;
    analogVoltage = x.value*1.8; // ADC Value converted to voltage
    console.log('x.value = ' + analogVoltage); 
    distanceInches = analogVoltage / 0.00699;
    console.log("There is an object " + 
    parseFloat(distanceInches).toFixed(3) + " inches away.");
}
