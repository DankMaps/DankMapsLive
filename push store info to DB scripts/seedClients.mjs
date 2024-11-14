import mongoose from 'mongoose';
import Client from '../models/client.mjs';
import { storeData } from '../src/data/storeData.mjs';

// Amazon S3 base URL
const s3BaseUrl = 'https://dankmapsassets.s3.eu-north-1.amazonaws.com/';

// MongoDB connection
mongoose.connect('mongodb+srv://Creecy230:7fHdMRHCsjqvRAvq@store-info-update-cluse.gduer.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

const seedClients = async () => {
  try {
    await Client.deleteMany({});
    const clientsToInsert = storeData.map((client) => ({
      id: client.id,
      title: client.title,
      description: client.description,
      logo: client.logo.startsWith(s3BaseUrl) ? client.logo : `${s3BaseUrl}${client.logo}`,
      categories: client.categories,
      latitude: client.latitude,
      longitude: client.longitude,
      website: client.website,
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
