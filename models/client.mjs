import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  logo: { type: String, required: true },
  categories: { type: [String], default: [] },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  website: { type: String },
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
