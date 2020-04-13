import React from 'react';
import EasyOnset from '../../exercises/ContinuousSpeech';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<ContinuousSpeech />').toJSON();
    expect(tree).toMatchSnapshot();
});