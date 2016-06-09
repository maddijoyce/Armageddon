import { hook, Instrumenter } from 'babel-istanbul';
import { clone } from 'lodash';

let instrumenter = null;
const baselineCoverage = {};

export function getCoverageObject() {
  global.coverage = global.coverage || {};
  return global.coverage;
}

export function getRootMatcher(root) {
  return function rootMatcher(path) {
    if (path.indexOf(root) !== 0) { return false; }
    const file = path.substring(root.length);
    if (file.indexOf('test') >= 0) { return false; }
    if (file.indexOf('node_modules') >= 0) { return false; }
    return true;
  };
}

export function saveBaseline(file) {
  const coverageObject = getCoverageObject();
  if (coverageObject && coverageObject[file]) {
    const fileCoverage = coverageObject[file];
    if (!baselineCoverage[file]) {
      baselineCoverage[file] = {
        s: clone(fileCoverage.s),
        f: clone(fileCoverage.f),
        b: clone(fileCoverage.b),
      };
    }
  }
}

export function restoreBaseline() {
  const coverageObject = getCoverageObject();
  let fileCoverage;
  let fileBaseline;
  Object.keys(baselineCoverage).forEach((file) => {
    fileBaseline = baselineCoverage[file];
    if (coverageObject[file]) {
      fileCoverage = coverageObject[file];
      fileCoverage.s = clone(fileBaseline.s);
      fileCoverage.f = clone(fileBaseline.f);
      fileCoverage.b = clone(fileBaseline.b);
    }
  });
  Object.keys(coverageObject).forEach((file) => {
    if (!baselineCoverage[file]) {
      delete coverageObject[file];
    }
  });
}

export function hookLoader(matcherOrRoot, customOpts) {
  let matcherFn;
  let postLoadHook;

  const opts = customOpts || {};
  opts.coverageVariable = 'coverage';

  postLoadHook = opts.postLoadHook;
  if (!(postLoadHook && typeof postLoadHook === 'function')) {
    postLoadHook = (/* matcher, transformer, verbose */) => ((/* file */) => {});
  }
  delete opts.postLoadHook;

  if (typeof matcherOrRoot === 'function') {
    matcherFn = matcherOrRoot;
  } else if (typeof matcherOrRoot === 'string') {
    matcherFn = getRootMatcher(matcherOrRoot);
  } else {
    throw new Error('Argument was not a function or string');
  }

  if (instrumenter) { return; }
  instrumenter = new Instrumenter(opts);
  const transformer = instrumenter.instrumentSync.bind(instrumenter);
  const postLoadHookFn = postLoadHook(matcherFn, transformer, opts.verbose);

  hook.hookRequire(matcherFn, transformer, {
    extensions: opts.extensions,
    verbose: opts.verbose,
    postLoadHook(file) {
      postLoadHookFn(file);
      saveBaseline(file);
    },
  });
}
