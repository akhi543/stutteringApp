import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class StretchSpeech extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Stretch Speech</Text>

            </View>
        );
    }
}

export default StretchSpeech;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});