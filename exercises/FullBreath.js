import React from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage, TouchableOpacity } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createExercise } from '../src/graphql/mutations';
import { Video } from 'expo-av';

import config from '../aws-exports'

API.configure(config)             // Configure Amplify
PubSub.configure(config)

class FullBreath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            user: null
        }
    }
    getData = async () => {
        try {
            let value = await AsyncStorage.getItem('user');
            let parsed = JSON.parse(value);
            this.setState(
                {
                    loaded: true,
                    user: parsed
                }
            );
            await AsyncStorage.setItem('exerciseName', JSON.stringify(this.props.navigation.state.routeName));
        }
        catch(error) {
            console.log(error);
        }
    }
    UNSAFE_componentWillMount() {
        this.getData().done();
    }
    createExerciseEntry = async() => {
        const entryData = {
            userName: this.state.user.name,
            userEmail: this.state.user.email,
            exerciseName: this.props.navigation.state.routeName,
            date: new Date().toDateString(),
            data: "data"
        };
        await API.graphql(graphqlOperation(createExercise, { input: entryData }));
    }
    render() {
        if (this.state.loaded === false) {
            return (
                <View style={styles.container}>
                    <Text>Loading screen...</Text>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <Video
                      source={require('../assets/Full_Breath.mp4')}
                      useNativeControls={true}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode="cover"
                      style={{ width: 300, height: 200 }}
                    />
                <Text style={{padding:20}}>
                    Full Breath is a complete and controlled inhalation-exhalation cycle. 
                    The purpose of this technique is to correct learned faulty breathing 
                    patterns that may hinder proper speech production. The diaphragm is 
                    the major muscle to focus on – pay particular attention to it’s smooth 
                    upward movement (stomach moves out) and downward movement (stomach moves in). {"\n"}{"\n"}
                    Follow these three steps: {"\n"}
                    (1) Take a slow breath in through your mouth (should feel your stomach moving out){"\n"}
                    (2) At the top of your inhalation, try not to pause or hold your breath before you exhale{"\n"}
                    (3) Let air out passively as you begin speaking (should feel you stomach naturally move back in without forcing it back in)

                </Text>
                <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("Record")}}><Text style={styles.buttonTitle}>Practice Now!</Text></TouchableOpacity>
            </View>
        );
    }
}

export default FullBreath;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#daedf8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        opacity: 0.8,
        height: 40,
        width: 200,
        borderRadius: 25,
        justifyContent: 'center',
        margin: 15
    },
    buttonTitle: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 17
    }
});