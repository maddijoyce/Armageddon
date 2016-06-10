import React from 'react';
import { shallow } from 'enzyme';
import { includes } from 'lodash';

import Icon from './index.jsx';

export default function (test) {
  test('Icon', (assert) => {
    assert.plan(6);
    const mock = {
      name: 'lock',
    };
    const element = shallow(<Icon {...mock} />);

    assert.equal(element.find('i').length, 1, 'Renders an icon');
    assert.equal(element.find('i').prop('alt'), `${mock.name} icon`, 'Renders alt text');

    element.setProps({ loading: true });
    assert.equal(element.find('i').prop('alt'), 'sync icon', 'Renders a loading icon');
    element.setProps({ loading: false });

    element.setProps({ fixed: true });
    assert.equal(includes(element.find('i').prop('className'), 'bt-fw'), true,
        'Renders a fixed width icon');
    element.setProps({ fixed: false });

    element.setProps({ size: '2x' });
    assert.equal(includes(element.find('i').prop('className'), 'bt-2x'), true,
        'Renders a 2x size icon');
    element.setProps({ size: null });

    element.setProps({ animation: 'spin' });
    assert.equal(includes(element.find('i').prop('className'), 'bt-spin'), true,
        'Renders an animated icon');
    element.setProps({ animation: null });
  });
}
