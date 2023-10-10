const express = require('express');
const path = require('path');
const connection = require('./database-config');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const ensureAuthenticated = require('./middleware.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // to support URL-encoded bodies

app.use(express.json());
app.use(session({
  secret: 'password',
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/index', ensureAuthenticated, (req, res) => {
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

      req.session.isAuthenticated = true;
      req.session.username = username;
      req.session.userId = results[0].ID;
      res.status(200).send({ message: 'Logged in successfully.' });
    });
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during session destroy:', err);
      return res.status(500).send({ message: 'Internal server error.' });
    }
    res.status(200).send({ message: 'Logged out successfully.' });
  });
});

app.get('/current-user', ensureAuthenticated, (req, res) => {
  const username = req.session.username;
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

app.post('/save-entries', ensureAuthenticated, (req, res) => {
  const entries = req.body.entries;
  if (!entries || !entries.length) {
    return res.status(400).json({ success: false, message: 'No entries provided.' });
  }
  // Preparing the data for bulk insert
  const values = [];
  entries.forEach(entry => {
    values.push([
      req.session.userId,
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

app.post('/save-notes', ensureAuthenticated, (req, res) => {
  const notes = req.body.notes || ""; // If no note content is provided, use an empty string

  const sql = `
      INSERT INTO notes (fk_user_id, notes_content)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE notes_content = VALUES(notes_content);
  `;

  connection.query(sql, [req.session.userId, notes], (err, results) => {
    if (err) {
      console.error('Error saving notes:', err.stack);
      return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
    res.json({ success: true, message: 'Note saved successfully!' });
  });
});

app.get('/get-notes', ensureAuthenticated, (req, res) => {
  const userId = req.session.userId;

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

app.get('/get-purchase-history', ensureAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const sql = 'SELECT * FROM records WHERE fk_user_id = ? AND isDeleted = 0 ORDER BY date_of_entry DESC';
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching purchase history:', err.stack);
      return res.status(500).send({ message: 'Server error. Please try again later.' });
    }

    res.json({ success: true, data: results });
  });
});

app.delete('/delete-purchase/:recordId', ensureAuthenticated, (req, res) => {
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

app.post('/save-winnings', ensureAuthenticated, (req, res) => {
  const winnings = req.body.winning;
  if (!winnings) {
    return res.status(400).json({ success: false, message: 'No winnings provided.' });
  }

  // Preparing the data for bulk insert
  const values = [];
  values.push([
    req.session.userId,
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

app.get('/get-winnings', ensureAuthenticated, (req, res) => {
  const userId = req.session.userId;
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

app.put('/update-section-order', ensureAuthenticated, (req, res) => {
  const username = req.session.username;
  const newOrder = req.body.newOrder;
  
  connection.query('UPDATE users SET sections_order = ? WHERE username = ?', [JSON.stringify(newOrder), username], (err, results) => {
      if (err) {
          return res.status(500).send('Error updating sections order');
      }

      res.status(200).send('Sections order updated successfully');
  });
});

app.put('/edit-purchase/:recordId', ensureAuthenticated, (req, res) => {
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

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
