import React from 'react';
import EasyOnset from '../../exercises/EasyOnset';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<EasyOnset />').toJSON();
    expect(tree).toMatchSnapshot();
});