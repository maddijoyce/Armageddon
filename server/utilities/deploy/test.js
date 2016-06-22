import hostile from 'hostile';
import portfinder from 'portfinder';
import { find, matches } from 'lodash';

import {
  addHost,
  removeHost,
  startProxy,
  removeMiddleware,
  startApp,
  killApp,
  deployApp,
  undeployApp,
} from './index.js';


export default function (test) {
  test('Hosts Manipulation', (assert) => {
    assert.plan(2);
    let lines;
    const host = `${Date.now()}.armageddonhost`;
    const map = ['127.0.0.1', host];

    addHost({ host }).then(() => {
      lines = hostile.get(false);
      assert.deepEqual(find(lines, matches(map)), map, 'Adds Host to Hosts file');
      return removeHost({ host });
    }).then(() => {
      lines = hostile.get(false);
      assert.equal(find(lines, matches(map)), undefined, 'Removes Host from Hosts file');
    });
  });

  test('Proxies', (assert) => {
    assert.plan(1);
    portfinder.getPort((error, port) => {
      const { proxyApp } = startProxy({ port });
      assert.equal(proxyApp.stack.length, 1, 'Proxy App has item in stack');
    });
  });
}
