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
      icns: `${process.cwd()}/client/icon/Icon.icns`,
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

    Promise.all(map(apps, (a) => (deployApp(settings, a))))
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
    app.id = app.id || uuid.v1();

    undeployApp(apps[app.id], settings, mainProxy)
    .then(() => (deployApp(app, settings)))
    .then((newApp) => {
      apps[newApp.id] = newApp;
      mainProxy.use(newApp.vhost);
      writeJSONFile(appsFile, apps);

      removeMiddleware(mainProxy, fallbackStatic);
      mainProxy.use(fallbackStatic);

      server.send('appsChanged', apps);
    });
  });
}
