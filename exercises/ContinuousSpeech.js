import React from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage, TouchableOpacity } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createExercise } from '../src/graphql/mutations';
import { Video } from 'expo-av';

import config from '../aws-exports'

API.configure(config)             // Configure Amplify
PubSub.configure(config)


class ContinuousSpeech extends React.Component {
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
        console.log("logged in database!");
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
                      source={require('../assets/Continuous_Speech.mp4')}
                      useNativeControls={true}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode="cover"
                      style={{ width: 300, height: 200 }}
                    />
                <Text style={{padding:20}}>Continuous Speech involves maintaining constant voicing from sound to sound within syllables (i.e. keep your vocal folds vibrating the entire time). These slow movements between sounds and syllables will help reduce choppy or jerky speech. Begin with an Easy Onset to help start a new syllable within a word and phrase. This will help prevent blocking mid-word or sentence, and improve speech flow. </Text>
                <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("Record")}}><Text style={styles.buttonTitle}>Practice Now!</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.createExerciseEntry}><Text style={styles.buttonTitle}>Log in db!</Text></TouchableOpacity>
            </View>
        );
    }
}

export default ContinuousSpeech;

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