const http = require('http');

// Add swap http status to http code
const STATUS_TEXT = http.STATUS_CODES;
const STATUS_CODES = Object.fromEntries(Object.entries(STATUS_TEXT).map(([k, v]) => [v.split(/[\s'-]/).join(''), Number(k)]));

module.exports = {
  STATUS_CODES,
  STATUS_TEXT,
};
