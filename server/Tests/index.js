const path = require('path');
const recursiveReaddir = require('recursive-readdir');
const config = require('../../config');

const DEFAULT_TESTS_DIR = path.resolve(process.cwd(), 'test');

class Tests {
  find(filters) {
    return getTests(filters);
  }
}

module.exports = new Tests();

async function getTests(filters = {}) {
  const { type = 'func' } = filters;
  const dir = config.get('tests_dir')[type] || path.resolve(DEFAULT_TESTS_DIR, type);
  const tests = await recursiveReaddir(dir);

  return tests.map((test) => {
    return {
      id: test,
      name: path.basename(test, '.js'),
      path: path.dirname(test),
    };
  });
}
