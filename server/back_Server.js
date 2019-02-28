// Required Modules
var express       = require("express");
var path          = require("path");
var app           = express();
const cors        = require("cors");
var bodyParser     = require('body-parser');

app.use(cors());
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

// Set up the server connection, this is defaulted to local unless otherwise specified
var port = process.env.PORT || 8080
var hostname ='localhost'


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

