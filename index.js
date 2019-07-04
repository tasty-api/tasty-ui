#!/usr/bin/env

const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const cors = require('cors');

const restServer = require('./server');

const restServerPort = 3001; // @todo move to nconf
const staticServerPort = 8080; // @todo move to nconf

const staticServer = express();
restServer.use(cors());
restServer.listen(restServerPort, () => console.log(`Rest server listening on port ${restServerPort}!`));


staticServer.use(express.static(path.join(__dirname, 'build')));

staticServer.use('/api/v1', proxy(`http://localhost:${restServerPort}`));

staticServer.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'build', 'index.html')));

staticServer.listen(staticServerPort, () => console.log(`Static server listening on port ${staticServerPort}!`));
