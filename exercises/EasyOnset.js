import React from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createExercise } from '../src/graphql/mutations';

import config from '../aws-exports'

API.configure(config)             // Configure Amplify
PubSub.configure(config)

/**
 * This is the class for the Easy Onset Exercise.
 * The screen provides video exemplar as well as a written
 * description of the exercise for the user.
 */
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
        }
        catch(error) {
            console.log(error);
        }
    }
    UNSAFE_componentWillMount() {
        this.getData().done();
    }

    /**
     * This method communicates with the DynamoDB and creates a new
     * item in the Exercise table. The metadata it stores is used to
     * determine various stats about the user.
     */
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
                <Text style={{marginVertical: 10}}>Easy Onset</Text>
                <Button title="Submit" onPress={this.createExerciseEntry}></Button>
            </View>
        );
    }
}

export default EasyOnset;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});