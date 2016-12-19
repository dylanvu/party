/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const guestsPath = path.join(__dirname, 'guests.json');

const server = http.createServer((req, res) => {
  const guestRegExp = /^\/guests\/(.*)$/;

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
  else if (req.method === 'GET' && guestRegExp.test(req.url)) {
    fs.readFile(guestsPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      const guests = JSON.parse(data);
      const matches = req.url.match(guestRegExp);
      const index = Number.parseInt(matches[1]);

      if (Number.isNaN(index) || index < 0 || index >= guests.length) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      const guestJSON = JSON.stringify(guests[index]);

      res.setHeader('Content-Type', 'application/json');
      res.end(guestJSON);
    });
  }
  else if (req.method === 'POST' && req.url === '/guests') {
    let bodyJSON = '';

    req.on('data', (chunk) => {
      bodyJSON += chunk.toString();
    });

    req.on('end', () => {
      fs.readFile(guestsPath, 'utf8', (readErr, data) => {
        if (readErr) {
          console.error(readErr.stack);

          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal Server Error');

          return;
        }

        const body = JSON.parse(bodyJSON);
        const guest = body.name;

        if (!guest) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Bad Request');

          return;
        }

        const guests = JSON.parse(data);

        guests.push(guest);

        const guestsJSON = JSON.stringify(guests);

        fs.writeFile(guestsPath, guestsJSON, (writeErr) => {
          if (writeErr) {
            console.error(writeErr.stack);

            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error');

            return;
          }

          res.setHeader('Content-Type', 'text/plain');
          res.end(guest);
        });
      });
    });
  }
  // UPDATE
  else if (req.method === 'PUT' && guestRegExp.test(req.url)) {
    let bodyJSON = '';

    req.on('data', (chunk) => {
      bodyJSON += chunk.toString();
    });

    req.on('end', () => {
      fs.readFile(guestsPath, 'utf8', (readErr, data) => {
        if (readErr) {
          console.error(readErr.stack);

          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal Server Error');

          return;
        }

        const guests = JSON.parse(data);
        const matches = req.url.match(guestRegExp);
        const index = Number.parseInt(matches[1]);

        if (Number.isNaN(index) || index < 0 || index >= guests.length) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found');

          return;
        }

        const body = JSON.parse(bodyJSON);
        const guest = body.name;

        if (!guest) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Bad Request');

          return;
        }

        guests[index] = guest;

        const guestsJSON = JSON.stringify(guests);

        fs.writeFile(guestsPath, guestsJSON, (writeErr) => {
          if (writeErr) {
            console.error(writeErr.stack);

            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error');

            return;
          }

          res.setHeader('Content-Type', 'text/plain');
          res.end(guest);
        });
      });
    });
  }
  // DELETE
  else if (req.method === 'DELETE' && guestRegExp.test(req.url)) {
    fs.readFile(guestsPath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error(readErr.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      const guests = JSON.parse(data);
      const matches = req.url.match(guestRegExp);
      const index = Number.parseInt(matches[1]);

      if (Number.isNaN(index) || index < 0 || index >= guests.length) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      const guest = guests.splice(index, 1)[0];
      const guestsJSON = JSON.stringify(guests);

      fs.writeFile(guestsPath, guestsJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }

        res.setHeader('Content-Type', 'plain/text');
        res.end(guest);
      });
    });
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
