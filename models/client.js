const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  logo: { type: String }, // Consider using a URL or file identifier instead of require path
  categories: { type: [String], default: [] },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  website: { type: String }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
