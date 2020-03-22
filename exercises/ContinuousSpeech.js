import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class ContinuousSpeech extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Continuous Speech</Text>

            </View>
        );
    }
}

export default ContinuousSpeech;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});