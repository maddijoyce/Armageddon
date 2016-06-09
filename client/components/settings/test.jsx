import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import Settings from './index.jsx';

export default function (test) {
  test('Settings Page', (assert) => {
    assert.plan(5);
    const mock = {
      client: { request: spy() },
      settings: {
        tld: 'dev',
      },
    };
    const element = mount(<Settings {...mock} />);
    const newValue = 'newdev';

    assert.equal(element.find('input[name="tld"]').prop('value'), mock.settings.tld,
      'Shows existing tld');
    element.find('input[name="tld"]').simulate('change', { target: { value: newValue } });
    element.find('button[value="Update"]').simulate('click');

    assert.equal(mock.client.request.calledWith('updateSettings', { tld: newValue }), true,
      'Saves with new tld');
    assert.equal(mock.client.request.calledWith('setPage', 'home'), true,
      'Saves to home page');

    mock.client.request.reset();
    element.find('button[value="Cancel"]').simulate('click');
    assert.equal(mock.client.request.calledWith('setPage', 'home'), true,
      'Cancels to home page');

    element.setProps({ settings: { tld: newValue } });
    assert.equal(element.find('input[name="tld"]').prop('value'), newValue,
      'Values change when new props set');
  });
}
