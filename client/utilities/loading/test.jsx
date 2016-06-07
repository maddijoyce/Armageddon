import React from 'react';
import { shallow } from 'enzyme';

import Loading from './index.jsx';

export default function (test) {
  test('Loading', (assert) => {
    assert.plan(2);
    const mock = {
      label: 'Updating...',
    };

    let element = shallow(<Loading />);
    assert.equal(element.find('p').text(), 'Loading...', 'Renders a label');

    element = shallow(<Loading label={mock.label} />);
    assert.equal(element.find('p').text(), 'Updating...', 'Renders a custom label');
  });
}
