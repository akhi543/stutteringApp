import React from 'react';
import { Text, StyleSheet, View, Alert, BackHandler, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';

import HandleBack from '../components/HandleBack';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {signedIn: true, name: this.props.navigation.state.params.name, access: ''};
  }
  onSubmit = () => {
    if (this.state.access === "1234") {
      this.props.navigation.replace("Home", {
        name: this.state.name,
      });
    }
    else {
      Alert.alert(
        title="Sorry, the access code you entered is incorrect.",
        message="Try again or press exit to close the app.",
        buttons=[
          {
            text: "Enter another code", onPress: () => {}, style: 'cancel'
          },
          {
            text: "Exit", onPress: () => {
              BackHandler.exitApp()
            }
          }
        ],
        options={cancelable: false}
      )
    }
  }
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
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Hi {this.state.name}, welcome to the Stuttering App. Please enter your unique Access code to enter:</Text>
              </View>
              <View style={styles.button}>
                <TextInput
                  onSubmitEditing={this.onSubmit}
                  placeholder="Unique access code"
                  style={styles.input}
                  returnKeyType="go"
                  keyboardType="number-pad"
                  value={this.state.access}
                  onChangeText={(access) => this.setState({access})}
                />
                <Button
                  title='Submit'
                  onPress={this.onSubmit}
                />
              </View>
            </KeyboardAvoidingView>
        </HandleBack>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Expo.Constants.statusBarHeight,
    padding:20,
  },
  titleContainer: {
    width: '90%',
    marginBottom: 50,
    marginTop: -50
  },
  title: {
    textAlign: 'justify',
    fontFamily: 'monospace',
  },
  button: {
      width: '70%',
      marginTop: 50
  },
  input: {
    height: 40,
    color: '#fff',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    marginBottom: 20
  }
});
