import React from 'react';
import { StyleSheet, View, Text, Alert, BackHandler } from 'react-native';
import { Button } from 'react-native-elements';

import HandleBack from '../components/HandleBack';

class Home extends React.Component {
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
            <View style={styles.button}>
                <Button
                    title='View current'
                    onPress={() => this.props.navigation.navigate("Current")}
                />
            </View>
            <View style={styles.button}>
                <Button
                    title='View all'
                    onPress={() => this.props.navigation.navigate("All")}
                />
            </View>
        </View>
      </HandleBack>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Expo.Constants.statusBarHeight
  },
  button: {
      width: '50%',
      height: 40
  }
});
