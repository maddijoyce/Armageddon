import { readFileSync, writeFileSync } from 'fs';
import { map, pick } from 'lodash';

export function sanitizeData(content) {
  return map(content, (c) => (pick(c, [
    'id',
    'active',
    'directory',
    'domain',
  ])));
}

export function readJSONFile(file) {
  return sanitizeData(JSON.parse(readFileSync(file, { encoding: 'utf8' }).toString()));
}

export function writeJSONFile(file, content) {
  return writeFileSync(file, JSON.stringify(sanitizeData(content)));
}
