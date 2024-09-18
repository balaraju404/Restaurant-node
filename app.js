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
const http = require('http');  // Add http to support WebSocket server
const WebSocket = require('ws');
const appRouter = require('./app/routes/index');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', appRouter);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Received message from client:', message);

    // Example of broadcasting a properly formatted JSON message
    const broadcastMessage = JSON.stringify({
      type: 'NEW_ORDER',
      data: message
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(broadcastMessage);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const PORT = process.env.PORT || 3099;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
