import React from 'react';
import { createAppContainer } from 'react-navigation';
import MainStack from './navigation/MainStack';

const AppContainer = createAppContainer(MainStack);


export default class App extends React.Component {
  render() {
    return (
        <AppContainer />
    );
  }
}