import React from 'react';
import { shallow, render } from 'enzyme';
import { spy } from 'sinon';
import { map, contains } from 'lodash';

import Button from './index.jsx';
import Bar from './bar.jsx';

export default function (test) {
  test('Button', (assert) => {
    assert.plan(5);
    const mock = {
      name: 'Save',
      label: 'Save',
      icon: 'check',
      colour: 'green',
      action: spy(),
    };
    const element = shallow(<Button {...mock} />);

    assert.equal(element.find('button').length, 1, 'Renders a button');
    assert.equal(element.find('p').text(), mock.label, 'Renders a custom label');
    assert.equal(contains(element.find('button').prop('className'), mock.colour), true,
      'Renders a custom colour');

    element.find('button').simulate('click');
    assert.equal(mock.action.calledOnce, true, 'Responds to click once');
    assert.equal(mock.action.calledWith(mock.name), true, 'Responds to click with button name');
  });

  test('Button Bar', (assert) => {
    assert.plan(1);
    const mock = [{
      name: 'Save',
      label: 'Save',
      icon: 'check',
    }, {
      name: 'Cancel',
      label: 'Cancel',
      icon: 'left-arrow',
    }, {
      name: 'Delete',
      label: 'Delete',
      icon: 'minus',
    }];
    const element = render(<Bar>{map(mock, (b) => (<Button key={b.name} {...b} />))}</Bar>);

    assert.equal(element.find('button').length, mock.length, 'Contains all buttons');
  });
}
