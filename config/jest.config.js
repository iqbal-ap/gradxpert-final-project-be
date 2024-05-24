/** @type {import('jest').Config} */
const config = {
  rootDir: '../tests',
  verbose: true,
  ci: true,
  collectCoverage: true,
  coverageReporters: ['json-summary', 'text'],
  coverageDirectory: './',
  coverageThreshold: {
      global: {
          statements: 90,
      },
  },
};

module.exports = config;