const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());

// Example route
app.get('/', (req, res) => {
    res.send('Hello World');
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('connection-request', (data) => {
        console.log("connection-request (data)", data)
        socket.broadcast.emit('connection-request', data);
    });

    socket.on('handleConnectionRequest', (data) => {
        console.log("handleConnectionRequest (data)", data)
        socket.broadcast.emit('handleConnectionRequest', data);
    });
    socket.on('offer', (data) => {
        console.log("offer (data)", data)
        socket.broadcast.emit('offer', data);
    });
    socket.on('answer', (data) => {
        console.log("answer (data)", data)
        socket.broadcast.emit('answer', data);
    });
    socket.on('ice-candidate', (data) => {
        console.log("ice candidate (data)", data)
        socket.broadcast.emit('ice-candidate', data);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
