import Server from 'electron-rpc/server';

import { settings, apps } from './components';

export default function ({ webContents, appDataPath }) {
  const server = new Server();
  server.configure(webContents);

  server.on('page.set', ({ body }) => {
    server.send('page.changed', body);
  });
  settings({ server, appDataPath });
  apps({ server, appDataPath });
}
