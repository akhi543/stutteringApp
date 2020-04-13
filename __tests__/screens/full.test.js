import React from 'react';
import EasyOnset from '../../exercises/FullBreath';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<FullBreath />').toJSON();
    expect(tree).toMatchSnapshot();
});