require('dotenv').config();

module.exports = {
  // GitHub org to monitor
  ORG: process.env.GITHUB_ORG || 'TOAST-DOCS',

  // GitHub personal access token (optional for public repos, recommended for rate limits)
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',

  // Branch to track
  TARGET_BRANCH: 'master',

  // Directory to track within repos
  TARGET_DIR: 'ko',

  // State file path (overridable so CI can point it at a separate branch's worktree)
  STATE_FILE: process.env.STATE_FILE || './data/state.json',

  // Poll results file path (overridable, see STATE_FILE)
  RESULTS_FILE: process.env.RESULTS_FILE || './data/results.json',

  // Generated static site output (overridable, see STATE_FILE)
  SITE_FILE: process.env.SITE_FILE || './docs/index.html',

  // GitHub API base URL
  GITHUB_API: 'https://api.github.com',
};
