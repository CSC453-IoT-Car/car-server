var fs = require('fs');
var readline = require('readline');
//var b = require("bonescript");
var pruFile = '/dev/rpmsg_pru31';

var reading = false;
var rl;
var stream;
var map = [];

function sendCommand(cmd){
    var file = fs.openSync(pruFile, 'w+');
    fs.writeSync(file, cmd);
    fs.closeSync(file);
}

module.exports = {
    enable: function(){
        if(!fs.existsSync(pruFile)){
            console.log("Did not find PRU1. Did you run ~/setup_pru.sh?");
            return;
        }
        console.log("Enabling detectors."); 
        sendCommand("go");
        reading = true;
        stream = fs.createReadStream(pruFile);
        rl = readline.createInterface({
          input: stream,
          crlfDelay: Infinity
        });
        
        rl.on('line', (line) => {
          //console.log(`Line from file: ${line}`);
          
          var sp = line.split(":");
          var sensor = parseInt(sp[0]);
          var code = parseInt(sp[1], 2);
          
          //console.log(line +', ' +sp+", "+sp[0]+","+sp[1]+','+sensor+","+code);
          var ts = new Date().getTime();
          if(map[code] == undefined){
              map[code] = [];
          }
          map[code].push({sensor:sensor, ts:ts});
          if(map[code].length > 40)map[code].shift();
        });
    },
    
    disable: function(){
        console.log("Disabling detectors.");
        rl.close();
        stream.close();
        reading = false;
        
        //FIXME THIS FAILS THE SECOND TIME!!! :(
        
        try{
           sendCommand("stop");
        }catch(e){
            console.log(JSON.stringify(e));
            setTimeout(function(){
                sendCommand("stop");
            }, 500);
        }
    },
    
    getMap: function(){
        return map;
    },
    /**Returns array of sensors that saw the given code in the given time window*/
    getDetections: function(code, start, end){
        var res = [];
        if(map[code] == undefined)return [];
        for(var i = 0; i < map[code].length; i++){
            var x = map[code][i];
            if(x.ts < start)continue;
            if(x.ts > end)break;
            if(res.indexOf(x.sensor) == -1){
                res.push(x.sensor);
            }
        }
        return res;
    },
    /**Returns array of sensors that saw the given code in the time since the start time. (last <start> milliseconds)
    */
    getRecentDetections: function(code, start){
        return module.exports.getDetections(code, start, new Date().getTime());
    },
    /**Returns array of sensors that saw the given code in the last second*/
    getLastReading:function(code){
        var t = new Date().getTime()
        return module.exports.getDetections(code, t-1100, t);//give extra 100ms for buffer room
    },
    
    /**
     * Returns the direction represented by the given sensor group
     * The return value is a 2 element array, where the first element is a direction and
     * the second is a status.
     * If the status is 0, then no special case occured, and the direction is centered such
     * that 0 is forward, < 0 is more left, >0 is more right.
     *              FRONT
     *                0
     *             -1   1
     *  LEFT    -2   CAR  2  RIGHT
     *             -3   3
     *                4
     *              BACK
     * 
     * Some special cases can arise, in which case the direction returned is NaN. The second
     * element dictates what happened:
     * -1: No sensors -> no data
     * 1: All 4 sensors -> indeterminate direction
     * 2: Front and Back only -> indeterminate, likely ahead or behind
     * 3: Left and Right only -> indeterminate, likely directly to one of the sides
     * 4: Unknown Condition. 
     * 
     * 
     * */
    getDirection:function(sensors){
        //no data
        if(sensors.length == 0){
            return [NaN, -1];
        }
        //every sensor
        if(sensors.length == 4){
            return [NaN, 1];
        }
        var mask = 0;
        
        var F = 1;
        var R = 2;
        var B = 4;
        var L = 8;
        
        if(sensors.indexOf(0) != -1)mask |= F;
        if(sensors.indexOf(1) != -1)mask |= R;
        if(sensors.indexOf(2) != -1)mask |= B;
        if(sensors.indexOf(3) != -1)mask |= L;
        
        if(mask == F || mask == F+L+R )return [0, 0];
        if(mask == F+R)return [1, 0];
        if(mask == R || mask == F+R+B) return [2, 0];
        if(mask == B | mask == R+B+L)return [3, 0];
        if(mask == B+L)return [-3, 0];
        if(mask == L || mask == F+L+B)return [-2, 0];
        if(mask == F+L)return [-1, 0];
        
        //special cases
        if(mask == F+B)return [NaN, 2];
        if(mask == L+R)return [NaN, 3];
        
        return [NaN, NaN]; //unknown
        
    }
    
    
}
