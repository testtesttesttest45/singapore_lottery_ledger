const mysql = require('mysql');
require('dotenv').config();

const isDevEnvironment = true; // change this to false when using it to populate the production database

const connectionConfig = {
    host: isDevEnvironment ? process.env.DB_HOST : process.env.DB_HOST_PROD,
    user: isDevEnvironment ? process.env.DB_USER : process.env.DB_USER_PROD,
    password: isDevEnvironment ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_PROD
};

const connection = mysql.createConnection(connectionConfig);

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
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_day_betting DATE,
                date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sections_order VARCHAR(500) DEFAULT '["entry-sections", "section-today-entry",  "section-total-spendings", "section-total-winnings", "notes", "purchase-history", "current-betslips"]'
            );
            `;

            connection.query(createUsersTable, err => {
                if (err) throw err;
                console.log("users table created.");
            });

            // Create records table
            const createRecordsTable = `
            CREATE TABLE IF NOT EXISTS records (
                id INT AUTO_INCREMENT PRIMARY KEY,
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
                FOREIGN KEY (fk_user_id) REFERENCES users(id)
            );
            `;

            connection.query(createRecordsTable, err => {
                if (err) throw err;
                console.log("records table created.");
            });

            // Create notes table
            const createNotesTable = `
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fk_user_id INT UNIQUE,
                notes_content TEXT,
                FOREIGN KEY (fk_user_id) REFERENCES users(id)
            );
            `;

            connection.query(createNotesTable, err => {
                if (err) throw err;
                console.log("notes table created.");
            });

            // Create prizes table
            const createPrizesTable = `
            CREATE TABLE IF NOT EXISTS prizes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fk_user_id INT,
                lottery_name VARCHAR(255),
                entry_type VARCHAR(255),
                pick_type VARCHAR(255),
                outlet VARCHAR(255),
                winning_prize INT,
                date_of_winning DATE,
                isDeleted BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (fk_user_id) REFERENCES users(id)
            );
            `;

            connection.query(createPrizesTable, err => {
                if (err) throw err;
                console.log("prizes table created.");
            });

            // Create betslips table
            const createBetslipsTable = `
            CREATE TABLE IF NOT EXISTS betslips (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fk_user_id INT,
                lottery_name VARCHAR(255),
                image_url VARCHAR(255),
                date_of_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                isChecked BOOLEAN DEFAULT FALSE,
                date_checked TIMESTAMP DEFAULT NULL,
                FOREIGN KEY (fk_user_id) REFERENCES users(id)
            );
            `;

            connection.query(createBetslipsTable, err => {
                if (err) throw err;
                console.log("betslips table created.");
            });

            // Create messages table
            const createMessagesTable = `
                CREATE TABLE IF NOT EXISTS messages(
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    fk_user_id INT,
                    message_type VARCHAR(255),
                    message_content VARCHAR(1000),
                    sender_email VARCHAR(255),
                    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    isResolved BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (fk_user_id) REFERENCES users(id)
                );
            `;

            connection.query(createMessagesTable, (err) => {
                if (err) throw err;
                console.log("messages table created.");

                // Ending the connection after all tables have been created.
                connection.end(() => {
                    console.log('Database connection closed.');
                });
            });
        });
    });
}
