const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MONGODB_URI, PORT, JWT_SECRET } = require('./config');
const Meeting = require('./models/Meeting');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB with better error handling
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Please provide username, email and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('User already exists:', { email, username });
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        console.log('Saving new user:', { username, email });
        await user.save();
        console.log('User saved successfully');

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            token,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username/email and password' });
        }

        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        
        res.json({
            token,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ message: 'Login failed. Please try again.' });
    }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
});

// Protected Meeting Routes
app.post('/api/meetings', authenticateToken, async (req, res) => {
    try {
        const meeting = new Meeting({
            ...req.body,
            organizer: req.user.userId
        });
        await meeting.save();
        res.status(201).json(meeting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/meetings', authenticateToken, async (req, res) => {
    try {
        const meetings = await Meeting.find({ organizer: req.user.userId });
        res.json(meetings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/meetings/:id', authenticateToken, async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndUpdate(
            { _id: req.params.id, organizer: req.user.userId },
            req.body,
            { new: true }
        );
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.json(meeting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/meetings/:id', authenticateToken, async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndDelete({
            _id: req.params.id,
            organizer: req.user.userId
        });
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const port = PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
