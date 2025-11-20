const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const register = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (user) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, 
        [username, hashedPassword, 'user'], 
        function(err) {
          if (err) return res.status(500).json({ message: 'Error registering user' });
          
          db.get(`SELECT id, username, role FROM users WHERE id = ?`, [this.lastID], (err, newUser) => {
            const token = generateToken(newUser);
            res.status(201).json({
              token,
              user: { id: newUser.id, username: newUser.username, role: newUser.role },
            });
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = generateToken(user);
      res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };