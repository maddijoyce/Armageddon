import {
  sanitizeData,
} from './index.js';

export default function (test) {
  test('Sanitizes Data', (assert) => {
    assert.plan(1);
    const mock = [{
      id: 'id',
      active: true,
      directory: '/mock/directory/path',
      domain: 'mock',
    }];
    assert.deepEqual(mock, sanitizeData(mock), 'Sanitized data remains the same');
  });
}
