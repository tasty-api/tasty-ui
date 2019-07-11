const util = require('util');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const config = require('../../config');

const readdir = util.promisify(fs.readdir);

const DEFAULT_REPORTS_DIR = path.resolve(process.cwd(), 'reports');

class Reports {
  find(filters) {
    return getReports(filters);
  }

  findOne(id) {
    return getReport(id);
  }

  read(filters) {
    return readReport(filters);
  }
}

module.exports = new Reports();

async function getReports(filters = {}) {
  const { type = 'func' } = filters;
  const dir = config.get('reports_dir')[type] || path.resolve(DEFAULT_REPORTS_DIR, type);
  const reports = await readdir(dir, { withFileTypes: true }) || [];

  return reports.filter(file => file.isDirectory()).map(file => ({
    id: +file.name,
    title: moment(+file.name).format('DD MMMM YYYY (hh:mm:ss)'),
  })).sort((a, b) => b.id - a.id);
}

async function getReport(id) {
  const funcReportsDir = config.get('reports_dir:func') || path.resolve(DEFAULT_REPORTS_DIR, 'func');
  const loadReportsDir = config.get('reports_dir:load') || path.resolve(DEFAULT_REPORTS_DIR, 'load');
  const testsDir = fs.existsSync(path.resolve(funcReportsDir, id.toString())) ?
    path.resolve(funcReportsDir, id.toString()) :
    path.resolve(loadReportsDir, id.toString());
  const tests = await readdir(testsDir, { withFileTypes: true }) || [];

  return {
    id,
    title: moment(id).format('DD MMMM YYYY (hh:mm:ss)'),
    tests: tests.filter(file => file.isDirectory()).map(file => ({
      name: file.name,
      stats: require(`${testsDir}/${file.name}/index.json`).stats,
    })),
  };
}

async function readReport(filters = {}) {
  const { type = 'func', id = null, name = null } = filters;
  const reportsDir = config.get('reports_dir')[type] || path.resolve(DEFAULT_REPORTS_DIR, type);
  const reportDir = path.resolve(reportsDir, id);
  return fs.readFileSync(path.resolve(reportDir, name, 'index.html'));
}
