import React from 'react';
import Assigned from '../../screens/Assigned';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Assigned />').toJSON();
    expect(tree).toMatchSnapshot();
});