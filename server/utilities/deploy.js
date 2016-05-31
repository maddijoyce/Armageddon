import { spawn } from 'child_process';
import { extend, findIndex } from 'underscore';
import connect from 'connect';
import proxy from 'http-proxy-middleware';
import vhost from 'vhost';
import portfinder from 'portfinder';
import sudo from './sudo.js';

export function startApp({ domain, directory }, { tld }) {
  return new Promise((resolve, reject) => {
    portfinder.getPort((error, port) => {
      if (error) reject(error);

      const meteor = spawn('meteor', ['run', '--port', port], {
        cwd: directory,
        env: extend({ ROOT_URL: `http://${domain}.${tld}` }, process.env),
      });
      meteor.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      meteor.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      resolve({
        port,
        meteor,
      });
    });
  });
}

export function startProxy({ port }) {
  const proxyApp = connect().use(proxy({
    target: `http://localhost:${port}`,
    ws: true,
    xfwd: true,
    changeOrigin: true,
  }));

  return { proxyApp };
}

export function removeMiddleware(mainProxy, handle) {
  const index = findIndex(mainProxy.stack, (s) => (s.handle === handle));
  if (index >= 0) mainProxy.stack.splice(index, 1);
}

export function killApp({ meteor }) {
  return new Promise((resolve) => {
    meteor.on('close', (code, signal) => {
      resolve(signal);
    });
    meteor.kill('SIGTERM');
  });
}

export function removeHost({ domain }, { tld }) {
  return new Promise((resolve, reject) => {
    sudo({
      module: 'hostile',
      method: 'remove',
      params: ['127.0.0.1', `${domain}.${tld}`],
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function addHost({ domain }, { tld }) {
  return new Promise((resolve, reject) => {
    sudo({
      module: 'hostile',
      method: 'set',
      params: ['127.0.0.1', `${domain}.${tld}`],
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function undeployApp(app, settings, mainProxy) {
  let promise = Promise.resolve();
  if (app) {
    removeMiddleware(mainProxy, app.vhost);
    promise = killApp(app, settings).then(() => (removeHost(app, settings)));
  }

  return promise;
}

export function deployApp(app, settings) {
  const newApp = app;

  return startApp(app, settings).then(({ port, meteor }) => {
    newApp.port = port;
    newApp.meteor = meteor;

    return startProxy(newApp);
  })
  .then(({ proxyApp }) => {
    newApp.proxyApp = proxyApp;
    newApp.vhost = vhost(`${newApp.domain}.${settings.tld}`, newApp.proxyApp);

    return addHost(newApp, settings);
  })
  .then(() => (newApp))
  .catch((error) => {
    console.error(`Error deploying ${app.domain}`, error);
  });
}
