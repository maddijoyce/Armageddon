import { spawn } from 'child_process';
import { extend, findIndex } from 'lodash';
import connect from 'connect';
import proxy from 'http-proxy-middleware';
import vhost from 'vhost';
import portfinder from 'portfinder';
import sudo from './sudo.js';

function startApp({ host, directory }) {
  return new Promise((resolve, reject) => {
    portfinder.getPort((error, port) => {
      if (error) reject(error);

      const meteor = spawn('meteor', ['run', '--port', port], {
        cwd: directory,
        env: extend({ ROOT_URL: `http://${host}` }, process.env),
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

function startProxy({ port }) {
  const proxyApp = connect().use(proxy({
    target: `http://localhost:${port}`,
    ws: true,
    xfwd: true,
    changeOrigin: true,
  }));

  return { proxyApp };
}

function killApp({ active, meteor }) {
  return new Promise((resolve) => {
    if (active && meteor) {
      meteor.on('close', (code, signal) => {
        resolve(signal);
      });
      meteor.kill('SIGTERM');
    } else {
      resolve();
    }
  });
}

function removeHost({ host }) {
  return new Promise((resolve, reject) => {
    sudo({
      module: 'hostile',
      method: 'remove',
      params: ['127.0.0.1', host],
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function addHost({ host }) {
  return new Promise((resolve, reject) => {
    sudo({
      module: 'hostile',
      method: 'set',
      params: ['127.0.0.1', host],
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function removeMiddleware(mainProxy, handle) {
  const index = findIndex(mainProxy.stack, (s) => (s.handle === handle));
  if (index >= 0) mainProxy.stack.splice(index, 1);
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

export function deployApp({ app, settings, mainProxy }) {
  const newApp = app;
  let promise;

  newApp.host = `${newApp.domain}.${settings.tld}`;

  if (newApp && newApp.active) {
    promise = startApp(app).then(({ port, meteor }) => {
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
