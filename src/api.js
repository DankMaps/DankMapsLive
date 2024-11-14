// src/api.js

const BASE_URL = 'http://darksamarai.ddns.net:3000/api/stores'; // Replace with your server's IP and port

export const fetchStores = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch stores');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
};
