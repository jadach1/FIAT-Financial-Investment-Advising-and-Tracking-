// Jacob's local machine postgres connection

const envv = {
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
  
  module.exports = envv;
  