const config = require('./config');

function headers() {
  const h = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'practical-guides-dashboard',
  };
  if (config.GHE_TOKEN) {
    h.Authorization = `Bearer ${config.GHE_TOKEN}`;
  }
  return h;
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`GHE API error: ${res.status} ${res.statusText} - ${url}`);
  }
  return res.json();
}

/**
 * Discover all repos in the GHE org.
 * Paginate through all pages.
 */
async function discoverRepos() {
  const repos = [];
  let page = 1;
  while (true) {
    const url = `${config.GHE_API}/orgs/${config.GHE_ORG}/repos?per_page=100&page=${page}`;
    const batch = await fetchJSON(url);
    if (batch.length === 0) break;
    repos.push(...batch);
    page++;
  }
  return repos;
}

/**
 * Check if a repo has the target branch.
 * Returns the branch info or null.
 */
async function getBranch(repoName) {
  const url = `${config.GHE_API}/repos/${config.GHE_ORG}/${repoName}/branches/${config.GHE_TARGET_BRANCH}`;
  try {
    return await fetchJSON(url);
  } catch {
    return null;
  }
}

/**
 * Check if a repo has the target directory (ko/) on the target branch.
 * Returns true/false.
 */
async function hasTargetDir(repoName) {
  const url = `${config.GHE_API}/repos/${config.GHE_ORG}/${repoName}/contents/${config.GHE_TARGET_DIR}?ref=${config.GHE_TARGET_BRANCH}`;
  try {
    await fetchJSON(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get list of changed files between two SHAs, filtered to ko/*.md
 */
async function getChangedFiles(repoName, baseSha, headSha) {
  const url = `${config.GHE_API}/repos/${config.GHE_ORG}/${repoName}/compare/${baseSha}...${headSha}`;
  const data = await fetchJSON(url);
  const mdFiles = (data.files || []).filter(
    (f) => f.filename.startsWith(`${config.GHE_TARGET_DIR}/`) && f.filename.endsWith('.md')
  );
  return {
    totalChanges: data.files ? data.files.length : 0,
    mdChanges: mdFiles.length,
    files: mdFiles.map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
    })),
    compareUrl: `${config.GHE_API.replace('/api/v3', '')}/${config.GHE_ORG}/${repoName}/compare/${baseSha}...${headSha}`,
    aheadBy: data.ahead_by || 0,
  };
}

module.exports = {
  discoverRepos,
  getBranch,
  hasTargetDir,
  getChangedFiles,
};
