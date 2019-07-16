const util = require('util');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

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
  const dir = path.resolve(DEFAULT_REPORTS_DIR, type);
  const reports = fs.existsSync(dir) ? await readdir(dir, { withFileTypes: true }) || [] : [];

  return reports.filter(file => file.isDirectory()).map(file => ({
    id: +file.name,
    title: moment(+file.name).format('DD MMMM YYYY (hh:mm:ss)'),
  })).sort((a, b) => b.id - a.id);
}

async function getReport(id) {
  const funcReportsDir = path.resolve(DEFAULT_REPORTS_DIR, 'func');
  const loadReportsDir = path.resolve(DEFAULT_REPORTS_DIR, 'load');
  const testsDir = fs.existsSync(path.resolve(funcReportsDir, id.toString())) ?
    path.resolve(funcReportsDir, id.toString()) :
    path.resolve(loadReportsDir, id.toString());
  const tests = fs.existsSync(testsDir) ? await readdir(testsDir, { withFileTypes: true }) || [] : [];

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
  const reportsDir = path.resolve(DEFAULT_REPORTS_DIR, type);
  const reportDir = path.resolve(reportsDir, id);
  const reportFile = path.resolve(reportDir, name, 'index.html');

  return fs.existsSync(reportFile) ? fs.readFileSync(reportFile) : '';
}
