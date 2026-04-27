const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT user_id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING user_id, username, email, profile_image_url',
      [username, email, passwordHash]
    );

    const newUser = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { user_id: newUser.user_id, username: newUser.username },
      process.env.JWT_SECRET || 'astropin_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, username, password } = req.body;
  
  if ((!email && !username) || !password) {
    return res.status(400).json({ error: 'Please provide email/username and password' });
  }

  try {
    // Authenticate with either email or username
    const userResult = await pool.query(
      'SELECT user_id, username, email, password_hash, profile_image_url FROM users WHERE email = $1 OR username = $2',
      [email || '', username || '']
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Assign Token
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET || 'astropin_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
        user: { 
            user_id: user.user_id, 
            username: user.username, 
            email: user.email, 
            profile_image_url: user.profile_image_url 
        }, 
        token 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signup, login };
