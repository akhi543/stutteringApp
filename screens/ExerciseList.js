import React from 'react';
import { StyleSheet, Text, View, Alert, BackHandler, TouchableOpacity } from 'react-native';

import HandleBack from '../components/HandleBack';

class ExerciseList extends React.Component {
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
          <Text style={styles.title}>Exercises</Text>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("ContinuousSpeech")}}><Text style={styles.buttonTitle}>Continuous Speech</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("EasyOnset")}}><Text style={styles.buttonTitle}>Easy Onset</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("FullBreath")}}><Text style={styles.buttonTitle}>Full Breath</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("LightContact")}}><Text style={styles.buttonTitle}>Light Contact</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("StretchSpeech")}}><Text style={styles.buttonTitle}>Stretch Speech</Text></TouchableOpacity>
        </View>
      </HandleBack>
    );
  }
}

export default ExerciseList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#34495e',
    fontSize: 30,
    margin: 20
  },
  button: {
    backgroundColor: '#3498db',
    opacity: 0.8,
    height: 40,
    width: 200,
    borderRadius: 25,
    justifyContent: 'center',
    margin: 15
  },
  buttonTitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17
  }
});
