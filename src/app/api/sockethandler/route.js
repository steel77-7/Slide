const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    // Handle asynchronous events
    socket.on('message', async (msg) => {
      try {
        // Simulate an asynchronous operation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Message received: ', msg);
        io.emit('message', msg); // Broadcast the message to all clients
      } catch (error) {
        console.error('Error processing message: ', error);
      }
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
