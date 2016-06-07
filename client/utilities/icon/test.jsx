import React from 'react';
import { shallow } from 'enzyme';

import Icon from './index.jsx';

export default function (test) {
  test('Icon', (assert) => {
    assert.plan(2);
    const mock = {
      name: 'lock',
    };
    const element = shallow(<Icon {...mock} />);

    assert.equal(element.find('i').length, 1, 'Renders an icon');
    assert.equal(element.find('i').prop('alt'), `${mock.name} icon`, 'Renders alt text');
  });
}
