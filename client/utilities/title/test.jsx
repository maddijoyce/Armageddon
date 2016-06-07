import React from 'react';
import { shallow } from 'enzyme';

import Title from './index.jsx';

export default function (test) {
  test('Title', (assert) => {
    assert.plan(3);
    const mock = {
      label: 'This Is a Title',
    };
    let element = shallow(<Title label={mock.label} />);

    assert.equal(element.find('h1').text(), mock.label, 'Renders an h1');
    assert.equal(element.find('img').length, 1, 'Renders an icon');

    element = shallow(<Title label={mock.label} icon={false} />);
    assert.equal(element.find('img').length, 0, 'Able to hide icon');

    assert.end();
  });
};
