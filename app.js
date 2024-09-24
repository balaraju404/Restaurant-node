require('./config');
require('./constants');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const appRouter = require('./app/routes/index');

const app = express();

const allowedOrigins = [
  'http://192.168.0.127:4299',
  'http://localhost:4299',
  'https://restaurant-ang.vercel.app/'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use('/api', appRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/get', (req, res) => {
    res.json({status:true,host:HOST,msg:'Hello World'});
});
console.log(HOST)
// Create server
const appServer = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(appServer, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New WebSocket client connected');
  socket.on('orderData', (data) => {
    io.emit('orderData', JSON.stringify(data));
  });
});

// Start server
const PORT = process.env.PORT || 3099;
appServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

