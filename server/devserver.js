// Required Modules
var express = require("express");
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json());

require('./app/controller/devuser.route.js')(app);

var port = process.env.PORT || 8080

const hostname ='localhost'

const db = require('./app/config/devdb.config.js');

app.use(express.static("../dist/FIAT/"));

app.get("/", function(req, res) {
    res.sendFile("./index.html"); //index.html file of your angularjs application
});

// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync with { force: true }');
    initial();
});

// Create a Server
app.listen(port, hostname, function () {
 
    console.log("App listening at http://%s:%s", hostname, port);
    console.log("open localhost:8080 to view in browser");
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

