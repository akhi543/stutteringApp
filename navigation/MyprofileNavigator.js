import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import Myprofile from '../screens/Myprofile';

const MyprofileNavigator = createStackNavigator(
    {
        Myprofile: {
            screen: Myprofile,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: "My profile",
                    headerLeft: () => <Icon style={{paddingLeft: 10}} name="md-menu" size={30} onPress={() => navigation.openDrawer()} />
                }
            }
        }
    }
);

export default MyprofileNavigator;