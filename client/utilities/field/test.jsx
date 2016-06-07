import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
import Field from './index.jsx';
import File from './file.jsx';
import CheckBox from './check.jsx';

export default function (test) {
  test('Field', (assert) => {
    assert.plan(5);
    const mock = {
      name: 'location',
      icon: 'map-marker',
      label: 'Location',
      value: 'Australia',
      change: spy(),
    };
    const element = mount(<Field {...mock} />);

    assert.equal(element.find('input').length, 1, 'Renders a field');
    assert.equal(element.find('input').prop('value'), mock.value, 'Renders a field with value');
    assert.equal(element.find('label').text(), `${mock.label}`, 'Renders a custom label');

    const newValue = 'Sydney';
    element.find('input').simulate('change', { target: { value: newValue } });
    assert.equal(mock.change.calledOnce, true, 'Responds to input change');
    assert.equal(mock.change.calledWith(mock.name, newValue), true,
      'Responds to input change with name and value');
  });

  test('File', (assert) => {
    assert.plan(6);
    const mock = {
      name: 'directory',
      icon: 'folder',
      label: 'Directory',
      value: '',
      change: spy(),
    };
    const element = mount(<File {...mock} />);

    assert.equal(element.find('input').length, 1, 'Renders a field');
    assert.equal(element.find('input').prop('value'), mock.value, 'Renders a field with value');
    assert.equal(element.find('label').text(), mock.label, 'Renders a custom label');

    const newValue = '/fake/directory/path';
    const originalDialog = remote.dialog.showOpenDialog;
    remote.dialog.showOpenDialog = spy(() => ([newValue]));
    element.find('input').simulate('click');
    assert.equal(remote.dialog.showOpenDialog.calledOnce, true, 'Responds to click with dialog');
    remote.dialog.showOpenDialog = originalDialog;
    assert.equal(mock.change.calledOnce, true, 'Responds to file change');
    assert.equal(mock.change.calledWith(mock.name, newValue), true,
      'Responds to file change with name and value');
  });

  test('CheckBox', (assert) => {
    assert.plan(5);
    const mock = {
      name: 'active',
      label: 'Active',
      value: false,
      change: spy(),
    };
    const element = mount(<CheckBox {...mock} />);

    assert.equal(element.find('input').length, 1, 'Renders a check');
    assert.equal(element.find('input').prop('checked'), mock.value, 'Renders a check with value');
    assert.equal(element.find('label').text(), mock.label, 'Renders a custom label');

    element.find('input').simulate('click');
    assert.equal(mock.change.calledOnce, true, 'Responds to click');
    assert.equal(mock.change.calledWith(mock.name, !mock.value), true,
      'Responds to file change with name and value');
  });
}
