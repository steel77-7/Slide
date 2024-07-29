// socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'

let socket;
const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  socket.on('connect_error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });
  socket.on('connect', () => {
    console.log('Socket connected', socket.id);
  });
  return socket;
};

export default getSocket;
