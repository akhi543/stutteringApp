import React from 'react';
import EasyOnset from '../../exercises/LightContact';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<LightContact />').toJSON();
    expect(tree).toMatchSnapshot();
});