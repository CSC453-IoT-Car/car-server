var b = require("bonescript");

outpin = "P8_17"
inpin = "P8_19"

//600 Milliseconds

b.pinMode(outpin, b.OUTPUT);
b.pinMode(inpin, b.INPUT);
var to;
//var date = newDate;
var skip = false;

//while (true) {
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
    },1000);
    
//}