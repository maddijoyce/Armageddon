import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { shell } from 'electron'; // eslint-disable-line import/no-unresolved
import { includes, values } from 'lodash';

import Home from './index.jsx';
import Row from './row.jsx';
import { Loading } from '../../utilities';

export default function (test) {
  test('Home Page', (assert) => {
    assert.plan(7);
    const mock = {
      client: { request: spy() },
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

    const element = mount(<Home {...mock} />);
    assert.equal(element.contains(<Loading />), true,
      'Loading bar before settings are loaded');
    element.setProps({ settings });
    assert.equal(element.contains(<Loading />), true,
      'Loading bar before apps are loaded');

    element.setProps({ apps: {} });
    assert.equal(includes(element.text(), 'You haven\'t added any apps'), true,
      'Shows message when there are no apps');

    element.setProps({ apps });
    assert.equal(element.findWhere((e) => (e.matchesElement(<Row />))).length, values(apps).length,
      'Shows all apps');

    element.find('button').filterWhere((b) => (b.prop('value') === 'Add App')).simulate('click');
    assert.equal(mock.client.request.calledWith('page.set', 'add'), true,
      'Add App button available and changes page');

    mock.client.request.reset();
    element.find('button[value="Settings"]').simulate('click');
    assert.equal(mock.client.request.calledWith('page.set', 'settings'), true,
      'Settings button available and changes page');

    mock.client.request.reset();
    element.find('button[value="Quit"]').simulate('click');
    assert.equal(mock.client.request.calledWith('quit'), true,
      'Quit button sends quit request');
  });

  test('Home Page Row', (assert) => {
    assert.plan(10);
    const row = {
      client: { request: spy() },
      tld: 'dev',
      id: 'a1234',
      active: true,
      domain: 'path',
      port: 8003,
    };

    const element = mount(<Row {...row} />);

    assert.equal(includes(element.find('a').text(), `${row.domain}.${row.tld}`), true,
      'Shows domain and tld in row');

    const status = element.ref('status');
    assert.equal(includes(status.text(), 'RUNNING'), true,
      'Shows RUNNING when active');
    assert.equal(status.find('i').prop('alt'), 'wifi icon',
      'Shows running icon when active');
    element.setProps({ active: false });
    assert.equal(includes(status.text(), 'STOPPED'), true,
      'Shows STOPPED when stopped');
    assert.equal(status.find('i').prop('alt'), 'pause icon',
      'Shows pause icon when stopped');
    element.setProps({ error: 'Has an error' });
    assert.equal(includes(status.text(), 'Has an error'), true,
      'Shows error text');
    assert.equal(status.find('i').prop('alt'), 'exclamation-circle icon',
      'Shows error icon');

    element.setProps({ loading: 'Updating...' });
    assert.equal(includes(element.text(), 'Updating...'), true,
      'Shows loading label as needed');
    element.setProps({ loading: null });

    const originalExternal = shell.openExternal;
    shell.openExternal = spy();
    element.find('a').simulate('click');
    assert.equal(shell.openExternal.calledWith(`http://${row.domain}.${row.tld}/`), true,
      'Link opens browser');
    shell.openExternal = originalExternal;

    element.find('button[value="Edit"]').simulate('click');
    assert.equal(row.client.request.calledWith('page.set', `edit/${row.id}`), true,
      'Edit button available and changes page');

    row.client.request.reset();
    element.find('button[value="Logs"]').simulate('click');
    // TODO - Add Logs tests
  });
}
