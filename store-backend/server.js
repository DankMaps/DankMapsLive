// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // For unique file names
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());

// Middleware to parse incoming JSON data
app.use(express.json());

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Configure Multer storage (memory storage to buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define the client schema and model
const clientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Ensure unique IDs
  title: { type: String, required: true },
  description: { type: String },
  logo: { type: String, required: true }, // URL of the logo in S3
  categories: { type: [String], default: [] },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  website: { type: String },
});

const Client = mongoose.model('Client', clientSchema);

// Helper function to upload file to S3
const uploadFileToS3 = (file) => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // Make the file publicly readable
  };

  return s3.upload(params).promise();
};

// Helper function to delete file from S3
const deleteFileFromS3 = (fileUrl) => {
  const urlParts = fileUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  return s3.deleteObject(params).promise();
};

// API endpoint to get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients); // Send clients data as-is
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

// API endpoint to add a new client with optional manual id and image upload
app.post('/api/clients', upload.single('logo'), async (req, res) => {
  try {
    // Validate required fields
    const { id, title, description, categories, latitude, longitude, website } = req.body;
    if (!title || !latitude || !longitude || !req.file) {
      return res.status(400).json({ error: 'Title, latitude, longitude, and logo are required.' });
    }

    let finalId = id;

    if (id) {
      // Check if the provided id is unique
      const existingClient = await Client.findOne({ id: id });
      if (existingClient) {
        return res.status(409).json({ error: `ID "${id}" already exists. Please provide a unique ID.` });
      }
    } else {
      // Auto-generate the id by finding the latest id and incrementing
      const latestClient = await Client.findOne().sort({ id: -1 }).exec(); // Sort in descending order by `id`
      finalId = latestClient ? (parseInt(latestClient.id, 10) + 1).toString() : '1'; // Increment or start from '1' if no clients
    }

    // Upload the image to S3
    const uploadResult = await uploadFileToS3(req.file);
    const logoUrl = uploadResult.Location; // URL of the uploaded image

    // Create new client data
    const clientData = {
      id: finalId,
      title,
      description,
      categories: categories ? JSON.parse(categories) : [],
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      website,
      logo: logoUrl,
    };

    const client = new Client(clientData);
    await client.save();

    res.status(201).json(client); // Return the saved client data
  } catch (error) {
    console.error('Error adding client:', error);
    // Handle duplicate key error (e.g., if id was auto-generated and duplicate somehow)
    if (error.code === 11000) {
      res.status(409).json({ error: 'Duplicate ID detected. Please try again.' });
    } else {
      res.status(500).json({ error: 'Failed to add client' });
    }
  }
});

// API endpoint to update an existing client
app.put('/api/clients/:id', upload.single('logo'), async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const updateData = { ...req.body };

    // If a new logo is uploaded, upload it to S3 and update the logo URL
    if (req.file) {
      // Optionally, delete the old logo from S3
      await deleteFileFromS3(client.logo);

      const uploadResult = await uploadFileToS3(req.file);
      updateData.logo = uploadResult.Location;
    }

    // If categories are provided, parse them
    if (updateData.categories) {
      updateData.categories = JSON.parse(updateData.categories);
    }

    // Parse latitude and longitude if provided
    if (updateData.latitude) {
      updateData.latitude = parseFloat(updateData.latitude);
    }
    if (updateData.longitude) {
      updateData.longitude = parseFloat(updateData.longitude);
    }

    // If the user is trying to update the 'id', ensure it's unique
    if (updateData.id && updateData.id !== req.params.id) {
      const existingClient = await Client.findOne({ id: updateData.id });
      if (existingClient) {
        return res.status(409).json({ error: `ID "${updateData.id}" already exists. Please provide a unique ID.` });
      }
    }

    const updatedClient = await Client.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    // Handle duplicate key error
    if (error.code === 11000) {
      res.status(409).json({ error: 'Duplicate ID detected. Please try again.' });
    } else {
      res.status(500).json({ error: 'Failed to update client' });
    }
  }
});

// API endpoint to delete a client and its logo from S3
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Delete the logo from S3
    await deleteFileFromS3(client.logo);

    // Delete the client from MongoDB
    await Client.findOneAndDelete({ id: req.params.id });

    res.status(204).send(); // No content status
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://darksamarai.ddns.net:${PORT}`);
});
