//   this file is used to connect our database to our server 

const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "perntodo"

});

module.exports = pool;