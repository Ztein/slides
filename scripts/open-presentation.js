#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

const presentationName = process.argv[2];

if (!presentationName) {
  console.error('Usage: npm run present <presentation-name>');
  console.error('Example: npm run present uppsala_uni_18_nov_2025_improved');
  process.exit(1);
}

const url = `http://localhost:8085/presentations/${presentationName}`;

// Open browser based on OS
const platform = os.platform();
let command;

if (platform === 'darwin') {
  command = `open "${url}"`;
} else if (platform === 'win32') {
  command = `start "${url}"`;
} else {
  command = `xdg-open "${url}"`;
}

exec(command, (error) => {
  if (error) {
    console.error(`Error opening browser: ${error.message}`);
    console.log(`Please open this URL manually: ${url}`);
  } else {
    console.log(`Opening presentation: ${presentationName}`);
    console.log(`URL: ${url}`);
    console.log(`Press 's' in the browser to open presenter mode`);
  }
});

