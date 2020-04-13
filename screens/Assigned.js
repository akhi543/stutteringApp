import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * The base screen for only the exercises that have been assigned to
 * the user by the therapist in the older version of the app.
 * This may be used in a future version to show only assigned exercises of the user.
 */
class All extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>These are all your assigned Exercises</Text>
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