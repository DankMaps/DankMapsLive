const mongoose = require('mongoose');
const Client = require('../models/client');
const { storeData } = require('../src/data/storeData');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Creecy230:7fHdMRHCsjqvRAvq@store-info-update-cluse.gduer.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Function to seed data
const seedClients = async () => {
  try {
    await Client.deleteMany({}); // Optional: Clear existing data

    const clientsToInsert = storeData.map(client => ({
      id: client.id,
      title: client.title,
      description: client.description,
      logo: client.logo, // Adjust if needed (e.g., store URLs or unique identifiers)
      categories: client.categories,
      latitude: client.latitude,
      longitude: client.longitude,
      website: client.website
    }));

    await Client.insertMany(clientsToInsert);
    console.log('Clients seeded successfully');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedClients();
