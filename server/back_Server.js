// Required Modules
var express       = require("express");
var path          = require("path");
var app           = express();
const cors        = require("cors");
var bodyParser    = require('body-parser');

// start local
// node back_Server local cloud 

// start VM server
// node back_Server prod fiat

// If we don't get at least 2 parameters we will not execute
if (!process.argv[2] && !process.argv[3])
{
    const string = 'incorrect parameters\n\n' +
                   'Example for localhost\n' +
                   'node back_server local $database\n\n' +
                   'Example for vm server\n' +
                   'node back_server prod $database\n\n' + 
                    'If you want to delete and recretae all the tables add a 3rd param called blast\n'+
                    'node back_Server prod $database blast';
    
   console.log(string)
} else {

// Set up the server connection, this is defaulted to local unless otherwise specified
var port
var hostname

if (process.argv[2] == "local") 
{
     port = process.env.PORT || 8080;
     hostname = 'localhost';
     app.use(cors());
} else if ( process.argv[2] == 'prod' )
{
     port = 10017
     hostname ='10.10.193.143'

     const corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200
    }
    
    app.use(function(req, res, next) {
        res.header("Content-type: application/json");
        res.header("Access-Control-Allow-Origin: http://myvmlab.senecacollege.ca:6350");
        next();
    });
    
    app.use(cors(corsOptions));
} 



app.use(bodyParser.json());


// initialize the variable which we will use to create the database env
let setupENV = "cloud";

// If you put in an argument 'node server.js myPreferedSetup' it will set this for the setup variable which we will use to connect to the database
if (process.argv[3])
{
     setupENV = process.argv[3];
} 

// export the varaible for the connection file myENV.js
module.exports = setupENV;



require('./app/router/devuser.route.js')(app);
require('./app/router/asset.route.js')(app);
require('./app/router/transactions.route.js')(app);
require('./app/router/portfolio.route.js')(app);

let db = require('./app/config/db.config.js');


if (process.argv[4] == 'blast')
{
    // // force: true will drop the table if it already exists
    db.sequelize.sync({force: true}).then(() => {
        console.log('Database is running, recreate DB');
    });
} else {
    // // force: true will drop the table if it already exists
    db.sequelize.sync().then(() => {
        console.log('Database is running');
    });
}

process.argv[4] == 'populate' &&  initial() 


// Create a Server
app.listen(port, hostname, function () {
    console.log("App listening at http://%s:%s", hostname, port);
});

    function initial(){
        let users = [
            {
                username: "Emilio",
                password: "password",
                firstname: "Emile",
                lastname: "Ohan",
                email: "emile.ohan@senecacollege.ca",
                isVerified: "t",
                recoveryQuestion: "What is my profession ? ",
                recoveryAnswer: "professor"
            }
        ]

        let portfolios = [
            {
                portfolioId: 1,
                username: "emilio",
                portfolioName: "My Retirement",
                portfolioType: "t"
            }
        ]

        let trans = [
            {
                id: 1,
                portfolioId: 1, 
                symbol: "AMZN", 
                shares: 1000,
                price: 20.56,
                currency: 't',
                buydate: 1999-03-18,
                transaction: 't' 
            } ,
            {
                id: 2,
                portfolioId: 1, 
                symbol: "TSLA", 
                shares: 1000,
                price: 67.89,
                currency: 't',
                buydate: 2011-02-11,
                transaction: 't' 
            } , 
            {
                id: 3,
                portfolioId: 1, 
                symbol: "BRK.A", 
                shares: 10,
                price: 9999.99,
                buydate: 1991-01-14,
                transaction: 't',
                currency: 't' 
            }
        ]
        // Init data -> save to PostgreSQL
        const User = db.users;
        const Portfolio = db.portfolios;
        const Transaction = db.transactions;

        for (let i = 0; i < users.length; i++) { 
        User.create(users[i]);  
        }

        for (let i = 0; i < portfolios.length; i++) { 
            Portfolio.create(portfolios[i]);  
            }

        for (let i = 0; i < trans.length; i++) { 
            Transaction.create(trans[i]);  
            }
    }
}
