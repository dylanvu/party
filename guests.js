'use strict';

// Import built-in modules
const fs = require('fs');
const path = require('path');
// assign guests.json file path
const guestsPath = path.join(__dirname, 'guests.json');

// assign cl args
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(guestsPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const guests = JSON.parse(data);

    console.log(guests);
  });
}
else if (cmd === 'create') {
  fs.readFile(guestsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }

    const guests = JSON.parse(data);
    const guest = process.argv[3];

    if (!guest) {
      console.error(`Usage: ${node} ${file} ${cmd} GUEST`);
      process.exit(1);
    }

    guests.push(guest);

    const guestsJSON = JSON.stringify(guests);

    fs.writeFile(guestsPath, guestsJSON, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      console.log(guest);
    });
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create]`);
  process.exit(1);
}
