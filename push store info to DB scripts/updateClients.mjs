import mongoose from 'mongoose';
import Client from '../models/client.mjs';
import { newStoreData } from '../src/data/newStoreData.mjs'; // New or updated client data

const s3BaseUrl = 'https://dankmapsassets.s3.eu-north-1.amazonaws.com/';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

const updateClients = async () => {
  try {
    for (const client of newStoreData) {
      const logoUrl = client.logo.startsWith(s3BaseUrl) ? client.logo : `${s3BaseUrl}${client.logo}`;

      // Update client if it exists, otherwise insert
      await Client.updateOne(
        { id: client.id }, // Find by unique identifier
        { $set: { ...client, logo: logoUrl } },
        { upsert: true } // This will insert if no document matches
      );
    }
    console.log('Clients updated successfully');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

updateClients();
