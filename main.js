import menubar from 'menubar';
import path from 'path';

import electron from 'electron-prebuilt';
import reload from 'electron-reload';

import createServer from './server';

const dir = path.join(process.cwd(), 'client');
const menu = menubar({
  dir,
  'always-on-top': true,
  'preload-window': true,
  width: 400,
  height: 460,
  icon: path.join(dir, 'images', 'IconTemplate.png'),
  tooltip: 'Armageddon- Meteor.js App Manager',
});
reload(__dirname, {
  electron,
});

menu.on('after-create-window', () => {
  const webContents = menu.window.webContents;
  const app = menu.app;
  const appDataPath = path.join(menu.app.getPath('appData'), app.getName());

  menu.window.openDevTools();

  createServer({ webContents, appDataPath, app });
});
