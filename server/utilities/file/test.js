import { clone } from 'lodash';
import path from 'path';
import { lstatSync, unlinkSync } from 'fs';

import {
  sanitizeApps,
  sanitizeSettings,
  readJSONFile,
  writeJSONFile,
} from './index.js';

export default function (test) {
  test('Apps Sanitizer', (assert) => {
    assert.plan(2);
    const mock = {
      a1234: {
        id: 'a1234',
        active: true,
        directory: '/mock/directory/path',
        domain: 'mock',
      },
    };
    assert.deepEqual(sanitizeApps(mock), mock, 'Correct data remains the same');

    const extraMock = { a1234: clone(mock.a1234) };
    extraMock.a1234.extraProperty = 'value';
    assert.deepEqual(sanitizeApps(extraMock), mock, 'Removes additional properties');
  });

  test('Settings Sanitizer', (assert) => {
    assert.plan(2);
    const mock = {
      tld: 'test',
    };
    assert.deepEqual(sanitizeSettings(mock), mock, 'Correct data remains the same');

    const extraMock = clone(mock);
    extraMock.extraProperty = 'value';
    assert.deepEqual(sanitizeSettings(extraMock), mock, 'Removes additional properties');
  });

  test('JSON Files', (assert) => {
    assert.plan(3);
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
      readJSONFile(filePath, sanitizeApps);
      assert.fail('Throws error if JSON file doesn\'t exist');
    } catch (error) {
      assert.pass('Throws error if JSON file doesn\'t exist');
    }

    writeJSONFile(filePath, mock, sanitizeApps);
    try {
      lstatSync(filePath);
      assert.pass('Writes JSON file');
    } catch (error) {
      assert.fail('Writes JSON file');
    }

    assert.deepEqual(readJSONFile(filePath, sanitizeApps), mock, 'Reads JSON file');
    unlinkSync(filePath);
  });
}
