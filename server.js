const express = require('express');
const cors = require('cors');
const path = require('path');
const connection = require('./database-config');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { customJwtMiddleware, jwtSECRET} = require('./middleware.js');

const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { DateTime } = require('luxon');

const app = express();
const PORT = process.env.PORT || 3000;

// const corsOptions = {
//   origin: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // to support URL-encoded bodies

app.use(express.json());
// app.use(session({
//   secret: 'password',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     sameSite: 'none',
//     secure: true, // ensure this is true when using SameSite=None
//     httpOnly: true, // recommended to keep this for security
//     path: '/'  // you had this in your previous config
//   }
// }));
// no longer using the above session config because it doesn't work with Cordova
const jsonwebtoken  = require('jsonwebtoken');

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: process.env.NODE_ENV === 'production' ? '/tmp/' : './temp/',
}));

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

app.use(cookieParser());

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/index', customJwtMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/index.html', (req, res, next) => {
  // This middleware redirects direct accesses to `/index.html` to the `/index` route.
  return res.redirect('/index');
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.stack);
      return res.status(500).send('Error fetching users');
    }
    res.json(results); // Send the results as JSON
  });
});

app.post('/register', (req, res) => {
  const { full_name, username, password, first_day_betting } = req.body;
  if (!full_name || !username || !password) {
    return res.status(400).send('Missing required fields.');
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.stack);
      return res.status(500).send({ message: 'Server error. Please try again later.' });
    }

    const sql = 'INSERT INTO users (full_name, username, password, first_day_betting) VALUES (?, ?, ?, ?)';
    connection.query(sql, [full_name, username, hashedPassword, first_day_betting], (err, results) => {
      if (err) {
        console.error('Error inserting new user:', err.stack);
        return res.status(500).send({ message: 'Server error. Please try again later.' });
      }
      res.status(201).send({ message: 'User added successfully' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: 'Missing required fields.' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err.stack);
      return res.status(500).send({ message: 'Server error. Please try again later.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const storedHashedPassword = results[0].password;

    // Compare provided password with stored hashed password
    bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
      if (err) {
        console.error('Error comparing password:', err.stack);
        return res.status(500).send({ message: 'Server error. Please try again later.' });
      }

      if (!isMatch) {
        return res.status(401).send({ message: 'Password is incorrect.' });
      }

      const userPayload = {
        username: results[0].username,
        userId: results[0].ID,
        fullName: results[0].full_name
      };
      const token = jsonwebtoken.sign(userPayload, jwtSECRET, { expiresIn: '1h' });

      // Set the JWT as an httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      res.status(200).send({ message: 'Logged in successfully.', token });
    });
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).send({ message: 'Logged out successfully.' });
});

app.get('/current-user', customJwtMiddleware, (req, res) => {
  const username = req.user.username;
  connection.query('SELECT full_name, sections_order FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    // Return the user's full name as JSON
    res.json({ fullName: results[0].full_name, sectionsOrder: JSON.parse(results[0].sections_order) });
  });
});

app.post('/save-entries', customJwtMiddleware, (req, res) => {
  const entries = req.body.entries;
  if (!entries || !entries.length) {
    return res.status(400).json({ success: false, message: 'No entries provided.' });
  }
  // Preparing the data for bulk insert
  const values = [];
  entries.forEach(entry => {
    values.push([
      req.user.userId,
      entry.lottery_name,
      entry.entry_type,
      entry.pick_type,
      entry.bet_amount,
      entry.outlet,
      entry.number_of_boards,
      entry.cost
    ]);
  });

  const placeholder = "(?, ?, ?, ?, ?, ?, ?, ?)";
  const placeholders = new Array(entries.length).fill(placeholder).join(', ');

  const sql = `
      INSERT INTO records 
      (fk_user_id, lottery_name, entry_type, pick_type, bet_amount, outlet, number_of_boards, cost) 
      VALUES ${placeholders}
  `;

  // Flatten the values array for the query
  const flattenedValues = [].concat(...values);

  connection.query(sql, flattenedValues, (err, results) => {
    if (err) {
      console.error('Error with bulk insert:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
    res.json({ success: true, message: 'Entries added successfully!' });
  });
});

app.post('/save-notes', customJwtMiddleware, (req, res) => {
  const notes = req.body.notes || ""; // If no note content is provided, use an empty string

  const sql = `
      INSERT INTO notes (fk_user_id, notes_content)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE notes_content = VALUES(notes_content);
  `;

  connection.query(sql, [req.user.userId, notes], (err, results) => {
    if (err) {
      console.error('Error saving notes:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
    res.json({ success: true, message: 'Note saved successfully!' });
  });
});

app.get('/get-notes', customJwtMiddleware, (req, res) => {
  const userId = req.user.userId;

  const sql = `SELECT notes_content FROM notes WHERE fk_user_id = ?`;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching notes:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }

    if (results.length) {
      return res.json({ success: true, notes: results[0].notes_content });
    } else {
      return res.json({ success: true, notes: "" }); // Default to empty string if no notes found
    }
  });
});

app.get('/get-purchase-history', customJwtMiddleware, (req, res) => {
  const userId = req.user.userId;
  const sql = 'SELECT * FROM records WHERE fk_user_id = ? AND isDeleted = 0 ORDER BY date_of_entry DESC';
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching purchase history:', err.stack);
      return res.status(500).send({ message: 'Server error. Please try again later.' });
    }

    res.json({ success: true, data: results });
  });
});

