const mysql = require('mysql');
require('dotenv').config();

const isDevEnvironment = process.env.STAGE === 'dev'; // means isDevEnvironment = true if process.env.STAGE === 'dev'

const connectionConfig = {
    host: isDevEnvironment ? process.env.DB_HOST : process.env.DB_HOST_PROD,
    user: isDevEnvironment ? process.env.DB_USER : process.env.DB_USER_PROD,
    password: isDevEnvironment ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME
};

const connection = mysql.createConnection(connectionConfig);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log(`Connected to the database. ${isDevEnvironment ? 'Using development environment.' : 'Using production environment.'}`);
});

module.exports = connection;
