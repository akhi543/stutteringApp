import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Social from '../screens/Social';
import All from '../screens/All';

const HomeNavigator = createBottomTabNavigator(
    {
        Exercise: {
            screen: All,
            navigationOptions: {
                tabBarLabel: "EXERCISE",
                tabBarIcon: ({tintColor}) => (
                    <Icon name="md-stopwatch" color={tintColor} size={24} />
                )
            }
        },
        Social: {
            screen: Social,
            navigationOptions: {
                tabBarLabel: "SOCIAL",
                title: "Social",
                tabBarIcon: ({tintColor}) => (
                    <Icon name="md-people" color={tintColor} size={24} />
                )
            }
        }
    },
    {
        initialRouteName: 'Exercise',
        navigationOptions: ({ navigation }) => {
            const { routeName } = navigation.state.routes[navigation.state.index];
            return {
                headerTitle: routeName
            }
        },
    }
);

export default HomeNavigator;