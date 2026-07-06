require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ====== Middleware ======
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files
app.use(express.static('.'));
app.use('/images', express.static(path.join(__dirname, 'frontend/images')));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// ====== MySQL Connection for Authentication (DB_NAME) ======
const authDb = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

authDb.connect(err => {
    if (err) {
        console.error('Auth Database connection failed:');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('SQL State:', err.sqlState);
        throw err;
    }
    console.log(`MySQL connected to auth database: ${process.env.DB_NAME}`);
});

// ====== MySQL Connection for Flats (DB_NAME2) ======
const flatsDb = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME2
});

flatsDb.connect(err => {
    if (err) {
        console.error('Flats Database connection failed:');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        throw err;
    }
    console.log(`MySQL connected to flats database: ${process.env.DB_NAME2}`);
});

// ====== Authentication Routes ======

// Check if email exists
app.post('/check-email', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    authDb.query(query, [email.toLowerCase()], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ exists: results.length > 0 });
    });
});

// Register new user
app.post('/signup', async (req, res) => {
    const { username, email, password, gender } = req.body;

    authDb.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        authDb.query(
            'INSERT INTO users (username, email, password, gender) VALUES (?, ?, ?, ?)',
            [username, email.toLowerCase(), hashedPassword, gender],
            (err, results) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'User registered successfully' });
            }
        );
    });
});

// Login user
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    authDb.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                gender: user.gender
            }
        });
    });
});

// ====== Flats & Cart Routes ======

// Get all flats
app.get('/api/flats', (req, res) => {
    const query = 'SELECT * FROM flats';
    flatsDb.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get cart for a user
app.get('/api/cart/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const query = `
        SELECT c.flat_id, f.title, f.price, f.rating, f.flatmates, f.area, f.status, f.img, f.gender
        FROM cart c
        JOIN flats f ON c.flat_id = f.id
        WHERE c.user_id = ?
    `;
    flatsDb.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add flat to cart
app.post('/api/cart', (req, res) => {
    const { user_id, flat_id } = req.body;

    // Check if already in cart
    const checkQuery = 'SELECT * FROM cart WHERE user_id = ? AND flat_id = ?';
    flatsDb.query(checkQuery, [user_id, flat_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.json({ success: false, message: 'Already in cart' });
        }

        // Insert into cart
        const insertQuery = 'INSERT INTO cart (user_id, flat_id) VALUES (?, ?)';
        flatsDb.query(insertQuery, [user_id, flat_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Added to cart' });
        });
    });
});

app.post('/api/flats/mark-unavailable', (req, res) => {
    const { flat_id } = req.body;

    if (!flat_id) return res.status(400).json({ error: 'flat_id is required' });

    const query = 'UPDATE flats SET status = "Unavailable" WHERE id = ?';
    flatsDb.query(query, [flat_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ success: true, message: 'Flat marked as unavailable.' });
    });
});


// ====== Default Route ======
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/login/login.html'));
});

// ====== Start Server ======
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
