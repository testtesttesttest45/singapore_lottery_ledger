const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting:', err.stack);
        return;
    }
    console.log('Connected to MySQL.');
    setupDatabase();
});

function setupDatabase() {
    // Create the database if not exists
    connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`, (err, result) => {
        if (err) {
            console.error("Error dropping database:", err);
            return;
        }
        console.log('Database found and dropped.');
    }
    );
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err, result) => {

        if (err) {
            console.error("Error creating database:", err);
            return;
        }

        console.log('Database created.');

        // Use the database
        connection.changeUser({ database: process.env.DB_NAME }, err => {
            if (err) {
                console.log('Error in changing database', err);
                return;
            }

            // Create users table
            const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_day_betting DATE,
                date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `;

            connection.query(createUsersTable, err => {
                if (err) throw err;
                console.log("users table created.");
            });

            // Create records table
            const createRecordsTable = `
            CREATE TABLE IF NOT EXISTS records (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                fk_user_id INT,
                lottery_name VARCHAR(255),
                entry_type VARCHAR(255),
                pick_type VARCHAR(255),
                bet_amount VARCHAR(255),
                outlet VARCHAR(255),
                number_of_boards INT,
                cost INT,
                date_of_entry TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                isDeleted BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (fk_user_id) REFERENCES users(ID)
            );
            `;

            connection.query(createRecordsTable, err => {
                if (err) throw err;
                console.log("records table created.");
            });

            // Create notes table
            const createNotesTable = `
            CREATE TABLE IF NOT EXISTS notes (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                fk_user_id INT,
                notes TEXT,
                FOREIGN KEY (fk_user_id) REFERENCES users(ID)
            );
            `;

            connection.query(createNotesTable, err => {
                if (err) throw err;
                console.log("notes table created.");
            });

            // Create prizes table
            const createPrizesTable = `
            CREATE TABLE IF NOT EXISTS prizes (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                fk_user_id INT,
                lottery_name VARCHAR(255),
                entry_type VARCHAR(255),
                pick_type VARCHAR(255),
                outlet VARCHAR(255),
                winning_prize INT,
                date_of_winning DATE,
                FOREIGN KEY (fk_user_id) REFERENCES users(ID)
            );
            `;

            connection.query(createPrizesTable, err => {
                if (err) throw err;
                console.log("prizes table created.");
            });

            // Create betslips table
            const createBetslipsTable = `
            CREATE TABLE IF NOT EXISTS betslips (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                fk_user_id INT,
                image_url VARCHAR(255),
                isChecked BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (fk_user_id) REFERENCES users(ID)
            );
            `;

            connection.query(createBetslipsTable, err => {
                if (err) throw err;
                console.log("betslips table created.");
            });
            connection.query(createBetslipsTable, (err, result) => {
                if (err) throw err;
                console.log("betslips table created.");

                // Ending the connection after all tables have been created.
                connection.end(() => {
                    console.log('Database connection closed.');
                });
            });
        });
    });
}
