const setupENV = require('../../back_Server');

// output the database setup we are using based on what the user put in 'node server $input'
console.log("Database environment setup is: " + setupENV);

// create empty object to export
let env = {};

// parse the srting we imported from the customServer for setup environment
if (setupENV === "fiat") 
{
    env = {
        database: 'FIAT',
        username: 'postgres',
        password: 'password',
        host: 'localhost',
        dialect: 'postgres',
        port: '5423',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
      };
} else 
if (setupENV === "jacob")
{
    env = {
        database: 'postgres',
        username: 'jacob',
        password: 'jacob',
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
      };
} else 
if (setupENV === "jacobFiat")
{
    env = {
        database: 'fiat',
        username: 'jacob',
        password: 'jacob',
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
      };
}else 
if (setupENV === "cloud") 
{
    env = {
        database: 'rkhkptuc',
        username: 'rkhkptuc',
        password: 'CcYW5TdyjNvAZgDItedLS4qelFkOSiIz',
        host: 'pellefant.db.elephantsql.com',
        dialect: 'postgres',
        port: '5432',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
      };
} else {
    console.log("Error , database environment variable not set up properly, please see customServer.js");
}
   
   
  module.exports = env;