app.delete('/delete-purchase/:recordId', customJwtMiddleware, (req, res) => {
  const recordId = req.params.recordId;

  if (!recordId) {
    return res.status(400).json({ success: false, message: 'Record ID is required.' });
  }

  const sql = 'UPDATE records SET isDeleted = 1 WHERE id = ?';
  connection.query(sql, [recordId], (err, results) => {
    if (err) {
      console.error('Error deleting purchase:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Purchase not found.' });
    }

    res.json({ success: true, message: 'Purchase deleted successfully.' });
  });
});

app.post('/save-winnings', customJwtMiddleware, (req, res) => {
  const winnings = req.body.winning;
  if (!winnings) {
    return res.status(400).json({ success: false, message: 'No winnings provided.' });
  }

  // Preparing the data for bulk insert
  const values = [];
  values.push([
    req.user.userId,
    winnings.lottery_name,
    winnings.entry_type,
    winnings.pick_type,
    winnings.outlet,
    winnings.winning_prize,
    winnings.date_of_winning
  ]);

  const placeholder = "(?, ?, ?, ?, ?, ?, ?)";
  const placeholders = new Array(winnings.length).fill(placeholder).join(', ');

  const sql = `
      INSERT INTO prizes 
      (fk_user_id, lottery_name, entry_type, pick_type, outlet, winning_prize, date_of_winning) 
      VALUES ${placeholders}
  `;

  // Flatten the values array for the query
  const flattenedValues = [].concat(...values);

  connection.query(sql, flattenedValues, (err, results) => {
    if (err) {
      console.error('Error with bulk insert:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
    res.json({ success: true, message: 'Winnings added successfully!', id: results.insertId });
  });
});

app.get('/get-winnings', customJwtMiddleware, (req, res) => {
  const userId = req.user.userId;
  const sql = 'SELECT * FROM prizes WHERE fk_user_id = ? AND isDeleted = 0 ORDER BY date_of_winning DESC';
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching winnings:', err.stack);
      return res.status(500).send({ message: 'Server error. Please try again later.' });
    }

    res.json({ success: true, data: results });
  });
});

app.delete('/delete-winning/:recordId', (req, res) => {
  const recordId = req.params.recordId;

  if (!recordId) {
    return res.status(400).json({ success: false, message: 'Record ID is required.' });
  }

  const sql = 'UPDATE prizes SET isDeleted = 1 WHERE id = ?';
  connection.query(sql, [recordId], (err, results) => {
    if (err) {
      console.error('Error deleting winning:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Winning not found.' });
    }

    res.json({ success: true, message: 'Winning deleted successfully.' });
  });
});

app.put('/update-section-order', customJwtMiddleware, (req, res) => {
  const username = req.user.username;
  const newOrder = req.body.newOrder;

  connection.query('UPDATE users SET sections_order = ? WHERE username = ?', [JSON.stringify(newOrder), username], (err, results) => {
    if (err) {
      return res.status(500).send('Error updating sections order');
    }

    res.status(200).send('Sections order updated successfully');
  });
});

app.put('/edit-purchase/:recordId', customJwtMiddleware, (req, res) => {
  const recordId = req.params.recordId;
  const { date_of_entry } = req.body;

  if (!recordId || !date_of_entry) {
    return res.status(400).send({ message: 'Missing required fields.' });
  }

  const sql = 'UPDATE records SET date_of_entry = ? WHERE id = ?';
  connection.query(sql, [date_of_entry, recordId], (err, results) => {
    if (err) {
      console.error('Error editing purchase:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Purchase not found.' });
    }

    res.json({ success: true, message: 'Purchase edited successfully.' });
  });
});

