import menubar from 'menubar';
import path from 'path';

import createServer from './server';

const dir = path.join(process.cwd(), 'client');
const menu = menubar({
  dir,
  preloadWindow: true,
  icon: path.join(dir, 'icon', 'IconTemplate.png'),
  tooltip: 'Armageddon- Meteor.js App Manager',
});

menu.on('after-create-window', () => {
  const webContents = menu.window.webContents;
  const appDataPath = path.join(menu.app.getPath('appData'), menu.app.getName());

  createServer({ webContents, appDataPath });
});
