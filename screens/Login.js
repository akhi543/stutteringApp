import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Alert, BackHandler } from 'react-native';

import HandleBack from '../components/HandleBack';

import * as Google from 'expo-google-app-auth';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {signedIn: false, user: null}
  }
  
  signIn = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '655894801958-sb08te86hnp9f02v7jmm04tc7qh8qfjj.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      })

      if (result.type === 'success') {
        this.setState({
          signedIn: true,
          user: result.user,
        })
        this.props.navigation.navigate('Access', {
          user: this.state.user
        });
      }
      else {
        console.log('Cancelled')
      }
    }
    catch (e) {
      console.log('error', e)
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
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <Text style={styles.logoText}>Helps you practice your Speech Exercises</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => this.signIn()}>
              <Text style={styles.buttonTitle}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </HandleBack>
    );
  }
}

export default Login;

const LoginPage = props => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => props.signIn()}>
          <Text style={styles.buttonTitle}>Sign In with Google</Text>
          <Image style={styles.buttonLogo} source={require('../assets/google.png')} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#2c3e50',
    paddingTop: Expo.Constants.statusBarHeight,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120
  },
  logoText: {
    color: '#fff',
    width: 180,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'monospace',
    opacity: 0.4
  },
  buttonContainer: {
    padding: 20,
    marginLeft: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#7f8c8d',
    opacity: 0.7,
    flexDirection: 'row',
    height: 50,
    paddingTop: 5,
    width: 350,
    justifyContent: 'space-evenly',
    marginLeft: 3
  },
  buttonTitle: {
    padding: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18
  },
  buttonLogo: {
    width: 38,
    height: 38,
    marginTop: 2
  }
});
