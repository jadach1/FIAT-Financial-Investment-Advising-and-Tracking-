// Required Modules
var express       = require("express");
var path          = require("path");
var app           = express();
const cors        = require("cors");
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));
var bodyParser     = require('body-parser');
app.use(bodyParser.json());

app.use(express.static("../dist/FIAT/"));

// const port = process.env.PORT || 10002
// const hostname ='10.10.193.143'
var port = process.env.PORT || 4200
var hostname ='localhost'
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
    console.log("open myvmlab.senecacollege.ca:6350 to view in browser");
});



