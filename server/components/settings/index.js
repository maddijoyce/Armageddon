import path from 'path';

import {
  readJSONFile,
  writeJSONFile,
  sanitizeSettings,
} from '../../utilities';

export const defaultSettings = {
  tld: 'dev',
};

export default function ({ server, appDataPath }) {
  const settingsFile = path.join(appDataPath, 'settings.json');
  let settings;

  try {
    settings = readJSONFile(settingsFile, sanitizeSettings);
  } catch (e) {
    settings = defaultSettings;
    writeJSONFile(settingsFile, settings, sanitizeSettings);
  }

  server.on('settings.initialize', () => {
    server.send('settings.changed', settings);
  });
  server.on('settings.update', ({ body }) => {
    settings = body;
    writeJSONFile(settingsFile, settings, sanitizeSettings);
    server.send('settings.changed', settings);
  });
}
