var express = require('express');
var app = express();
var request = require('request');
var self = {
    id: -1,
    target: null
}

app.post('/move', function (req, res) {
    console.log("Received move command from backend.");
    res.status(200).send();
});

app.listen(8000, function () {
    console.log('Car listening for commands on port 8000!');
    request({
        url: 'http://127.0.0.1:3000/register',
        method: "POST",
        json: self
    }, function (err, res, body) {
        if (!res || res.statusCode != 200) {
            console.log("Error registering with backend.");
        } else {
            console.log('Registered with backend.');
            self.id = body.id;
            console.log('Updated id to: ' + self.id);
        }
    });
})