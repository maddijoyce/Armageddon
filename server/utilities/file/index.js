import { readFileSync, writeFileSync } from 'fs';
import { pick } from 'lodash';

export function sanitizeSettings(content) {
  return pick(content, [
    'tld',
  ]);
}

export function readJSONFile(path, sanitize) {
  const data = readFileSync(path, { encoding: 'utf8' });
  const json = JSON.parse(data.toString());
  return sanitize(json);
}

export function writeJSONFile(path, data, sanitize) {
  const json = JSON.stringify(sanitize(data));
  return writeFileSync(path, json);
}
