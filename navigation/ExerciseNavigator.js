import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import ExerciseList from '../screens/ExerciseList';
import ContinuousSpeech from '../exercises/ContinuousSpeech';
import FullBreath from '../exercises/FullBreath';
import EasyOnset from '../exercises/EasyOnset';
import LightContact from '../exercises/LightContact';
import StretchSpeech from '../exercises/StretchSpeech';

/**
 * This is the Exercise navigator that is used to navigate between
 * different exercise screens. It can be used to add more exercises easily
 * to the existing app navigation.
 */
const ExerciseNavigator = createStackNavigator(
    {
        ExerciseList: {
            screen: ExerciseList,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: "Exercises",
                    headerLeft: () => <Icon style={{paddingLeft: 10}} name="md-menu" size={30} onPress={() => navigation.openDrawer()} />
                }
            }
        },
        ContinuousSpeech: {
            screen: ContinuousSpeech,
            navigationOptions: {
                headerTitle: "Continuous Speech"
            }
        },
        FullBreath: {
            screen: FullBreath,
            navigationOptions: {
                headerTitle: "Full Breath"
            }
        },
        EasyOnset: {
            screen: EasyOnset,
            navigationOptions: {
                headerTitle: "Easy Onset"
            }
        },
        LightContact: {
            screen: LightContact,
            navigationOptions: {
                headerTitle: "Light Contact"
            }
        },
        StretchSpeech: {
            screen: StretchSpeech,
            navigationOptions: {
                headerTitle: "Stretch Speech"
            }
        }
    },
    {
        initialRouteName: "ExerciseList"
    }
);

export default ExerciseNavigator;