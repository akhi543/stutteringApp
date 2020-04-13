import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * The base screen for the exercise that is being practiced.
 * This can be used to show the active exercise that the user
 * is using.
 */
class Current extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>These are your active Exercises</Text>
            </View>
        );
    }
}

export default Current;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});