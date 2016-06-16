import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import Edit from './index.jsx';
import { Loading } from '../../utilities';

export default function (test) {
  test('Edit Page', (assert) => {
    assert.plan(10);
    const mock = {
      client: { request: spy() },
      settings: {
        tld: 'dev',
      },
    };
    const existingApp = {
      id: 'existing',
      active: true,
      directory: '/fake/directory/path',
      domain: 'path',
    };
    const newApp = {
      active: true,
    };
    const newValue = 'fake';

    const element = mount(<Edit {...mock} />);

    assert.equal(element.find('input[name="domain"]').length, 0,
      'No inputs before settings are loaded');
    assert.equal(element.contains(<Loading />), true,
      'Loading bar before app is loaded');

    element.setProps({ app: newApp });
    element.find('input[name="directory"]').simulate('change',
      { target: { value: existingApp.directory } });
    assert.equal(element.find('input[name="domain"]').prop('value'), existingApp.domain,
      'Sets domain from directory');
    element.find('button[value="Save"]').simulate('click');

    const update = { settings: mock.settings, app: {
      active: true,
      directory: existingApp.directory,
      domain: existingApp.domain,
    } };
    assert.equal(mock.client.request.calledWith('app.update', update), true,
      'Saves with new values');
    assert.equal(mock.client.request.calledWith('page.set', 'home'), true,
      'Saves to home page');

    mock.client.request.reset();
    element.find('button[value="Cancel"]').simulate('click');
    assert.equal(mock.client.request.calledWith('page.set', 'home'), true,
      'Cancels to home page');

    mock.client.request.reset();
    element.setProps({ app: existingApp });
    assert.equal(element.find('input[name="domain"]').prop('value'), existingApp.domain,
      'Has existing value for domain');
    element.find('input[name="domain"]').simulate('change',
      { target: { value: newValue } });
    assert.equal(element.find('input[name="domain"]').prop('value'), newValue,
      'Shows changed value for domain');
    element.find('button[value="Delete"]').simulate('click');
    existingApp.domain = newValue;
    update.app = existingApp;
    assert.equal(mock.client.request.calledWith('app.delete', update), true,
      'Deletes current app');
    assert.equal(mock.client.request.calledWith('page.set', 'home'), true,
      'Deletes to home page');
  });
}
