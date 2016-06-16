import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import Settings from './index.jsx';
import { Loading } from '../../utilities';

export default function (test) {
  test('Settings Page', (assert) => {
    assert.plan(8);
    const mock = {
      client: { request: spy() },
      settings: {
        tld: 'dev',
      },
    };
    const element = mount(<Settings client={mock.client} />);
    const newValue = 'newdev';

    assert.equal(element.find('input[name="tld"]').length, 0,
      'No inputs before settings are loaded');
    assert.equal(element.contains(<Loading />), true,
      'Loading bar before settings are loaded');

    element.setProps({ settings: mock.settings });
    assert.equal(element.find('input[name="tld"]').prop('value'), mock.settings.tld,
      'Shows existing tld');
    element.find('input[name="tld"]').simulate('change', { target: { value: newValue } });
    element.find('button[value="Update"]').simulate('click');

    assert.equal(mock.client.request.calledWith('settings.update', { tld: newValue }), true,
      'Saves with new tld');
    assert.equal(mock.client.request.calledWith('page.set', 'home'), true,
      'Saves to home page');

    mock.client.request.reset();
    element.find('button[value="Cancel"]').simulate('click');
    assert.equal(mock.client.request.calledWith('page.set', 'home'), true,
      'Cancels to home page');

    element.setProps({ settings: { tld: newValue } });
    assert.equal(element.find('input[name="tld"]').prop('value'), newValue,
      'Values change when new settings props set');
    element.setProps({});
    assert.equal(element.find('input[name="tld"]').prop('value'), newValue,
      'Values don\'t change when new props without settings set');

  });
}
