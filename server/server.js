const express = require('express');
const app = express();
const server = require('http').Server(app);
const five = require('johnny-five');

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

// Configura el sensor de pulso cardíaco
const board = new five.Board();
let heartRateValue = 0;

board.on('ready', function() {
  const heartRateSensor = new five.Sensor({
    pin: 'A0', // Pin analógico al que está conectado el sensor
    freq: 250, // Frecuencia de lectura en milisegundos
  });

  heartRateSensor.on('change', function() {
    heartRateValue = this.value;
  });
});

io.on('connection', (socket) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    socket.emit('heartRate', heartRateValue);
  }, 1000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

