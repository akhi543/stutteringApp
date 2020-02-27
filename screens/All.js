import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

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