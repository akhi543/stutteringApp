import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * Empty component that may be reused in the dashboard of the app.
 */
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