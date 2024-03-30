const mysql = require('mysql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const isDevEnvironment = process.env.NODE_ENV !== 'production';
console.log(`isDevEnvironment state: ${isDevEnvironment}`)
// const connectionConfig = {
//     host: isDevEnvironment ? process.env.DB_HOST : process.env.DB_HOST_PROD,
//     user: isDevEnvironment ? process.env.DB_USER : process.env.DB_USER_PROD,
//     password: isDevEnvironment ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_PROD,
//     database: process.env.DB_NAME
// };

// const connection = mysql.createConnection(connectionConfig);

// connection.connect(err => {
//   if (err) {
//     console.error('Error connecting to the database:', err.stack);
//     return;
//   }
//   console.log(`Connected to the database. ${isDevEnvironment ? 'Using development environment.' : 'Using production environment.'}`);
// });

// module.exports = connection;

// get packets out of order error
const connection = mysql.createPool({ // createPool instead of createConnection
  connectionLimit: 10,
  host: isDevEnvironment ? process.env.DB_HOST : process.env.DB_HOST_PROD,
  user: isDevEnvironment ? process.env.DB_USER : process.env.DB_USER_PROD,
  password: isDevEnvironment ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_PROD,
  database: process.env.DB_NAME
});

connection.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  if (connection) {
    connection.release();
    console.log(`Connected to the database. ${isDevEnvironment ? 'Using development environment.' : 'Using production environment.'}`);
  }
  return;
});

module.exports = connection;