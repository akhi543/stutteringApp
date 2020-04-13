import React from 'react';
import { Text, StyleSheet, View, Alert, BackHandler, TextInput, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import Constants from 'expo-constants';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../src/graphql/queries';

import HandleBack from '../components/HandleBack';


/**
 * This is the code for the Access screen.
 * The screen is designed to take the Access code of the user
 * as input before granting access to use the application.
 * To ensure privacy, this access code will be privately stored
 * in DynamoDB and can only be read by the client while trying
 * to authorize access.
 */
class Access extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false, signedIn: true, user: null, access: ''};
  }

  /**
   * This function uses AsyncStorage to access the local user
   * information including name and email. This is used to
   * query the database to verify the access code.
   */
  getData = async () => {
    let value = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(value);
    this.setState(
      {
        loaded: true,
        user: parsed
      }
    );
  }

  /**
   * This function has been written to query the database against
   * the user email and verify the access code stored. The navigation is
   * setup so that the user may try a different access code in case
   * the verification fails, or else the user may try another email if
   * the provided email is not present in the database. In such a case, the
   * user will be prompted to be taken back to the login screen.
   */
  onSubmit = async () => {
    
    // This method is used to query the DynamoDB
    const oneTodo = await API.graphql(graphqlOperation(queries.getAccessCode, { userEmail: this.state.user.email }));
    if (oneTodo.data.getAccessCode === null) {
      Alert.alert(
        title="Email address not present",
        message="Please wait for the email to be added. Press exit to close the app or try a different account.",
        buttons=[
          {
            text: "Go Back", onPress: () => {
              this.props.navigation.navigate("Login")
            }
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
    else {
      if (this.state.access === oneTodo.data.getAccessCode.accessCode) {
        this.props.navigation.navigate("Dashboard", {
          user: this.state.user,
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
  
  UNSAFE_componentWillMount() {
    this.getData().done();
  }
  render() {
    if (this.state.loaded === false) {
      return (
        <View style={styles.container}>
          <Text>Loading screen...</Text>
        </View>
      )
    }
    return (
        <HandleBack onBack={this.onBack}>
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Hi {this.state.user.name}, welcome to the Stuttering App. Please enter your unique Access code for the email address {this.state.user.email} to enter:</Text>
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

export default Access;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
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
