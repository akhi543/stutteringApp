import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * The base screen for all exercises in the older version of the app.
 * This may be used in a future version to show all exercises in the app.
 */
class All extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>These are all your Exercises</Text>
            </View>
        );
    }
}

export default All;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});