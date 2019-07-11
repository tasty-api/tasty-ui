const express = require('express');
const app = express();
const Reports = require('./Reports');

// @todo use api prefix in urls
app.get('/tests', (req, res) => res.send('@TODO Get tests by type'));

app.get('/reports', async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const reports = await Reports.find(filters);

  res.json(reports);
});

app.get('/reports/:id', async (req, res) => {
  const id = +req.params.id;
  const report = await Reports.findOne(id);

  res.json(report);
});

app.post('/test', (req, res) => res.send('@TODO Run tests by type'));

module.exports = app;
