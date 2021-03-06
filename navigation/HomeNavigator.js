import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import SocialNavigator from '../navigation/SocialNavigator';
import ExerciseNavigator from '../navigation/ExerciseNavigator';
import MyprofileNavigator from '../navigation/MyprofileNavigator';

/**
 * This is the Home navigator. Home contains the exercises navigator and the
 * Social navigator. It is a bottom tab navigator with two tabs.
 */
const HomeNavigator = createBottomTabNavigator(
    {
        Exercise: {
            screen: ExerciseNavigator,
            navigationOptions: {
                tabBarLabel: "EXERCISE",
                tabBarIcon: ({tintColor}) => (
                    <Icon name="md-stopwatch" color={tintColor} size={24} />
                )
            }
        },
        Social: {
            screen: SocialNavigator,
            navigationOptions: {
                tabBarLabel: "SOCIAL",
                title: "Social",
                tabBarIcon: ({tintColor}) => (
                    <Icon name="md-people" color={tintColor} size={24} />
                )
            }
        },
        Myprofile: {
            screen: MyprofileNavigator,
            navigationOptions: {
                tabBarLabel: "You",
                title: "You",
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
                headerShown: false,
                headerTitle: routeName
            }
        },
    }
);

export default HomeNavigator;