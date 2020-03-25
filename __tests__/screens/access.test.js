import React from 'react';
import Access from '../../screens/Access';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Access />').toJSON();
    expect(tree).toMatchSnapshot();
});