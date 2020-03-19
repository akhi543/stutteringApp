import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, StackActions, NavigationActions } from 'react-navigation';

import All from './All';
import Current from './Current';
import Home from './Home';

const resetAction = StackActions.reset ({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
});

const ExerciseStack = createStackNavigator(
    {
        Current: {
            screen: Current,
            navigationOptions: {
                title: 'Active Exercises',
                headerTitleAlign: 'left'
            }
        },
        All: {
            screen: All,
            navigationOptions: {
                title: 'All Exercises',
                headerTitleAlign: 'left'
            }
        },
        Home: {
            screen: Home,
            navigationOptions: {
                title: 'Stuttering App',
                headerTitleAlign: 'center'
            }
        }
    },
    {
        headerMode: 'screen',
        initialRouteName: 'Home',
    }
);

const ExerciseContainer = createAppContainer(ExerciseStack);

class Exercise extends React.Component {
  render() {
      return (
        <ExerciseContainer />
      );
  }
}

export default Exercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Expo.Constants.statusBarHeight
  },
  button: {
      width: '50%',
      height: 40
  }
});
