const fs = require('fs');
const path = require('path');

const notesDir = path.join(__dirname, '../notes');

function getNoteFilePath(filename) {
  return path.join(notesDir, filename);
}

function ensureNotesDir() {
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir);
  }
}

module.exports = { getNoteFilePath, ensureNotesDir };