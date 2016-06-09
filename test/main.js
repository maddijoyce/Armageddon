import { app, BrowserWindow, ipcMain } from 'electron'; // eslint-disable-line import/no-unresolved
import IpcStream from 'electron-ipc-stream';
import { filter, each, pick, concat } from 'lodash';
import glob from 'glob';
import path from 'path';
import test from 'tape-catch';
import streamFilter from 'stream-filter';
import resumer from 'resumer';
import { Collector, Report } from 'babel-istanbul';
import { hookLoader } from './hookLoader.js';

const testStream = resumer();
testStream.pipe(process.stdout);
hookLoader(process.cwd());

testStream.queue('TAP Version 13\n');
let renderer;

const progress = {
  renderer: false,
  main: false,
};
const coverageCollector = new Collector();
const testsCollector = {
  count: 0,
  fail: 0,
  pass: 0,
  tests: [],
};

function finished(name, { results, coverage }) {
  coverageCollector.add(coverage);
  each(['fail', 'pass'], (key) => {
    testsCollector[key] += results[key];
  });
  testsCollector.count = results.count;
  testsCollector.tests = concat(testsCollector.tests, results.tests);
  progress[name] = true;

  if (!filter(progress, (v) => (!v)).length) {
    if (process.env.COVERAGE) {
      const report = Report.create('lcovonly', {
        dir: path.join(process.cwd(), 'test'),
      });
      report.writeReport(coverageCollector);
    }

    testStream.queue(`\n1..${testsCollector.count}\n`);
    testStream.queue(`# tests ${testsCollector.count}\n`);
    testStream.queue(`# pass ${testsCollector.pass}\n`);
    if (testsCollector.fail) {
      testStream.queue(`# fail ${testsCollector.fail}\n`);
    } else {
      testStream.queue('\n# ok\n');
    }
    app.exit(testsCollector.fail ? 1 : 0);
  }
}

function testFilter(data) {
  return !(
    data.match(/^TAP version/) ||
    data.match(/^\n1\.\./) ||
    data.match(/^\n?# (tests|pass|fail|ok)/)
  );
}

// Main Tests
function mainTests() {
  glob('server/**/test.js', (error, files) => {
    const testHarness = test.createHarness();
    testHarness._results.count = testsCollector.count; // eslint-disable-line no-underscore-dangle
    testHarness.createStream().pipe(streamFilter(testFilter)).pipe(process.stdout);
    if (error) throw error;
    each(files, (file) => {
      const filePath = path.resolve(process.cwd(), file);
      const fileTest = require(filePath).default; // eslint-disable-line global-require
      fileTest(testHarness);
    });
    testHarness.onFinish(() => {
      const results = pick(testHarness._results, [ // eslint-disable-line no-underscore-dangle
        'count',
        'pass',
        'fail',
      ]);
      const coverage = global.coverage;
      finished('main', { results, coverage });
    });
  });
}

// Renderer Tests
app.on('ready', () => {
  renderer = new BrowserWindow({ width: 600, height: 600 });
  renderer.hide();
  renderer.webContents.openDevTools();
  renderer.loadURL(`file://${__dirname}/renderer.html`);
  renderer.on('closed', () => {
    renderer = null;
  });

  const rendererStream = new IpcStream('tests:out');
  rendererStream.pipe(streamFilter(testFilter)).pipe(process.stdout);
  ipcMain.on('tests:end', (event, tests) => {
    finished('renderer', tests);
    mainTests();
  });
  glob('client/**/test.jsx', (error, files) => {
    if (error) throw error;
    renderer.webContents.on('dom-ready', () => {
      renderer.send('tests:start', { files });
    });
  });
});
