const express = require('express');
const path = require('path');
const connection = require('./database-config');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const ensureAuthenticated = require('./middleware.js');

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
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results); // Send the results as JSON
  });
});

app.post('/register', (req, res) => {
  const { full_name, username, password, first_day_betting } = req.body;
  console.log(req.body);
  if (!full_name || !username || !password) {
    return res.status(400).send('Missing required fields.');
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.stack);
      return res.status(500).send({ message: 'Server error. Please try again later.' });
    }

    const sql = 'INSERT INTO users (full_name, username, password, first_day_betting, date_joined) VALUES (?, ?, ?, ?, NOW())';
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

  const sql = 'SELECT password FROM users WHERE username = ?';
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
  connection.query('SELECT full_name FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
          return res.status(500).send('Error fetching user');
      }

      if (results.length === 0) {
          return res.status(404).send('User not found');
      }

      // Return the user's full name as JSON
      res.json({ fullName: results[0].full_name });
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
