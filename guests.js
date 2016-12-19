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
else {
  console.error(`Usage: ${node} ${file} read`);
  process.exit(1);
}
