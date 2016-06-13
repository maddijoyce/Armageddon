import { clone, extend } from 'lodash';
import path from 'path';
import { lstatSync, unlinkSync } from 'fs';

import {
  sanitizeData,
  readJSONFile,
  writeJSONFile,
} from './index.js';

export default function (test) {
  test('Data Sanitizer', (assert) => {
    assert.plan(2);
    const mock = [{
      id: 'id',
      active: true,
      directory: '/mock/directory/path',
      domain: 'mock',
    }];
    assert.deepEqual(mock, sanitizeData(mock), 'Correct data remains the same');

    const extraMock = extend(clone(mock), {
      otherField: true,
    });
    assert.deepEqual(mock, sanitizeData(extraMock), 'Removes additional properties');
  });

  test('JSON Files', (assert) => {
    assert.plan(3);
    const mock = [{
      id: 'id',
      active: true,
      directory: '/mock/directory/path',
      domain: 'mock',
    }];
    const filePath = path.join(process.cwd(), 'test', 'file.json');

    writeJSONFile(filePath, mock);
    try {
      lstatSync(filePath);
      assert.pass('Writes JSON file');
    } catch (error) {
      assert.fail('Writes JSON file');
    }

    assert.deepEqual(mock, readJSONFile(filePath), 'Reads JSON file');

    unlinkSync(filePath);
    try {
      readJSONFile(filePath);
      assert.fail('Throws error if JSON file doesn\'t exist');
    } catch (error) {
      assert.pass('Throws error if JSON file doesn\'t exist');
    }
  });
}
