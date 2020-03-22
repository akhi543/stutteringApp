import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import Social from '../screens/Social';

const SocialNavigator = createStackNavigator(
    {
        Social: {
            screen: Social,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: "Social",
                    headerLeft: () => <Icon style={{paddingLeft: 10}} name="md-menu" size={30} onPress={() => navigation.openDrawer()} />
                }
            }
        }
    }
);

export default SocialNavigator;