const express = require('express');
const app = express();
const server = require('http').Server(app);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Reemplaza '' con la URL permitida si es necesario
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000', // Reemplaza '' con la URL permitida si es necesario
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

io.on('connection', (socket) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    const randomNumber = Math.floor(Math.random() * 100);
    socket.emit('randomNumber', randomNumber);
  }, 1000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

