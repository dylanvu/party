'use strict';

const fs = require('fs');
const path = require('path');
const guestsPath = path.join(__dirname, 'guests.json');

const express = require('express');
const app = express();

app.disable('x-powered-by');

app.get('/guests', (req, res) => {
  fs.readFile(guestsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);

      return;
    }

    const guests = JSON.parse(data);

    res.send(guests);
  });
});

app.get('/guests/:id', (req, res) => {
  fs.readFile(guestsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);

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

app.use((req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
