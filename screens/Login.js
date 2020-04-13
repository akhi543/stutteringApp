import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Alert, BackHandler, AsyncStorage, ToastAndroid } from 'react-native';

import Constants from 'expo-constants';

import HandleBack from '../components/HandleBack';

import * as Google from 'expo-google-app-auth';

/**
 * This is the login screen of the app. It has one button that
 * takes the user to Google sign in page which returns a Google user object.
 * This screen is the first screen of the application.
 */
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {signedIn: false, user: null}
  }

  /**
   * This method is used to store the returned Google user object
   * in the local memory using AsyncStorage. This information is used
   * later in the app.
   */
  storeCredential = async () => {
    let obj = {
      name: this.state.user.name,
      email: this.state.user.email,
    }
    try {
      await AsyncStorage.setItem('user', JSON.stringify(obj));
    }
    catch(error) {
      console.log(error);
    }
  }
  
  /**
   * This is the Google sign in method. It uses the Google Client ID to
   * fetch the Google object for the user trying to login.
   * The method returns the Google object if the sign in is successful.
   */
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
        this.storeCredential();
        this.props.navigation.navigate('Access', {
          user: this.state.user
        });
      }
      else {
        console.log('Cancelled');
        ToastAndroid.show('Please try again', ToastAndroid.SHORT);
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
    paddingTop: Constants.statusBarHeight,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -35
  },
  button: {
    backgroundColor: '#7f8c8d',
    opacity: 0.7,
    flexDirection: 'row',
    height: 70,
    paddingTop: 5,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    marginBottom: 100,
    borderRadius: 35
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
