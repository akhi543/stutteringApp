import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class Dashboard extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Dashboard Screen</Text>

            </View>
        );
    }
}

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});