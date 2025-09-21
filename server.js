const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Specify views directory

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Session Store
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey', // You should use a strong, random key here
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: dbURI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Define the User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Define the new Property Schema
const PropertySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // 'plot' or 'flat'
    name: { type: String, default: 'My New Property' },
    location: { type: String },
    additionalDetails: { type: String },
    address: { type: String },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    // Specific fields for plots
    sqYards: { type: Number },
    // Specific fields for flats
    bedrooms: { type: Number },
    mainPhoto: { type: String }, // Storing base64 as an example
    photos: { type: [String] },
    documents: { type: [String] },
    suggestions: { type: String },
    expertAdvice: { type: String }
}, {
    timestamps: true
});
const Property = mongoose.model('Property', PropertySchema);

// Routes

// Serve login and signup pages
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

app.get('/success', (req, res) => {
    res.render('success');
});

// Protect the dashboard route
app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        // Fetch user's properties from the database
        const properties = await Property.find({ userId: req.session.userId });

        res.render('dashboard', { user, properties: JSON.stringify(properties) });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.redirect('/success');
    } catch (err) {
        if (err.code === 11000) {
            return res.render('signup', { error: 'Email already exists.' });
        }
        res.render('signup', { error: 'Error creating user: ' + err.message });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password.' });
        }

        // Create a user session
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Server error.' });
    }
});

// New API routes to handle property data
app.post('/api/properties', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }
    const { type, name, location, address } = req.body;
    try {
        const newProperty = new Property({
            userId: req.session.userId,
            type,
            name,
            location,
            address
        });
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error creating property.');
    }
});

app.put('/api/properties/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }
    const { id } = req.params;
    const updates = req.body;
    try {
        const property = await Property.findOneAndUpdate(
            { _id: id, userId: req.session.userId },
            updates,
            { new: true, runValidators: true }
        );
        if (!property) {
            return res.status(404).send('Property not found or user not authorized.');
        }
        res.json(property);
    } catch (err) {
        console.error(err);
        res.status(400).send('Error updating property.');
    }
});

app.delete('/api/properties/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }
    const { id } = req.params;
    try {
        const property = await Property.findOneAndDelete({ _id: id, userId: req.session.userId });
        if (!property) {
            return res.status(404).send('Property not found or user not authorized.');
        }
        res.status(200).send('Property deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
