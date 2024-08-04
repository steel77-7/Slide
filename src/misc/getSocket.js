// socket.js
"use client";
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC__API_SERVER_API
let socket;
const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  socket.on('connect_error', (err) => {
    console.log(`Connection error : ${err.message}`);
  });
  return socket;
};

export default getSocket;
