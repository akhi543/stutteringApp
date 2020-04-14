import React from 'react';

import { createAppContainer } from 'react-navigation';
import MainNavigator from './navigation/MainNavigator';

const AppContainer = createAppContainer(MainNavigator);


/**
 * The root class for the entire App.
 * It calls all the child components.
 * It is set to be only the AppContainer to
 * ensure maximum abstraction.
 */
export default class App extends React.Component {
  render() {
    return (
        <AppContainer />
    );
  }
}
