import path from 'path';
import uuid from 'node-uuid';
import connect from 'connect';
import portfinder from 'portfinder';
import sudo from 'sudo-prompt';
import serveStatic from 'serve-static';
import { map, object } from 'underscore';

import {
  readJSONFile,
  writeJSONFile,
  deployApp,
  undeployApp,
  removeMiddleware,
} from '../utilities';

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
    apps = readJSONFile(appsFile);
  } catch (e) {
    apps = defaultApps;
    writeJSONFile(appsFile, apps);
  }

  server.on('initializeApps', ({ body }) => {
    const { settings } = body;

    Promise.all(map(apps, (app) => (undeployApp({ app, settings, mainProxy }))))
    .then(() => (Promise.all(map(apps, (app) => (deployApp({ app, settings, mainProxy }))))))
    .then((newApps) => {
      apps = object(map(newApps, (a) => {
        mainProxy.use(a.vhost);
        return [a.id, a];
      }));

      removeMiddleware(mainProxy, fallbackStatic);
      mainProxy.use(fallbackStatic);
      server.send('appsChanged', apps);
    });
  });
  server.on('updateApp', ({ body }) => {
    const { app, settings } = body;
    delete(app.new);
    app.id = app.id || uuid.v1();

    if (apps[app.id]) {
      apps[app.id].loading = 'Updating...';
      server.send('appsChanged', apps);
    }

    undeployApp({ app: apps[app.id], settings, mainProxy })
    .then(() => (deployApp({ app, settings, mainProxy })))
    .then((newApp) => {
      apps[newApp.id] = newApp;
      writeJSONFile(appsFile, apps);

      removeMiddleware(mainProxy, fallbackStatic);
      mainProxy.use(fallbackStatic);

      server.send('appsChanged', apps);
    });
  });
  server.on('deleteApp', ({ body }) => {
    const { app, settings } = body;

    apps[app.id].loading = 'Deleting...';
    server.send('appsChanged', apps);

    undeployApp(apps[app.id], settings, mainProxy)
    .then(() => {
      delete(apps[app.id]);
      writeJSONFile(appsFile, apps);

      server.send('appsChanged', apps);
    });
  });
}
