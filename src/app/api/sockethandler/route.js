/* const express = require("express");
const next = require("next");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  // Enable CORS with specified options
  server.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow specific HTTP methods
  }));

  const io = socketIo(httpServer, {
    cors: {
      origin: '*', // Allow all origins for WebSocket connections
      methods: ['GET', 'POST'], // Allow specific HTTP methods
      allowedHeaders: ['*'], // Allow all headers
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    // Handling connection request
    socket.on("connection-request", (data) => {
      socket.emit("connection-request", data);
    });

    // Handling connection request acceptance
    socket.on("handleConnectionRequest", (data) => {
      socket.emit("handleConnectionRequest", data);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});


 */