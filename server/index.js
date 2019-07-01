const express = require('express');
const app = express();

app.get('/tests', (req, res) => res.send('@TODO Get tests by type'));

app.get('/reports', (req, res) => res.send('@TODO Get reports by type'));

app.post('/test', (req, res) => res.send('@TODO Run tests by type'));

module.exports = app;
