const nconf = require('nconf');
const path = require('path');

nconf.argv()
  .env()
  .file('tasty-ui', { file: path.join(process.cwd(), 'config.json') });

module.exports = nconf;
