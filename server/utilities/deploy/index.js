import { spawn } from 'child_process';
import { extend, findIndex } from 'lodash';
import connect from 'connect';
import proxy from 'http-proxy-middleware';
import vhost from 'vhost';
import portfinder from 'portfinder';
import { createWriteStream, mkdir, stat } from 'fs';
import path from 'path';

import Timestamp from './timestamp.js';
import sudo from '../sudo';

export function addHost({ host }) {
  return new Promise((resolve) => {
    sudo({
      module: 'hostile',
      method: 'set',
      params: ['127.0.0.1', host],
    }, () => {
      resolve();
    });
  });
}

export function removeHost({ host }) {
  return new Promise((resolve) => {
    sudo({
      module: 'hostile',
      method: 'remove',
      params: ['127.0.0.1', host],
    }, () => {
      resolve();
    });
  });
}

export function startProxy({ port }) {
  const proxyApp = connect().use(proxy({
    target: `http://localhost:${port}`,
    ws: true,
    xfwd: true,
    changeOrigin: true,
    logLevel: 'silent',
  }));

  return { proxyApp };
}

export function removeMiddleware(mainProxy, handle) {
  const index = findIndex(mainProxy.stack, (s) => (s.handle === handle));
  if (index >= 0) mainProxy.stack.splice(index, 1);
}

export function verifyApp({ directory }) {
  return new Promise((resolve, reject) => {
    const meteorPath = path.join(directory, '.meteor');
    stat(meteorPath, (error, stats) => {
      if ((error && error.code === 'ENOENT') || !stats.isDirectory()) {
        reject({ message: 'Not a meteor app' });
      } else if (error) {
        reject({ message: error.toString() });
      } else {
        resolve();
      }
    });
  });
}

export function startApp({ host, domain, directory, production, settings }, appDataPath) {
  return new Promise((resolve, reject) => {
    portfinder.getPort((error, port) => {
      if (error) reject(error);

      const args = ['run', '--port', port, '--raw-logs'];
      if (production) args.push('--production');
      if (settings) args.push('--settings', settings);

      const meteor = spawn('meteor', args, {
        cwd: directory,
        env: extend({ ROOT_URL: `http://${host}` }, process.env),
      });

      mkdir(path.join(appDataPath, 'logs'), () => {});

      const outlog = createWriteStream(path.join(appDataPath, 'logs', `${domain}.out.log`), {
        flags: 'a',
      });
      const errlog = createWriteStream(path.join(appDataPath, 'logs', `${domain}.err.log`), {
        flags: 'a',
      });
      meteor.stdout
        .pipe(new Timestamp())
        .pipe(outlog);
      meteor.stderr
        .pipe(new Timestamp())
        .pipe(errlog);

      resolve({
        port,
        meteor,
      });
    });
  });
}

export function killApp({ active, meteor }) {
  return new Promise((resolve) => {
    if (active && meteor && !meteor.exitCode) {
      meteor.on('close', (code, signal) => {
        resolve(signal);
      });
      meteor.kill('SIGTERM');
    } else {
      resolve('SIGTERM');
    }
  });
}

export function deployApp({ app, settings, mainProxy, appDataPath }) {
  const newApp = app;
  let promise;

  newApp.host = `${newApp.domain}.${settings.tld}`;

  if (newApp && newApp.active) {
    promise = verifyApp(app)
    .then(() => (startApp(app, appDataPath)))
    .then(({ port, meteor }) => {
      newApp.port = port;
      newApp.meteor = meteor;

      return startProxy(newApp);
    })
    .then(({ proxyApp }) => {
      newApp.proxyApp = proxyApp;
      newApp.vhost = vhost(newApp.host, newApp.proxyApp);
      mainProxy.use(newApp.vhost);

      return addHost(newApp);
    })
    .then(() => (newApp));
  } else {
    promise = addHost(newApp)
    .then(() => (newApp));
  }

  return promise;
}


export function undeployApp({ app, mainProxy }) {
  let promise = Promise.resolve();

  if (app) {
    removeMiddleware(mainProxy, app.vhost);
    promise = removeHost(app)
    .then(() => (killApp(app)));
  }

  return promise;
}
