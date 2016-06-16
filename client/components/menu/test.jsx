import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { keys } from 'lodash';

import Menu from './index.jsx';
import { Title } from '../../utilities';

export default function (test) {
  test('Menu', (assert) => {
    assert.plan(7);
    const client = {
      functions: {},
      request: spy(),
      on: spy((name, callback) => {
        client.functions[name] = callback;
      }),
    };
    const settings = {
      tld: 'dev',
    };
    const apps = {
      a1234: {
        id: 'a1234',
        active: true,
        directory: '/fake/directory/path',
        domain: 'path',
      },
      a1235: {
        id: 'a1235',
        active: false,
        directory: '/fake/directory/other',
        domain: 'other',
      },
    };

    const element = mount(<Menu client={client} />);

    assert.equal(element.findWhere((e) => (e.matchesElement(<Title />))).text(), 'Armageddon',
      'Shows title on launch');
    assert.deepEqual(keys(client.functions), ['page.changed', 'settings.changed', 'apps.changed'],
      'Menu listens for value changes');
    assert.equal(client.request.calledWith('settings.initialize'), true,
      'Menu initializes settings on mount');

    client.functions['settings.changed'](null, settings);
    assert.equal(client.request.calledWith('apps.initialize', { settings }), true,
      'Initializes apps on settings change');

    client.functions['apps.changed'](null, apps);
    client.functions['page.changed'](null, 'settings');
    assert.equal(element.findWhere((e) => (e.matchesElement(<Title />))).text(), 'Settings',
      'Changes to Settings page');
    client.functions['page.changed'](null, 'add');
    assert.equal(element.findWhere((e) => (e.matchesElement(<Title />))).text(), 'Add App',
      'Changes to Settings page');
    client.functions['page.changed'](null, 'edit/a1234');
    assert.equal(element.findWhere((e) => (e.matchesElement(<Title />))).text(), apps.a1234.domain,
      'Changes to Edit page - Domain as title');
  });
}
