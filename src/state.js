const fs = require('fs');
const path = require('path');
const config = require('./config');

const stateFilePath = path.resolve(__dirname, '..', config.STATE_FILE);

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadState() {
  ensureDir(stateFilePath);
  if (!fs.existsSync(stateFilePath)) {
    return { repos: {} };
  }
  return JSON.parse(fs.readFileSync(stateFilePath, 'utf-8'));
}

function saveState(state) {
  ensureDir(stateFilePath);
  fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Generic JSON loader with default value
 */
function loadJSON(relPath, defaultValue) {
  const p = path.resolve(__dirname, '..', relPath);
  ensureDir(p);
  if (!fs.existsSync(p)) return defaultValue;
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

/**
 * Generic JSON saver
 */
function saveJSON(relPath, data) {
  const p = path.resolve(__dirname, '..', relPath);
  ensureDir(p);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { loadState, saveState, loadJSON, saveJSON };
