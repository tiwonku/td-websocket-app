const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const express = require('express');

/*
 * A lightweight WebSocket relay server and static web host for TouchDesigner projects.
 *
 * This server does two things:
 * 1. Serves the files inside the `public` directory so you can access the
 *    control interface in your browser at http://localhost:PORT.
 * 2. Accepts WebSocket connections on the same port.  When a message
 *    arrives from one client it is broadcast to all connected clients.
 *    This allows TouchDesigner and your browser UI to talk to each other.
 */

const PORT = process.env.PORT || 3000;

// Use Express to serve static files from the public directory
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

// WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Keep a list of all connected WebSocket clients
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`WebSocket client connected (total: ${clients.size})`);
  ws.send(JSON.stringify({ type: 'status', message: 'connected' }));

  if (wss.clients.size === 1) {
    console.log("first connection. starting keepalive");
    keepServerAlive();
  }

  ws.on('message', (data) => {
    // Broadcast to all connected clients except the sender
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`WebSocket client disconnected (total: ${clients.size})`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// Implement broadcast function because of ws doesn't have it
const broadcast = (ws, message, includeSelf) => {
  if (includeSelf) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } else {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
};

/**
 * Sends a ping message to all connected clients every 50 seconds
 */
const keepServerAlive = () => {
  keepAliveId = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('ping');
      }
    });
  }, 50000);
};