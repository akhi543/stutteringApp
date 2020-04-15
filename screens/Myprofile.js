import React from 'react';
import { StyleSheet, Text, View, Alert, BackHandler, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { DataTable } from 'react-native-paper';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../src/graphql/queries';

import HandleBack from '../components/HandleBack';

import {
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import Constants from 'expo-constants';

class Myprofile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false, signedIn: true, user: null, exerciseData: null, refreshing: false};
  }
  fetchData = async () => {
    try {
      console.log("refreshing data..");
      let value = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(value);
      let params = {
        filter: {
          userEmail: {
            eq: parsed.email
          }
        },
        limit: 50
      }
      let allExcercises = await API.graphql(graphqlOperation(queries.listExercises, params));
      console.log("allExcercises: " + JSON.stringify(allExcercises) + "\n");
      let currUserData = allExcercises.data.listExercises.items;
      console.log("currUserData: " + JSON.stringify(currUserData) + "\n");
      
      const data = {
          continuousSpeech: currUserData.filter(e => e.exerciseName == "ContinuousSpeech").length,
          easyOnset: currUserData.filter(e => e.exerciseName == "EasyOnset").length,
          fullBreath: currUserData.filter(e => e.exerciseName == "FullBreath").length,
          lightContact: currUserData.filter(e => e.exerciseName == "LightContact").length,
          stretchSpeech: currUserData.filter(e => e.exerciseName == "StretchSpeech").length
      };
      this.setState(
        {
          loaded: true,
          user: parsed,
          exerciseData: data
        }
      );
      this.setState({exerciseData: data});
      console.log("data: " + JSON.stringify(data));
      console.log("data fetched!");
    } catch(error) {
        console.log(error);
    }
  };
  onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
    this.setState({refreshing: false});
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
    this.fetchData().done();
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
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollview} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
          <Image style={styles.img} source={{uri: this.state.user.photoUrl}} />
          <Text style={styles.txt}>Name: {this.state.user.name} </Text>
          <Text style={styles.txt}>Email: {this.state.user.email}</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Exercise Name</DataTable.Title>
              <DataTable.Title numeric>Assigned</DataTable.Title>
              <DataTable.Title numeric>Completed</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
              <DataTable.Cell>Continuous speech</DataTable.Cell>
              <DataTable.Cell numeric>10</DataTable.Cell>
              <DataTable.Cell numeric>{this.state.exerciseData.continuousSpeech}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Easy onset</DataTable.Cell>
              <DataTable.Cell numeric>10</DataTable.Cell>
              <DataTable.Cell numeric>{this.state.exerciseData.easyOnset}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Full Breath</DataTable.Cell>
              <DataTable.Cell numeric>10</DataTable.Cell>
              <DataTable.Cell numeric>{this.state.exerciseData.fullBreath}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Light Contact</DataTable.Cell>
              <DataTable.Cell numeric>10</DataTable.Cell>
              <DataTable.Cell numeric>{this.state.exerciseData.lightContact}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Stretch Speech</DataTable.Cell>
              <DataTable.Cell numeric>10</DataTable.Cell>
              <DataTable.Cell numeric>{this.state.exerciseData.stretchSpeech}</DataTable.Cell>
            </DataTable.Row>    
          </DataTable>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("Login")}}><Text style={styles.buttonTitle}>Lougout</Text></TouchableOpacity>      
        </ScrollView >
      </SafeAreaView>

      </HandleBack>
    );
  }
}

export default Myprofile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#daedf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollview: {
    flex: 1,
    backgroundColor: '#daedf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 16,
    padding: 10,    
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
    fontSize: 20
  },
  img: {
    height: 150, 
    width: 150, 
    borderRadius: 150/ 2
  }
});
