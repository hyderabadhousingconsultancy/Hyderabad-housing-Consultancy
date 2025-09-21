require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Property Schema
const PropertySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // 'plot' or 'flat'
    name: { type: String, default: 'My New Property' },
    location: { type: String },
    additionalDetails: { type: String },
    address: { type: String },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    sqYards: { type: Number }, // Specific for plots
    bedrooms: { type: Number }, // Specific for flats
    photos: { type: [String] }, // Stores Base64 strings
    documents: { type: [String] }, // Stores Base64 strings
    suggestions: { type: String },
    expertAdvice: { type: String }
}, {
    timestamps: true
});
const Property = mongoose.model('Property', PropertySchema);

// Session Middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Routes
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid email or password.' });
    }
});

app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.render('success');
    } catch (err) {
        res.render('signup', { error: 'An account with this email already exists.' });
    }
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const properties = await Property.find({ userId: req.session.userId }).lean();
        res.render('dashboard', { user: { email: 'user' }, properties: JSON.stringify(properties) });
    } catch (err) {
        res.status(500).send('Error loading dashboard.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// API Routes
app.post('/api/properties', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const newProperty = new Property({
            ...req.body,
            userId: req.session.userId
        });
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(400).send('Failed to create property.');
    }
});

app.put('/api/properties/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const updatedProperty = await Property.findOneAndUpdate(
            { _id: req.params.id, userId: req.session.userId },
            req.body,
            { new: true }
        );
        if (!updatedProperty) {
            return res.status(404).send('Property not found.');
        }
        res.status(200).json(updatedProperty);
    } catch (err) {
        res.status(400).send('Failed to update property.');
    }
});

app.delete('/api/properties/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const deletedProperty = await Property.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
        if (!deletedProperty) {
            return res.status(404).send('Property not found.');
        }
        res.status(200).send('Property deleted.');
    } catch (err) {
        res.status(500).send('Failed to delete property.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
