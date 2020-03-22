import React from 'react';

import { createAppContainer } from 'react-navigation';
import MainNavigator from './navigation/MainNavigator';

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return (
        <AppContainer />
    );
  }
}