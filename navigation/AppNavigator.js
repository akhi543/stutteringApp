import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Exercise from '../Screens/Exercise';
import Social from '../Screens/Social';

const AppNavigator = createBottomTabNavigator(
    {
        Exercise: {
            screen: Exercise,
            navigationOptions: {
            tabBarLabel: 'EXERCISE',
            tabBarIcon: ({tintColor}) => (
                <Icon name="md-stopwatch" color={tintColor} size={24}/>
            )
            }
        },
        Social: {
            screen: Social,
            navigationOptions: {
            tabBarLabel: 'SOCIAL',
            tabBarIcon: ({tintColor}) => (
                <Icon name="md-people" color={tintColor} size={24}/>
            )
            }
        }
    },
    {
        resetOnBlur: true
    }
);

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
