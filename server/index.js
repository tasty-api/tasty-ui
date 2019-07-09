const express = require('express');
const app = express();

const path = require('path');
const Processor = require('./process');
const TestsRouter = new Processor(path.resolve(path.join(process.cwd(),'myTestsStub')));

app.use(express.json());

app.use('/tests', require('./routes/tests')(TestsRouter));

app.get('/reports', (req, res) => res.send('@TODO Get reports by type'));

app.post('/test', (req, res) => res.send('@TODO Run tests by type'));

module.exports = app;
