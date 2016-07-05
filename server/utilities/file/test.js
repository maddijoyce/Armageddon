import path from 'path';
import { lstatSync, unlinkSync } from 'fs';

import {
  readJSONFile,
  writeJSONFile,
} from './index.js';

export default function (test) {
  test('JSON Files', (assert) => {
    assert.plan(3);
    const sanitize = (a) => (a);
    const mock = {
      a1234: {
        id: 'a1234',
        active: true,
        directory: '/mock/directory/path',
        domain: 'mock',
      },
    };
    const filePath = path.join(process.cwd(), 'test', 'file.json');

    try {
      readJSONFile(filePath, sanitize);
      assert.fail('Throws error if JSON file doesn\'t exist');
    } catch (error) {
      assert.pass('Throws error if JSON file doesn\'t exist');
    }

    writeJSONFile(filePath, mock, sanitize);
    try {
      lstatSync(filePath);
      assert.pass('Writes JSON file');
    } catch (error) {
      assert.fail('Writes JSON file');
    }

    assert.deepEqual(readJSONFile(filePath, sanitize), mock, 'Reads JSON file');
    unlinkSync(filePath);
  });
}
