const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting:', err.stack);
        return;
    }
    console.log('Connected to MySQL.');

    const createMessagesTable = `
        CREATE TABLE IF NOT EXISTS messages(
            id INT AUTO_INCREMENT PRIMARY KEY,
            fk_user_id INT,
            message_type VARCHAR(255),
            message_content VARCHAR(1000),
            date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (fk_user_id) REFERENCES users(id)
        );
    `;

    connection.query(createMessagesTable, (err, results) => {
        if (err) {
            console.error('Error creating messages table:', err.stack);
            return;
        }
        console.log('Messages table created or already exists.');
    });
});