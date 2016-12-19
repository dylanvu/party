'use strict';

// Import modules
const fs = require('fs');
const http = require('http');
const path = require('path');

// assign file path
const guestsPath = path.join(__dirname, 'guests.json');

// Create server
// for every request, the callback is invoked. req will contain the incoming
// HTTP request object. res will contain an empty outgoing HTTP response object
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/guests') {
    fs.readFile(guestsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(data);
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
  }
});

const port = 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
