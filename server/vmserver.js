// Required Modules
var express = require("express");

var app = express()

var port = process.env.PORT || 10002

const hostname ='10.10.193.143'

const db = require('./app/config/db.config.js');

app.use(express.static("../dist/FIAT/"));

app.get("/", function(req, res) {
    res.sendFile("./index.html"); //index.html file of your angularjs application
});

// Create a Server
var server = app.listen(8080, function () {
 
    console.log("App listening at http://%s:%s", hostname, port);
    console.log("open myvmlab.senecacollege.ca:6350 to view in browser");
})