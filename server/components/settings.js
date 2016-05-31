import path from 'path';

import { readJSONFile, writeJSONFile } from '../utilities';

export const defaultSettings = {
  tld: 'dev',
};

export default function ({ server, appDataPath }) {
  const settingsFile = path.join(appDataPath, 'settings.json');
  let settings;

  try {
    settings = readJSONFile(settingsFile);
  } catch (e) {
    settings = defaultSettings;
    writeJSONFile(settingsFile, settings);
  }

  server.on('initializeSettings', () => {
    server.send('settingsChanged', settings);
  });
  server.on('updateSettings', ({ body }) => {
    settings = body.settings;
    writeJSONFile(settingsFile, settings);
    server.send('settingsChanged', settings);
  });
}
