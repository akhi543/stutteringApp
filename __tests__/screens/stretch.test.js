import React from 'react';
import EasyOnset from '../../exercises/StretchSpeech';

import renderer from 'react-test-renderer';

test('Renders correctly', () => {
    const tree = renderer.create('<StretchSpeech />').toJSON();
    expect(tree).toMatchSnapshot();
});