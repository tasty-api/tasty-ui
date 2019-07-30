#!/usr/bin/env node

const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const restServer = require('./server');

const restServerPort = 3000; // @todo move to nconf
const staticServerPort = 9090; // @todo move to nconf

const staticServer = express();

restServer.listen(restServerPort, () => console.log(`Rest server listening on port ${restServerPort}!`));

staticServer.use(express.static(path.join(__dirname, 'build')));
staticServer.use('/report', express.static(path.join(process.cwd(), 'reports')));

staticServer.use('/api', proxy({ target: `http://localhost:${restServerPort}` }));

staticServer.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'build', 'index.html')));

staticServer.listen(staticServerPort, () => console.log(`Static server listening on port ${staticServerPort}!`));
