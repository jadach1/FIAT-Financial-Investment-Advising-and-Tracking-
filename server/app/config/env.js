const env = {
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
   
  module.exports = env;