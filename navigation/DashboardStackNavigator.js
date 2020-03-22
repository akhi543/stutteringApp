import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeNavigator from './HomeNavigator';

const DashboardStackNavigator = createStackNavigator(
    {
        Home: {
            screen: HomeNavigator
        }
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: () => <Icon style={{paddingLeft: 10}} name="md-menu" size={30} onPress={() => navigation.openDrawer()} />
            }
        }
    }
);

export default DashboardStackNavigator;