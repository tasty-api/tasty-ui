const express = require('express');
const fs = require('fs');
const app = express();
const server = require('http').Server(app);
const Reports = require('./Reports');
const Tests = require('./Tests');
const path = require('path');
const socket = require('socket.io');
const TastyRunner = require(path.resolve(process.cwd(), 'index.js'));

const io = socket(server);

TastyRunner.logStream.on('data', (data) => {
  const type = TastyRunner.getCurrentType();

  io.emit(`tests:${type}:log`, data.toString());
});

app.use(express.json());

app.get('/api/tests', async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const tests = await Tests.find(filters);

  res.json(tests);
});

app.get('/api/reports', async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const reports = await Reports.find(filters);

  res.json(reports);
});

app.get('/api/reports/:id', async (req, res) => {
  const id = +req.params.id;
  const report = await Reports.findOne(id);

  res.json(report);
});

app.post('/api/test', (req) => {
  const filters = req.body.data;

  io.emit('tests:start');

  TastyRunner.setFilters(filters);

  TastyRunner.run(filters.type)
    .then((stats) => {
      io.emit('tests:end', stats);
    });
});

app.get('/api/status', (req, res) => {
  res.json(TastyRunner.getStatus());
});

app.get('/api/log', (req, res) => {
  const funcLogFile = path.resolve(process.cwd(), 'logs', 'func_log.html');
  const loadLogFile = path.resolve(process.cwd(), 'logs', 'load_log.html');

  res.json({
    func: fs.existsSync(funcLogFile) ? fs.readFileSync(funcLogFile).toString() : '',
    load: fs.existsSync(loadLogFile) ? fs.readFileSync(loadLogFile).toString() : '',
  });
});

module.exports = server;
