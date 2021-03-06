'use strict';

const fs = require('fs');
const path = require('path');
const guestsPath = path.join(__dirname, 'guests.json');

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

app.use(morgan('dev'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Read all
app.get('/guests', (req, res, next) => {
  fs.readFile(guestsPath, 'utf8', (err, data) => {
    if (err) {
      next(err);
      return;
    }

    const guests = JSON.parse(data);

    res.send(guests);
  });
});

// Read one
app.get('/guests/:id', (req, res, err) => {
  fs.readFile(guestsPath, 'utf8', (err, data) => {
    if (err) {
      next(err);
      return;
    }

    const guests = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id) || id < 0 || id >= guests.length) {
      res.sendStatus(404);

      return;
    }

    res.set('Content-Type', 'text/plain');
    res.send(guests[id]);
  });
});

// Create
app.post('/guests', (req, res, err) => {
  fs.readFile(guestsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      nest(readErr);
      return;
    }

    const guests = JSON.parse(data);
    const guest = req.body.name;

    if (!guests) {
      res.sendStatus(400);
    }

    guests.push(guest);

    const guestJSON = JSON.stringify(guests);

    fs.writeFile(guestsPath, guestJSON, (writeErr) => {
      if (writeErr) {
        next(writeErr);
        return;
      }

      res.set('Content-Type', 'text/plain');
      res.send(guest);
    });
  });
});

// Update
app.patch('/guests/:id', (req, res, next) => {
  fs.readFile(guestsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      nest(readErr);
      return;
    }

    const guests = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id) || id < 0 || id >= guests.length) {
      res.sendStatus(404);

      return;
    }

    const guest = req.body.name;

    if (!guests) {
      res.sendStatus(400);
    }

    guests[id] = guest;

    const guestJSON = JSON.stringify(guests);

    fs.writeFile(guestsPath, guestJSON, (writeErr) => {
      if (writeErr) {
        next(writeErr);
        return;
      }

      res.set('Content-Type', 'text/plain');
      res.send(guest);
    });
  });
});

// Delete
app.delete('/guests/:id', (req, res, next) => {
  fs.readFile(guestsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      nest(readErr);
      return;
    }

    const guests = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id) || id < 0 || id >= guests.length) {
      res.sendStatus(404);

      return;
    }

    const guest = guests.splice(id, 1)[0];

    const guestJSON = JSON.stringify(guests);

    fs.writeFile(guestsPath, guestJSON, (writeErr) => {
      if (writeErr) {
        next(writeErr);
        return;
      }

      res.set('Content-Type', 'text/plain');
      res.send(guest);
    });
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
