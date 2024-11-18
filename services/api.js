// src/services/api.js

import axios from 'axios';

const API_URL = 'http://darksamarai.ddns.net:3000/api/clients'; // Update this to your actual IP or server URL

export const fetchStoreData = async () => {
  try {
    const response = await axios.get(API_URL, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw error;
  }
};
