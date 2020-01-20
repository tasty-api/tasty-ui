#!/usr/bin/env node

const program = require('commander');
const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const pkg = require('./package.json');

const restServer = require('./server');

program
  .version(pkg.version)
  .option('-p, --protocol [protocol]', 'specify a protocol', 'http')
  .option('-h, --host [host]', 'specify a host', '127.0.0.1')
  .option('-b, --base_path [base path]', 'specify a base path', '/')
  .option('-r, --rest_port [rest port]', 'specify a rest port', 3000)
  .option('-s, --static_port [static port]', 'specify a static port', 9090)
  .parse(process.argv);

const { protocol, host, base_path, rest_port, static_port } = program;

const staticServer = express();

restServer.listen(rest_port, () => console.log(`Rest server listening on port ${rest_port}!`));

staticServer.use(express.static(path.join(__dirname, 'build')));
staticServer.use('/report', express.static(path.join(process.cwd(), 'reports')));

staticServer.use('/api', proxy({ target: `${protocol}://${host}:${rest_port}${base_path}` }));
staticServer.use('/socket.io', proxy({ target: `${protocol}://${host}:${rest_port}${base_path}`, ws: true }));

staticServer.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'build', 'index.html')));

staticServer.listen(static_port, () => console.log(`Static server listening on port ${static_port}!`));
