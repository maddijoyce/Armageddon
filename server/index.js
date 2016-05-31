import Server from 'electron-rpc/server';

import settings from './components/settings.js';
import apps from './components/apps.js';

export default function ({ webContents, appDataPath }) {
  const server = new Server();
  server.configure(webContents);

  server.on('setPage', ({ body }) => {
    server.send('pageChanged', body);
  });
  settings({ server, appDataPath });
  apps({ server, appDataPath });
}
