import React from 'react';
import { StyleSheet, Text, View, Alert, BackHandler } from 'react-native';

import HandleBack from '../components/HandleBack';

/**
 * This is the base for the social component of the app.
 */
class Social extends React.Component {
  onBack = () => {
    Alert.alert(
      "You are about to exit the application.",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel", onPress: () => {}, style: 'cancel'
        },
        {
          text: "Exit", onPress: () => {
            BackHandler.exitApp()
          }
        }
      ],
      { cancelable: false },
    );
    
    return true;
  }
  render() {
    return (
      <HandleBack onBack={this.onBack}>
        <View style={styles.container}>
          <Text>Social</Text>
        </View>
      </HandleBack>
    );
  }
}

export default Social;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
