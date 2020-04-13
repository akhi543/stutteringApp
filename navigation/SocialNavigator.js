import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import Social from '../screens/Social';

/**
 * This is the social navigator. It can be used to add more screens and
 * navigate to other profiles as well as some specific exercise that the user
 * wants to practice based on the other user's social feed.
 */
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