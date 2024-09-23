// require('./config');
// require('./constants');
// const express = require('express');
// const cors = require('cors');
// const router = require('./app/index');
// const appRouter = require('./app/routes/index');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // app.use('/', router);
// app.use('/api', appRouter);

// const PORT = process.env.PORT || 3099;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

require('./config');
require('./constants');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const appRouter = require('./app/routes/index');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', appRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const appServer = http.createServer(app);
const io = new Server(appServer, {
  cors: {
    origin: 'http://192.168.0.127:4299',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

io.on('connection', (socket) => {
  console.log('New WebSocket client connected');
  socket.on('orderData', (data) => {
    io.emit('orderData', JSON.stringify(data));
  });
});

const PORT = process.env.PORT || 3099;

appServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

