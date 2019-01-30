// Required Modules
var express = require("express");

var app = express()

var port = process.env.PORT || 10002

const hostname ='10.10.193.143'

app.use(express.static("../dist/FIAT/"));

app.get("/", function(req, res) {
    res.sendFile("./index.html"); //index.html file of your angularjs application
});

// Start Server
app.listen(port, hostname, function () {
    console.log( "Express server listening on port " + port);
});