import React from 'react';
import Profile from '../../screens/Myprofile';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Profile />').toJSON();
    expect(tree).toMatchSnapshot();
});