app.post('/upload-image', customJwtMiddleware, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ success: false, message: 'No files were uploaded.' });
  }
  let uploadedFile = req.files.image;

  const lotteryName = req.body.lotteryName;

  cloudinary.uploader.upload(uploadedFile.tempFilePath, { folder: 'Singapore Lottery Ledger project/Betslips' }, (error, result) => {
    if (error) {
      console.error('Error uploading to Cloudinary:', error);
      return res.status(500).json({ success: false, message: 'Error uploading image.' });
    }

    // Delete the temp file after uploading to Cloudinary
    fs.unlink(uploadedFile.tempFilePath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    // After successful upload, store the result.secure_url in your database
    const sql = `
          INSERT INTO betslips (fk_user_id, lottery_name, image_url)
          VALUES (?, ?, ?);
      `;

    connection.query(sql, [req.user.userId, lotteryName, result.secure_url], (err, results) => {
      if (err) {
        console.error('Error saving image URL to the database:', err.stack);
        return res.status(500).json({ success: false, message: 'Error saving image URL to the database.' });
      }
      res.json({ success: true, imgUrl: result.secure_url });
    });
  });
});

app.get('/retrieve-betslips', customJwtMiddleware, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT * FROM betslips 
    WHERE fk_user_id = ? AND isChecked = 0;
  `;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving betslips:', err.stack);
      return res.status(500).json({ success: false, message: 'Error retrieving your betslips from the database.' });
    }
    res.json({ success: true, data: results });
  });
});

app.delete('/check-betslip/:id', customJwtMiddleware, (req, res) => {
  const betslipId = req.params.id;

  const sql = `
      UPDATE betslips 
      SET isChecked = 1, date_checked = CURRENT_TIMESTAMP
      WHERE ID = ?;
  `;

  connection.query(sql, [betslipId], (err, results) => {
    if (err) {
      console.error('Error updating betslip:', err.stack);
      return res.status(500).json({ success: false, message: 'Error marking your betslip as checked.' });
    }
    res.json({ success: true, message: 'Betslip marked as checked.' });
  });
});

app.post('/contact-admin', customJwtMiddleware, (req, res) => {
  const userId = req.user.userId;
  const { messageType, messageContent, senderEmail } = req.body;

  if (!messageType || !messageContent || !senderEmail) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  let currentDate = DateTime.now().setZone("Asia/Singapore");
  let formattedDate = `${currentDate.toFormat('dd/LL/yyyy')} at ${currentDate.toFormat('h:mm:ss a')}`;

  // Check how many unresolved messages the user already has
  const countSql = `
      SELECT COUNT(*) AS unresolvedCount 
      FROM messages 
      WHERE fk_user_id = ? AND isResolved = 0;
  `;

  connection.query(countSql, [userId], (err, results) => {
    if (err) {
      console.error('Error checking unresolved message count:', err.stack);
      return res.status(500).json({ success: false, message: 'Error processing your request.' });
    }

    if (results[0].unresolvedCount >= 3) {
      return res.status(400).json({ success: false, message: 'You have sended 3 messages. Please wait for admin\'s reply' });
    }

    let mailOptions = {
      from: `SG Lottery Ledger <${senderEmail}>`,
      replyTo: senderEmail,
      to: 'weilinquek201@gmail.com',
      cc: 'infocommclub1@gmail.com',
      subject: `SG Lottery Ledger: New message - ${messageType}`,
      html: `
        <div style="font-family: math;">
          <h2>New Message received from Singapore Lottery Ledger mobile app project</h2>
          <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="background-color: #f2f2f2; font-weight: bold;">Message Type</td>
              <td>${messageType}</td>
            </tr>
            <tr>
              <td style="background-color: #f2f2f2; font-weight: bold;">Message Content</td>
              <td>${messageContent}</td>
            </tr>
            <tr>
              <td style="background-color: #f2f2f2; font-weight: bold;">Sent By</td>
              <td>${req.user.fullName} (Username: ${req.user.username})</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">Message sent on ${formattedDate}</p>
          <p style="margin-top: 20px;">Email of sender: ${senderEmail}</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email notification. Message not stored.' });
      }

      // If email is sent successfully, insert the message into the database
      const insertSql = `
        INSERT INTO messages (message_type, message_content, fk_user_id, sender_email)
        VALUES (?, ?, ?, ?);
      `;

      connection.query(insertSql, [messageType, messageContent, userId, senderEmail], (err, results) => {
        if (err) {
          console.error('Error inserting message:', err.stack);
          return res.status(500).json({ success: false, message: 'Error submitting your message to the admin.' });
        }
        res.json({ success: true, message: 'Message sent successfully.' });
      });
    });
  });
});


app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = { server, PORT };