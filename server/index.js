import Server from 'electron-rpc/server';

import { settings, apps } from './components';

export default function ({ webContents, appDataPath, app }) {
  const server = new Server();
  server.configure(webContents);

  server.on('quit', () => {
    app.quit();
  });
  server.on('page.set', ({ body }) => {
    server.send('page.changed', body);
  });
  settings({ server, appDataPath });
  apps({ server, appDataPath });
}
