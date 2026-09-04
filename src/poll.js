const { discoverRepos, getBranch, hasTargetDir, getChangedFiles } = require('./github');
const { loadState, saveState, loadResults, saveResults } = require('./state');
const { generateSite } = require('./generate-site');
const config = require('./config');

async function runPoll() {
  console.log(`[${new Date().toISOString()}] Polling started for org: ${config.ORG}`);

  const state = loadState();
  const changes = [];
  const discoveredRepos = [];

  // 1. Discover all repos in org
  const allRepos = await discoverRepos();
  console.log(`  Found ${allRepos.length} repos in ${config.ORG}`);

  for (const repo of allRepos) {
    const repoName = repo.name;

    // 2. Check if repo has the target branch (master)
    const branch = await getBranch(repoName);
    if (!branch) continue;

    // 3. Check if repo has ko/ directory
    const hasKo = await hasTargetDir(repoName);
    if (!hasKo) continue;

    discoveredRepos.push(repoName);
    const currentSha = branch.commit.sha;

    // 4. Compare with last known SHA
    const repoState = state.repos[repoName];

    if (!repoState) {
      // New repo: start tracking from current SHA, no backfill
      console.log(`  [NEW] ${repoName} - tracking from ${currentSha.substring(0, 7)}`);
      state.repos[repoName] = {
        lastSha: currentSha,
        lastChecked: new Date().toISOString(),
        firstSeen: new Date().toISOString(),
      };
      continue;
    }

    if (repoState.lastSha === currentSha) {
      // No changes
      continue;
    }

    // 5. Get changed files
    console.log(`  [CHANGED] ${repoName}: ${repoState.lastSha.substring(0, 7)} -> ${currentSha.substring(0, 7)}`);
    try {
      const diff = await getChangedFiles(repoName, repoState.lastSha, currentSha);

      if (diff.mdChanges > 0) {
        changes.push({
          repo: repoName,
          previousSha: repoState.lastSha,
          currentSha,
          compareUrl: diff.compareUrl,
          mdChanges: diff.mdChanges,
          files: diff.files,
          detectedAt: new Date().toISOString(),
          checkedBy: [],
        });
      }
    } catch (err) {
      console.error(`  [ERROR] ${repoName}: ${err.message}`);
    }

    // 6. Update state
    state.repos[repoName] = {
      ...repoState,
      lastSha: currentSha,
      lastChecked: new Date().toISOString(),
    };
  }

  // Save state
  saveState(state);

  // Save results (append to history)
  const results = loadResults();
  const pollResult = {
    lastPoll: new Date().toISOString(),
    heartbeat: {
      timestamp: new Date().toISOString(),
      trackedRepos: discoveredRepos.length,
      repoNames: discoveredRepos,
    },
    changes,
  };

  results.lastPoll = pollResult.lastPoll;
  results.heartbeat = pollResult.heartbeat;

  // Prepend new changes to list (newest first)
  if (changes.length > 0) {
    results.history = [
      { pollDate: pollResult.lastPoll, changes },
      ...(results.history || []),
    ];
  }
  // Keep current batch changes accessible directly
  results.changes = changes;

  saveResults(results);

  const sitePath = generateSite(results);
  console.log(`  Site generated: ${sitePath}`);

  console.log(`[${new Date().toISOString()}] Poll complete. ${changes.length} repos with md changes detected.`);
  return pollResult;
}

// Run if called directly
if (require.main === module) {
  runPoll().catch(console.error);
}

module.exports = { runPoll };
