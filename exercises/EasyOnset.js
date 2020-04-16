import React from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage, TouchableOpacity } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createExercise } from '../src/graphql/mutations';
import { Video } from 'expo-av';

import config from '../aws-exports'

API.configure(config)             // Configure Amplify
PubSub.configure(config)

class EasyOnset extends React.Component {
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
                      source={require('../assets/Easy_Onset.mp4')}
                      useNativeControls={true}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode="cover"
                      style={{ width: 300, height: 200 }}
                    />
                <Text style={{padding:20}}>
                    Easy Onset reduces abrupt or excessive tension on the vocal folds, 
                    which often leads to blocks. This technique involves a gentle vibration 
                    of your vocal folds (i.e. a quiet voice), followed by a steady and 
                    gradual increase in the strength of these vibrations (i.e. a louder voice). {"\n"}{"\n"}
                    Follow these five steps:{"\n"}
                    (1) Take a slow, full breath in{"\n"}
                    (2) As you exhale, begin “voicing” – i.e. speak very quietly, gently, softly{"\n"}
                    (3) Gradually begin to increase your loudness level{"\n"}
                    (4) Reach a full loudness level (appropriate for normal conversation speech – i.e. not shouting){"\n"}
                    (5) Gradually decrease this loudness level back to your original, gentle voice 
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("Record")}}><Text style={styles.buttonTitle}>Practice Now!</Text></TouchableOpacity>
            </View>
        );
    }
}

export default EasyOnset;

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