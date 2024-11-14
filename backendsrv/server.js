// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = await User.findOne({ where: { username, password } });

  if (user) {
    res.json({ success: true, userId: user.id });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Register endpoint
app.post('/register', async (req, res) => {
  console.log('Register request received:', req.body);
  const { username, password } = req.body;

  try {
    // Create new user
    const newUser = await User.create({ username, password });
    console.log('New user registered:', newUser);

    res.json({ success: true, userId: newUser.id });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ success: false, message: 'Username already exists' });
    } else {
      res.status(500).json({ success: false, message: 'An error occurred during registration' });
    }
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Backend server is running on http://creevy.ddns.net:3000');
});
