import React from 'react';
import Current from '../Screens/Current';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Current />').toJSON();
    expect(tree).toMatchSnapshot();
});