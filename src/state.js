const fs = require('fs');
const path = require('path');
const config = require('./config');

const stateFilePath = path.resolve(__dirname, '..', config.STATE_FILE);
const resultsFilePath = path.resolve(__dirname, '..', config.RESULTS_FILE);

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

function loadResults() {
  ensureDir(resultsFilePath);
  if (!fs.existsSync(resultsFilePath)) {
    return { lastPoll: null, heartbeat: null, changes: [], history: [] };
  }
  return JSON.parse(fs.readFileSync(resultsFilePath, 'utf-8'));
}

function saveResults(results) {
  ensureDir(resultsFilePath);
  fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2), 'utf-8');
}

module.exports = { loadState, saveState, loadResults, saveResults };
