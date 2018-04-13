var b = require("bonescript");

outpin = "P8_17"
inpin = "P8_19"

b.pinMode(outpin, b.OUTPUT);
b.pinMode(inpin, b.INPUT);

while (true) {
    b.digitalWrite(outpin, b.HIGH);
    setTimeout(function(){
        b.digitalWrite(outpin, b.LOW);
        b.digitalRead(inpin) //->io.input(inpin)
    },1);
    
}