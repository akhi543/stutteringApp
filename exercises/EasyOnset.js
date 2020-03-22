import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class EasyOnset extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Easy Onset</Text>
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