import React from 'react';
import { StyleSheet, View, Text, Alert, BackHandler } from 'react-native';
import { Button } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import Constants from 'expo-constants';

import HandleBack from '../components/HandleBack';
import HomeNavigator from '../navigation/HomeNavigator';

const HomeContainer = createAppContainer(HomeNavigator);

/**
 * This is the container for the Home stack navigator of the app.
 * This navigator is responsible for the exercise screens and the
 * social feed screen.
 */
class Home extends React.Component {
  onBack = () => {
    Alert.alert(
      "You are about to exit the application.",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel", onPress: () => {}, style: 'cancel'
        },
        {
          text: "Exit", onPress: () => {
            BackHandler.exitApp()
          }
        }
      ],
      { cancelable: false },
    );
    
    return true;
  }
  render() {
    return (
      <HandleBack onBack={this.onBack}>
        <HomeContainer />
      </HandleBack>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight
  },
  button: {
      width: '50%',
      height: 40
  }
});
