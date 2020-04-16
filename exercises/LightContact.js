import React from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage, TouchableOpacity } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createExercise } from '../src/graphql/mutations';
import { Video } from 'expo-av';

import config from '../aws-exports'

API.configure(config)             // Configure Amplify
PubSub.configure(config)

class LightContact extends React.Component {
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
                      source={require('../assets/Light_Contact.mp4')}
                      useNativeControls={true}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode="cover"
                      style={{ width: 300, height: 200 }}
                    />
                <Text style={{padding:20}}>
                    Light Contact can be used for two categories of consonant sounds:{"\n"}
                    (1) The first group is called fricatives, which includes the “SH, S, F, CH, TH, and H” sounds (i.e. “hissing sounds”). Here, Light Contact involves reducing the amount of airflow pushed through the vocal tract. This will reduce excess air loss on these sounds that may lead to prolongations.{"\n"}
                    (2) The second group of sounds that light contact can be used with are called plosives or stop sounds. They include “P, B, T, D, K, and G” (i.e. “popping sounds”). Light Contact with these sounds involves very gentle contact of the articulators (lips, tongue), or not making full contact at all. This should prevent forceful stoppage of airflow that may lead to blocking. {"\n"}{"\n"}
                    You need to make sure you vocalize fricatives and plosives so that people understand your message. Producing these sounds “lightly” (i.e. with little force or emphasis), will facilitate fluency. 
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("Record")}}><Text style={styles.buttonTitle}>Practice Now!</Text></TouchableOpacity>
            </View>
        );
    }
}

export default LightContact;

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