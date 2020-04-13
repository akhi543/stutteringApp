import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeNavigator from './HomeNavigator';

/**
 * This is the parent stack navigator for the Home navigator.
 * It is used to add a header to the app navigation stack.
 */
const DashboardStackNavigator = createStackNavigator(
    {
        Home: {
            screen: HomeNavigator
        }
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerShown: false,
                headerLeft: () => <Icon style={{paddingLeft: 10}} name="md-menu" size={30} onPress={() => navigation.openDrawer()} />
            }
        }
    }
);

export default DashboardStackNavigator;