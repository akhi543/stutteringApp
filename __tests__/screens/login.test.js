import React from 'react';
import Login from '../../screens/Login';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Login />').toJSON();
    expect(tree).toMatchSnapshot();
});