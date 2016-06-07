import { app, BrowserWindow, ipcMain } from 'electron'; // eslint-disable-line import/no-unresolved
import IpcStream from 'electron-ipc-stream';
import { filter } from 'lodash';
import glob from 'glob';

let renderer;

const progress = {
  renderer: false,
};
function finished(test) {
  progress[test] = true;
  if (!filter(progress, (v) => (!v)).length) {
    app.quit();
  }
}

app.on('ready', () => {
  renderer = new BrowserWindow({ width: 600, height: 600 });
  renderer.hide();
  renderer.webContents.openDevTools();
  renderer.loadURL(`file://${__dirname}/renderer.html`);
  renderer.on('closed', () => {
    renderer = null;
  });

  const testStream = new IpcStream('tests:out');
  testStream.pipe(process.stdout);
  ipcMain.on('tests:end', () => { finished('renderer'); });

  glob('client/**/test.jsx', (error, files) => {
    if (error) throw error;
    renderer.webContents.on('dom-ready', () => {
      renderer.send('tests:start', { files });
    });
  });
});
