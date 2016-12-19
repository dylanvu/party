'use strict';

// Import http module
const http = require('http');

// Create server
// for every request, the callback is invoked. req will contain the incoming
// HTTP request object. res will contain an empty outgoing HTTP response object
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/guests') {
    const guests = ['Roshella', 'Dylan'];
    const guestsJSON = JSON.stringify(guests);

    res.setHeader('Content-Type', 'application/json');
    res.end(guestsJSON);
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
