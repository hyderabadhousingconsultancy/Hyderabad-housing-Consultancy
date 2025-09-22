const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 10000;

// --- Middleware ---
app.use(express.json({ limit: '50mb' })); // To handle large base64 strings
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET, // Use the environment variable
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use `true` if you are on HTTPS
}));

// --- MongoDB Connection ---
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));

// --- Mongoose Schemas and Models ---
const propertySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true }, // 'plot', 'flat', 'other'
    name: String,
    location: String,
    sqYards: Number,
    bedrooms: Number,
    additionalDetails: String,
    address: String,
    purchaseDate: Date,
    purchasePrice: Number,
    photos: [String], // Array of base64 strings
    documents: [String], // Array of base64 strings
    suggestions: String,
    expertAdvice: String,
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: String // To store base64 string or URL
});

const Property = mongoose.model('Property', propertySchema);
const User = mongoose.model('User', userSchema);

// --- User Authentication Middleware ---
const requireLogin = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// --- Routes ---

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            res.redirect('/dashboard');
        } else {
            res.send('Invalid email or password. <a href="/login">Try again</a>');
        }
    } catch (err) {
        res.status(500).send('Server error.');
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        // Redirect to the success page instead of dashboard
        res.redirect('/success');
    } catch (err) {
        if (err.code === 11000) {
            res.send('Email already registered. <a href="/login">Login here</a>');
        } else {
            res.status(500).send('Server error.');
        }
    }
});

// New route for the success page
app.get('/success', (req, res) => {
    res.render('success');
});

app.get('/dashboard', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        const properties = await Property.find({ userId: req.session.userId });
        res.render('dashboard', { user, properties: JSON.stringify(properties) });
    } catch (err) {
        res.status(500).send('Server error.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid'); // Or your session cookie name
        res.redirect('/login');
    });
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

// --- API Endpoints for Properties ---
app.post('/api/properties', requireLogin, async (req, res) => {
    try {
        const { type } = req.body;
        const newProperty = new Property({
            userId: req.session.userId,
            type: type,
        });
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(500).send('Failed to create new property.');
    }
});

app.put('/api/properties/:id', requireLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedProperty = await Property.findOneAndUpdate(
            { _id: id, userId: req.session.userId },
            { $set: updates },
            { new: true }
        );
        if (!updatedProperty) {
            return res.status(404).send('Property not found or you do not have permission to edit it.');
        }
        res.json(updatedProperty);
    } catch (err) {
        res.status(500).send('Failed to update property.');
    }
});

app.delete('/api/properties/:id', requireLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Property.findOneAndDelete({ _id: id, userId: req.session.userId });
        if (!result) {
            return res.status(404).send('Property not found or you do not have permission to delete it.');
        }
        res.status(200).send('Property deleted successfully.');
    } catch (err) {
        res.status(500).send('Failed to delete property.');
    }
});

// --- API Endpoint for Profile Picture ---
app.put('/api/profile-pic', requireLogin, async (req, res) => {
    try {
        const { profilePic } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            { profilePic: profilePic },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }
        res.status(200).json({ message: 'Profile picture updated successfully.' });
    } catch (err) {
        res.status(500).send('Failed to update profile picture.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
