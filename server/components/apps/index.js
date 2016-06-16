import path from 'path';
import uuid from 'node-uuid';
import connect from 'connect';
import portfinder from 'portfinder';
import sudo from 'sudo-prompt';
import serveStatic from 'serve-static';
import { map, fromPairs } from 'lodash';

import {
  readJSONFile,
  writeJSONFile,
  sanitizeApps,
  deployApp,
  undeployApp,
  removeMiddleware,
} from '../../utilities';

export const fallbackStatic = serveStatic(`${process.cwd()}/server/root`);

export const defaultApps = {};

export default function ({ server, appDataPath }) {
  const appsFile = path.join(appDataPath, 'apps.json');
  let apps;
  const mainProxy = connect();
  mainProxy.use(fallbackStatic);
  portfinder.getPort((error, port) => {
    mainProxy.listen(port);
    sudo.exec(`node ${process.cwd()}/server/root/proxy.js ${port}`, {
      name: 'Armageddon',
      icns: `${process.cwd()}/client/images/Icon.icns`,
    });
  });

  try {
    apps = readJSONFile(appsFile, sanitizeApps);
  } catch (e) {
    apps = defaultApps;
    writeJSONFile(appsFile, apps, sanitizeApps);
  }

  server.on('apps.initialize', ({ body }) => {
    const { settings } = body;

    Promise.all(map(apps, (app) => (undeployApp({ app, settings, mainProxy }))))
    .then(() => (Promise.all(map(apps, (app) => (deployApp({ app, settings, mainProxy }))))))
    .then((newApps) => {
      apps = fromPairs(map(newApps, (a) => {
        mainProxy.use(a.vhost);
        return [a.id, a];
      }));

      removeMiddleware(mainProxy, fallbackStatic);
      mainProxy.use(fallbackStatic);
      server.send('apps.changed', apps);
    });
  });
  server.on('app.update', ({ body }) => {
    const { app, settings } = body;
    delete(app.new);
    app.id = app.id || uuid.v1();

    if (apps[app.id]) {
      apps[app.id].loading = 'Updating...';
      server.send('apps.changed', apps);
    }

    undeployApp({ app: apps[app.id], settings, mainProxy })
    .then(() => (deployApp({ app, settings, mainProxy })))
    .then((newApp) => {
      apps[newApp.id] = newApp;
      writeJSONFile(appsFile, apps, sanitizeApps);

      removeMiddleware(mainProxy, fallbackStatic);
      mainProxy.use(fallbackStatic);

      server.send('apps.changed', apps);
    });
  });
  server.on('app.delete', ({ body }) => {
    const { app, settings } = body;

    apps[app.id].loading = 'Deleting...';
    server.send('apps.changed', apps);

    undeployApp(apps[app.id], settings, mainProxy)
    .then(() => {
      delete(apps[app.id]);
      writeJSONFile(appsFile, apps, sanitizeApps);

      server.send('apps.changed', apps);
    });
  });
}
