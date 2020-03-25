import React from 'react';
import All from '../../screens/All';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<All />').toJSON();
    expect(tree).toMatchSnapshot();
});