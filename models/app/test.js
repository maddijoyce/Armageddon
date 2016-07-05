import { clone } from 'lodash';

import App from './index.js';

export default function (test) {
  test('Apps Validation', (assert) => {
    assert.plan(9);
    const mock = {
      a1234: {
        id: 'a1234',
        active: true,
        directory: '/mock/directory/path',
        domain: 'mock',
        production: false,
        settings: '',
      },
    };

    assert.deepEqual(App.sanitize(mock), mock, 'Correct data remains the same');

    const extraMock = { a1234: clone(mock.a1234) };
    extraMock.a1234.extraProperty = 'value';
    assert.deepEqual(App.sanitize(extraMock), mock, 'Removes additional properties');

    assert.deepEqual(App.checkField('domain', 'n*t$domain'),
      ['is invalid (a-z, 0-9, - or . only)'],
      'Checks for invalid domain');

    assert.deepEqual(App.checkFields({
      active: true,
      directory: '',
      domain: undefined,
      production: false,
    }), {
      id: undefined,
      active: undefined,
      directory: 'is empty',
      domain: 'is empty',
      production: undefined,
      settings: undefined,
    }, 'Confirms invalid fields');

    assert.deepEqual(App.checkField('active', 'string'), ['must be true/false'],
      'Check for boolean on active');
    assert.deepEqual(App.checkField('directory', ''), ['is empty'],
      'Check for empty on directory');

    assert.deepEqual(App.checkField('notafield', 'value'), ['not in model'],
      'Check for field not in model');

    assert.deepEqual(App.checkFields(null), {
      id: undefined,
      active: 'must be true/false',
      directory: 'is empty',
      domain: 'is empty',
      settings: undefined,
      production: 'must be true/false',
    }, 'Check for fields on undefined object');

    assert.deepEqual(App.sanitize({ a1234: {} }), {},
      'Records without id don\'t save');
  });
}
