// Required Modules
var express = require("express");
var path = require("path");
var app = express();
const cors = require("cors");
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

require('./app/router/devuser.route.js')(app);
require('./app/router/asset.route.js')(app);
require('./app/router/transactions.route.js')(app);

var port = process.env.PORT || 8080

const hostname ='localhost'

const db = require('./app/config/dbJacob.config.js');

app.use(express.static("../dist/FIAT/"));

// force: true will drop the table if it already exists
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

