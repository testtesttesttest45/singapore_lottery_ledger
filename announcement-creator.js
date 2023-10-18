// How to use: - For every change, please remember to save the file before running it.

// Check Users
// 1. First, check the users table first to identify who to send the announcement to. Go to line 47 and ensure the getUsers() call is uncommented
// 2. Run this script with `node announcement-creator.js`

// Set Announcement
// 3. Right below, declare announcement content on line 22
// 4. At the next line, declare your target users. If targetting all users, leave the array empty.
// 5. Ensure all the other functions are commented out, and uncomment the createAnnouncement() call on line 49
// 6. Run this script with `node announcement-creator.js`

// Display Announcements
// 6. Ensure all the other functions are commented out, then uncomment getAnnouncements()
// 7. Run this script with `node announcement-creator.js`

// Outdate Announcements
// 9. Ensure all the other functions are commented out, then uncomment announcementsOutdater()
// 10. Declare the announcement IDs to outdate in the outdateAnnoucements array on line 24
// 11. Run this script with `node announcement-creator.js`

const announcementContent = "ENTER ANNOUNCEMENT HERE";
const targetUsers = []; // Array of user IDs to target. Leave empty for all users.
const outdateAnnoucements = []; // Array of announcement IDs to outdate, [1, 2, 3, 4, 5]

const mysql = require('mysql');
require('dotenv').config();

const isDevEnvironment = true;

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
    // announcementsOutdater();
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

function announcementsOutdater() {
    // simply set isOutdated to true for all announcements that are not outdated. check outdateAnnoucements array
    if (!outdateAnnoucements.length) {
        console.log("No announcements to outdate. Did you forget to declare the announcement IDs?");
        connection.end();
        return;
    }
    const query = `
        UPDATE announcements
        SET isOutdated = true
        WHERE id IN (?);
    `;
    connection.query(query, [outdateAnnoucements], (err, results) => {
        if (err) {
            console.error("Error with announcementsOutdater:", err);
            connection.end();
            return;
        }
        console.log(`${results.changedRows} announcements outdated.`);
        connection.end();
    });

}
