// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://192.168.1.12', // Allow requests from your app's IP
  optionsSuccessStatus: 200,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(compression());
app.use(morgan('combined')); // HTTP request logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const mimetype = allowedTypes.includes(file.mimetype);
  const extname = ['.jpeg', '.jpg', '.png'].includes(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
};

// Initialize multer with storage, file size limit, and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Define Store Schema and Model
const storeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  logo: { type: String }, // Should store the absolute URL to the image
  categories: { type: [String], default: [] },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  website: { type: String }
});

const Store = mongoose.model('Store', storeSchema);

// API Routes

// Get all stores
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new store with image upload
app.post('/api/stores', upload.single('logo'), async (req, res) => {
  console.log('Received request to add a new store');

  const { title, description, categories, latitude, longitude, website } = req.body;
  let logoUrl = '';

  if (req.file) {
    console.log(`Uploaded file: ${req.file.filename}`);
    const protocol = req.protocol;
    const host = req.get('host');
    logoUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    console.log(`Logo URL: ${logoUrl}`);
  } else {
    console.log('No file uploaded');
  }

  const store = new Store({
    title,
    description,
    logo: logoUrl,
    categories,
    latitude,
    longitude,
    website
  });

  try {
    const newStore = await store.save();
    console.log('Store saved to MongoDB:', newStore);
    res.status(201).json(newStore);
  } catch (err) {
    console.log('Error saving store to MongoDB:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update an existing store
app.put('/api/stores/:id', upload.single('logo'), async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const { title, description, categories, latitude, longitude, website } = req.body;

    if (title) store.title = title;
    if (description) store.description = description;
    if (categories) store.categories = categories;
    if (latitude) store.latitude = latitude;
    if (longitude) store.longitude = longitude;
    if (website) store.website = website;

    if (req.file) {
      console.log(`Uploaded file for update: ${req.file.filename}`);
      const protocol = req.protocol;
      const host = req.get('host');
      store.logo = `${protocol}://${host}/uploads/${req.file.filename}`;
      console.log(`Updated Logo URL: ${store.logo}`);
    }

    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (err) {
    console.log('Error updating store:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Delete a store
app.delete('/api/stores/:id', async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json({ message: 'Store deleted' });
  } catch (err) {
    console.log('Error deleting store:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Routes to serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/store-list', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'StoreListScreen.html'));
});

app.get('/add-store', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'AddStoreScreen.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on http://192.168.1.12:${PORT}`));
