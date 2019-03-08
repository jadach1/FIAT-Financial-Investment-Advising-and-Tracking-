// Required Modules
var express       = require("express");
var path          = require("path");
var app           = express();
const cors        = require("cors");
var bodyParser     = require('body-parser');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(function(req, res, next) {
    res.header("Content-type: application/json");
    res.header("Access-Control-Allow-Origin: http://myvmlab.senecacollege.ca:6350");
    next();
});

app.use(bodyParser.json());
app.use(cors(corsOptions));


// initialize the variable which we will use to create the database env
let setupENV = "cloud";

// If you put in an argument 'node server.js myPreferedSetup' it will set this for the setup variable which we will use to connect to the database
if (process.argv[2])
{
     setupENV = process.argv[2];
} 

// export the varaible for the connection file myENV.js
module.exports = setupENV;

// Set up the server connection, this is defaulted to local unless otherwise specified
let port;
let hostname;

if (process.argv[3] == "local")
{
    port = 8080
    hostname = 'localhost'
} else {
    port = 10017
    hostname ='10.10.193.143'
}


require('./app/router/devuser.route.js')(app);
require('./app/router/asset.route.js')(app);
require('./app/router/transactions.route.js')(app);

let db = require('./app/config/db.config.js');

// // force: true will drop the table if it already exists
 db.sequelize.sync().then(() => {
     console.log('Database is running');
     //initial();
     });

// Create a Server
app.listen(port, hostname, function () {
 
    console.log("App listening at http://%s:%s", hostname, port);
    console.log("open localhost:8080 to view in browser");
});

// function initial(){
//     let users = [
//         {
//             username: "admin",
//             password: "admin",
//             firstname: "admin",
//             lastname: "admin",
//             email: "admin",
//             recoveryQuestion: "admin",
//             recoveryAnswer: "admin"
//         }
//     ]

//     // Init data -> save to PostgreSQL
//     const User = db.users;
//     for (let i = 0; i < users.length; i++) { 
//     User.create(users[i]);  
//     }
//}

