import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { extend, clone } from 'lodash';

import Edit from './index.jsx';
import { Loading } from '../../utilities';

export default function (test) {
  test('Edit Page', (assert) => {
    assert.plan(6);
    const mock = {
      client: { request: spy() },
      settings: {
        tld: 'dev',
      },
      app: {
        active: true,
        directory: '/fake/directory/path',
      },
    };
    const element = mount(<Edit client={mock.client} settings={mock.settings} />);
    const newApp = extend(clone(mock.app), {
      domain: 'domain',
      directory: '/fake/directory/domain',
    });

    assert.equal(element.find('input[name="domain"]').length, 0,
      'No inputs before settings are loaded');
    assert.equal(element.contains(<Loading />), true,
      'Loading bar before settings are loaded');

    element.setProps({ app: mock.app });
    assert.equal(element.find('input[name="directory"]').prop('value'), mock.app.directory,
      'Shows existing domain');
    element.find('input[name="directory"]').simulate('change',
      { target: { value: newApp.directory } });
    element.find('button[value="Save"]').simulate('click');

    const update = { settings: mock.settings, app: newApp };
    assert.equal(mock.client.request.calledWith('updateApp', update), true,
      'Saves with new values');
    assert.equal(mock.client.request.calledWith('setPage', 'home'), true,
      'Saves to home page');

    mock.client.request.reset();
    element.find('button[value="Cancel"]').simulate('click');
    assert.equal(mock.client.request.calledWith('setPage', 'home'), true,
      'Cancels to home page');
  });
}
