// Required Modules
var express       = require("express");
var path          = require("path");
var app           = express();
var bodyParser     = require('body-parser');
app.use(bodyParser.json());

let  port;
let  hostname;

// if you enter 'node server $local' the local serer will be ran
if( process.argv[2] ) 
{
       port =  4200
       hostname ='localhost'
} else {
       port =  10002
       hostname ='10.10.193.143'
}

app.use(express.static("./dist/FIAT/"));
     
app.get("/", function(req, res) {
      res.sendFile("./index.html"); //index.html file of your angularjs application
});
     
app.get('*', function (req, res){
      res.sendFile(path.join(__dirname+'/dist/FIAT/index.html'));
});

// Create a Server
app.listen(port, hostname, function () {
    console.log("App listening at http://%s:%s", hostname, port);
    if( !process.argv[2] )
    {
      console.log("open myvmlab.senecacollege.ca:6350 to view in browser");
    } 
});



