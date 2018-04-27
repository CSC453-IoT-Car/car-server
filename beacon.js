var fs = require('fs');
//var b = require("bonescript");
var pruFile = '/dev/rpmsg_pru30';

module.exports = {
    broadcastCode: function(code){
        if(!fs.existsSync(pruFile)){
            console.log("Did not find PRU0. Did you run ~/setup_pru.sh?");
            return;
        }
        var str = 'b';
        str += (code & 0x10) ? '1' : '0';
        str += (code & 0x08) ? '1' : '0';
        str += (code & 0x04) ? '1' : '0';
        str += (code & 0x02) ? '1' : '0';
        str += (code & 0x01) ? '1' : '0';
        console.log("Setting beacon to: " + str);
        var file = fs.openSync(pruFile, 'w');
        fs.writeSync(file, str);
        fs.closeSync(file);
    }
}

function writeCB(x){
    if(x.err == null)return;
    console.log(JSON.stringify(x));
}
