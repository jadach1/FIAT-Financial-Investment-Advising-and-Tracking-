// Required Modules
var express = require("express");
var path = require("path");
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// initialize the variable which we will use to create the database env
let setupENV = "cloud";
// If you put in an argument 'node server.js myPreferedSetup' it will set this for the setup variable which we will use to connect to the database
if (process.argv[2])
{
     setupENV = process.argv[2];
} 

// export the varaible for the connection file myENV.js
module.exports = setupENV;

require('./app/router/user.route.js')(app);
require('./app/router/asset.route.js')(app);
require('./app/router/transactions.route.js')(app);

var port = process.env.PORT || 10002

const hostname ='10.10.193.143'

const db = require('./app/config/db.config.js');

app.use(express.static("../dist/FIAT/"));

app.get("/", function(req, res) {
    res.sendFile("./index.html"); //index.html file of your angularjs application
});

app.get('*', function (req, res){
    res.sendFile(path.join(__dirname+'/../dist/FIAT/index.html'));
});

// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync with { force: true }');
    initial();
});

// Create a Server
app.listen(port, hostname, function () {
 
    console.log("App listening at http://%s:%s", hostname, port);
    console.log("open myvmlab.senecacollege.ca:6350 to view in browser");
});

function initial(){
    let users = [
        {
            username: "admin",
            password: "admin",
            firstname: "admin",
            lastname: "admin",
            email: "admin",
            recoveryQuestion: "admin",
            recoveryAnswer: "admin"
        }
    ]

    // Init data -> save to PostgreSQL
    const User = db.users;
    for (let i = 0; i < users.length; i++) { 
    User.create(users[i]);  
    }
}

