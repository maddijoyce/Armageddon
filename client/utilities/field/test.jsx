import React from 'react';
import { mount } from 'enzyme';
import { spy, stub } from 'sinon';
import { includes } from 'lodash';

import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
import Field from './index.jsx';
import File from './file.jsx';
import CheckBox from './check.jsx';

export default function (test) {
  test('Field', (assert) => {
    assert.plan(7);
    const mock = {
      name: 'location',
      icon: 'map-marker',
      label: 'Location',
      value: 'Australia',
      change: spy(),
    };
    const element = mount(<Field {...mock} />);
    const newValue = 'Sydney';

    assert.equal(element.find('input').length, 1, 'Renders a field');
    assert.equal(element.find('input').prop('value'), mock.value, 'Renders a field with value');
    assert.equal(element.find('label').text(), `${mock.label}`, 'Renders a custom label');

    element.find('input').simulate('change', { target: { value: newValue } });
    assert.equal(mock.change.calledOnce, true, 'Responds to input change');
    assert.equal(mock.change.calledWith(mock.name, newValue), true,
      'Responds to input change with name and value');

    mock.change.reset();
    element.setProps({ change: null });
    element.find('input').simulate('change', { target: { value: newValue } });
    assert.equal(mock.change.calledOnce, false, 'No change when function not set');

    element.find('input').simulate('focus');
    assert.equal(mock.change.calledOnce, false, 'No change on focus');
  });

  test('File', (assert) => {
    assert.plan(8);
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
    remote.dialog.showOpenDialog = stub().returns([newValue]);
    element.find('input').simulate('focus');
    assert.equal(remote.dialog.showOpenDialog.calledOnce, true, 'Responds to click with dialog');
    assert.equal(mock.change.calledOnce, true, 'Responds to file change');
    assert.equal(mock.change.calledWith(mock.name, newValue), true,
      'Responds to file change with name and value');

    mock.change.reset();
    element.setProps({ change: null });
    element.find('input').simulate('focus');
    assert.equal(mock.change.calledOnce, false, 'No change when function not set');

    element.setProps({ change: mock.change });
    remote.dialog.showOpenDialog = stub().returns(null);
    element.find('input').simulate('focus');
    assert.equal(mock.change.calledWith(mock.name, ''), true, 'Change to nothing');

    remote.dialog.showOpenDialog = originalDialog;
  });

  test('CheckBox', (assert) => {
    assert.plan(8);
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

    element.find('input').simulate('change', { target: { value: !mock.value } });
    assert.equal(mock.change.calledOnce, true, 'Responds to click');
    assert.equal(mock.change.calledWith(mock.name, !mock.value), true,
      'Responds to file change with name and value');

    element.setProps({ error: 'SpecialError' });
    assert.equal(includes(element.text(), 'SpecialError'), true,
      'Shows error as needed');

    mock.change.reset();
    element.setProps({ change: null });
    element.find('input').simulate('change', { target: { value: !mock.value } });
    assert.equal(mock.change.calledOnce, false, 'No change when function not set');

    element.setProps({ value: true });
    assert.equal(includes(element.ref('field').prop('className'), 'Field--checked'), true,
        'Renders a checked icon');
    element.setProps({ value: false });
  });
}
