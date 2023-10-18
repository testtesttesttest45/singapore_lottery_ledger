// How to use:

// Check Users
// 1. First, check the users table first to identify who to send the announcement to. Go to line 42 and ensure the getUsers() call is uncommented
// 2. Run this script with `node announcement-creator.js`

// Set Announcement
// 3. Right below, declare announcement content (line 18)
// 4. At the next line, declare your target users. If targetting all users, leave the array empty.
// 5. Comment out the getUsers() call on line 42, and uncomment the createAnnouncement() call on line 44
// 6. Run this script with `node announcement-creator.js`

// Display Announcements
// 6. Ensure getAnnouncements() and createAnnouncement() are commented out
// 7. Uncomment getAnnouncements() on line 43
// 8. Run this script with `node announcement-creator.js`

const announcementContent = "ENTER ANNOUNCEMENT HERE";
const targetUsers = []; // Array of user IDs to target. Leave empty for all users.

const mysql = require('mysql');
require('dotenv').config();

const isDevEnvironment = true; // change this as per your environment

const connectionConfig = {
    host: isDevEnvironment ? process.env.DB_HOST : process.env.DB_HOST_PROD,
    user: isDevEnvironment ? process.env.DB_USER : process.env.DB_USER_PROD,
    password: isDevEnvironment ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME
};

const connection = mysql.createConnection(connectionConfig);

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting:', err.stack);
        return;
    }
    console.log('Connected to MySQL.');
    getUsers();
    // getAnnouncements();
    // createAnnouncement();
});

function createAnnouncement() {
    connection.query('INSERT INTO announcements (announcement_content) VALUES (?)', [announcementContent], (err, results) => {
        if (err) {
            console.error("Error creating announcement:", err);
            connection.end();
            return;
        }

        console.log('Announcement created with ID:', results.insertId);

        // If there are target users specified, create the relationships in the announcement_users table
        if (targetUsers.length > 0) {
            // targetUsers = [1, 2, 3, 4, 5] / [1]
            const announcementId = results.insertId;
            const values = targetUsers.map(userId => [announcementId, userId]); // so now, values = [[announcementId, userId], [announcementId, userId], ...].
            // example: target users = [1, 2, 3, 4, 5], map() will execute the function 5 times, and the function will return [announcementId, 1], [announcementId, 2] ...
            // and in this case, announcementId = results.insertId, which is the ID of the announcement we just created.
            // so example, announcementId = 1, current userId = 3, then [announcementId, userId] = [1, 3]
            connection.query('INSERT INTO announcement_users (announcement_id, user_id) VALUES ?', [values], (err, results) => {
                if (err) {
                    console.error("Error assigning announcement to users:", err);
                } else {
                    console.log('Announcement assigned to specific users.');
                }
                connection.end();
            });
        } else {
            console.log('Announcement is for all users.');
            connection.end();
        }
    });
}

function getAnnouncements() {
    const query = `
        SELECT announcements.id, announcements.announcement_content, announcements.date_created, GROUP_CONCAT(announcement_users.user_id) AS target_users
        FROM announcements
        LEFT JOIN announcement_users ON announcements.id = announcement_users.announcement_id
        GROUP BY announcements.id;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error with getAnnouncements:", err);
            connection.end();
            return;
        }

        const mappedResults = results.map(result => {
            return {
                id: result.id,
                announcementContent: result.announcement_content,
                createdAt: result.date_created,
                // If target_users is NULL, it means the announcement is for everyone. 
                // Otherwise, it's for specific users listed in target_users.
                targetUsers: result.target_users ? result.target_users.split(",") : "everyone"
            };
        });

        console.log(mappedResults);
        connection.end();
    });
}

function getUsers() {
    connection.query('SELECT id, full_name, username FROM users', (err, results) => {
        if (err) {
            console.error("Error with getUsers:", err);
            connection.end();
            return;
        }

        const mappedResults = results.map(result => {
            return {
                id: result.id,
                fullName: result.full_name,
                username: result.username,
            }
        })
        console.log(mappedResults);
        connection.end();
    });
}
