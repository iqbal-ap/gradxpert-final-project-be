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
          branches: 90,
          functions: 90,
          statements: 90,
          lines: 90,
      },
  },
};

module.exports = config;