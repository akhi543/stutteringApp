import React from 'react';
import Home from '../Screens/Home';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Home />').toJSON();
    expect(tree).toMatchSnapshot();
});