require('dotenv').config();

module.exports = {
  // === GHE (cloud-docs) settings ===
  GHE_API: process.env.GHE_API || 'https://github.nhnent.com/api/v3',
  GHE_ORG: process.env.GHE_ORG || 'cloud-docs',
  GHE_TOKEN: process.env.GHE_TOKEN || '',
  GHE_TARGET_BRANCH: 'master',
  GHE_TARGET_DIR: 'ko',

  // === Dooray settings ===
  DOORAY_API: 'https://api.dooray.com',
  DOORAY_API_TOKEN: process.env.DOORAY_API_TOKEN || '',
  DOORAY_WEBHOOK_URL: process.env.DOORAY_WEBHOOK_URL || '',
  // 실전 가이드 프로젝트
  DOORAY_PROJECT_ID: process.env.DOORAY_PROJECT_ID || '4357590846340253288',
  // NHN Cloud 주요 배포 사항 프로젝트/태스크
  DOORAY_DEPLOY_PROJECT_ID: process.env.DOORAY_DEPLOY_PROJECT_ID || '2058408404193881826',
  DOORAY_DEPLOY_PARENT_TASK_ID: process.env.DOORAY_DEPLOY_PARENT_TASK_ID || '4254576973479504167',

  // === Output paths ===
  STATE_FILE: process.env.STATE_FILE || './data/state.json',
  RESULTS_FILE: process.env.RESULTS_FILE || './data/ghe-updates.json',
  DOORAY_TASKS_FILE: process.env.DOORAY_TASKS_FILE || './data/dooray-tasks.json',

  DEPLOY_NOTES_FILE: process.env.DEPLOY_NOTES_FILE || './data/deploy-notes.json',
  RESOLVED_FILE: process.env.RESOLVED_FILE || './data/resolved.json',
  GUIDE_MAPPING_FILE: process.env.GUIDE_MAPPING_FILE || './data/guide-mapping.json',
  SITE_FILE: process.env.SITE_FILE || './docs/index.html',

  // === Dashboard URL ===
  DASHBOARD_URL: 'https://toast-docs.github.io/TW/',
};
