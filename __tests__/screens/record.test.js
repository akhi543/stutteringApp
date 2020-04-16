import React from 'react';
import Record from '../../screens/Record';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<Record />').toJSON();
    expect(tree).toMatchSnapshot();
});