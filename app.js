const express = require('express');
const bodyParser = require('body-parser');
const { Root, ApiV1 } = require('./routes/index');

const app = express();
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlEncodedParser);

app.use('/', Root);
app.use('/api/v1', ApiV1);

module.exports = app;