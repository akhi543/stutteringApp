import React from 'react';
import Social from '../../screens/Social';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Social />').toJSON();
    expect(tree).toMatchSnapshot();
});