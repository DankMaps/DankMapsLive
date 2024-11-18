// src/services/socket.js

import io from 'socket.io-client';

const SOCKET_URL = 'http://your-server-url.com'; // Replace with your actual server URL

export const createSocketConnection = () => {
  const socket = io(SOCKET_URL);
  return socket;
};
