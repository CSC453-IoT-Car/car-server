var b = require('bonescript');

/**
 * Car Signal to Motors
 */
b.analogWrite('P8_13', 0.25, 50, printJSON); // simulates an analog vlotage of .84 volts(3.3*.25).
function printJSON(x) { 
	console.log(JSON.stringify(x)); 
}

/**
 * Car1 Signal Emitting Mode
 */
b.analogWrite('P9_14', 0.25, 50, printJSON); // simulates an analog vlotage of .84 volts(3.3*.25).
function printJSON(x) { 
	console.log(JSON.stringify(x)); 
}

/**
  * Car1 Signal Detection Mode
  */
var isCar2 = false;
var car2Interval = setInterval( function() {
	b.analogRead('P9_16', printStatus);
	function printStatus(x) { 
		if (x.value == 1){
			isCar2 = true; //indicates car2's beacon signal is being picked up
		}
		console.log('x.value = ' + x.value); 
	}
}, 40); // The interval of car2's beacon (period = 1/frequency = 1/25 = .04)

var isCar3 = false;
var car3Interval = setInterval( function() {
	b.analogRead('P9_16', printStatus);
	function printStatus(x) { 
		if (x.value == 1){
			isCar3 = true; //indicates car2's beacon signal is being picked up
		}
		console.log('x.value = ' + x.value); 
	}
}, 80); // The interval of car3's beacon (period = 1/frequency = 1/125 = .08)

var isCar4 = false;
var car4Interval = setInterval( function() {
	b.analogRead('P9_16', printStatus);
	function printStatus(x) { 
		if (x.value == 1){
			isCar4 = true; //indicates car2's beacon signal is being picked up
		}
		console.log('x.value = ' + x.value); 
	}
}, 100); // The interval of car3's beacon (period = 1/frequency = 1/10 = .1)

var isTarget = false;
var TargetInterval = setInterval( function() {
	b.analogRead('P9_16', printStatus);
	function printStatus(x) { 
		if (x.value == 1){
			isTarget = true; //indicates target beacon signal is being picked up
		}
		console.log('x.value = ' + x.value); 
	}
}, 25); // The interval of a target beacon (period = 1/frequency = 1/40[frequency of target beacon] = .025)


/**var http = require("http");
var querystring = require("querystring");
var postRequest;*/
var car; //The current car having an issue.
var issue; //The issue the car is having.
var parameter; //The identity of the car that is causing issues.
var isSet = false;

if (isCar2) {
	/*postRequest = querystring.stringify({
		'car' : 'Car1', // The current car being blocked by another car
		'issue' : 'Blocked By Car',
		'parameter' : 'Car2'
	});*/
	car = "Car1";
	issue = "Blocked By Car";
	parameter = "Car2";
	isSet = true;
} else if (isCar3) {
	/*postRequest = querystring.stringify({
		'car' : 'Car1', // The current car being blocked by another car
		'issue' : 'Blocked By Car',
		'parameter' : 'Car3'
	});*/
	car = "Car1";
	issue = "Blocked By Car";
	parameter = "Car3";
	isSet = true;
} else if (isCar4) {
	/*postRequest = querystring.stringify({
		'car' : 'Car1', // The current car being blocked by another car
		'issue' : 'Blocked By Car',
		'parameter' : 'Car4'
	});*/
	car = "Car1";
	issue = "Blocked By Car";
	parameter = "Car4";
	isSet = true;
} else if (isTarget) {
	//move forward
} else {
	/*postRequest = querystring.stringify({
		'car' : 'Car1' // The current car being blocked by another car
		'issue' : 'Blocked By Untagged Object'
	});*/
	car = "Car1";
	issue = "Blocked By Untagged Object";
	isSet = true;
}

if (isSet) {
	$.post({
		url: "http://localhost:8000",//needs to be replaced with ip of server and port of server
		data: {car = car, issue = issue, parameter = parameter},
		success: function (data) {
			console.log("Success");
		},
		dataType: "json"
	})
	.fail ( function() {
		console.log("Error");
	});
}


/**var options = {
	hostname: '127.0.0.1', // ip of server
	port: 8000,//port of server
	method: 'POST',
	headers: {
		'Content-Type' : 'application/x-www-form-urlencoded',
		'Content-Length' : postRequest.length
	}
};

var req = http.request(options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function(body) {
		console.log('BODY: ' + body);
	});
});

req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
});

req.write(postRequest);
req.end();*/