import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class FullBreath extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Full Breath</Text>

            </View>
        );
    }
}

export default FullBreath;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});