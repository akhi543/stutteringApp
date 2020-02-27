import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import MainStack from './navigation/MainStack'
import { BackHandler, View, Dimensions, Animated, TouchableOpacity, Text } from 'react-native';
import { stackActions } from 'react-navigation';

let { width, height } = Dimensions.get('window')

const AppContainer = createAppContainer(MainStack);


class App extends React.Component {
  /*
  state = {
    backClickCount: 0
  };

  constructor(props) {
    super(props);

    this.springValue = new Animated.Value(100);
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  UNSAFE_componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  _spring() {
    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(
          this.springValue,
          {
            toValue: -.15 * height,
            friction: 5,
            duration: 300,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          this.springValue,
          {
            toValue: 100,
            duration: 300,
            useNativeDriver: true
          }
        ),
      ]).start(() => {
        this.setState({backClickCount: 0});
      });
    });
  }
  
  handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

    return true;
  };
  */
 
  render() {
    return (
        <AppContainer />
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});