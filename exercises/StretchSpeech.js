import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Text, Button, AsyncStorage, TouchableOpacity } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createExercise } from '../src/graphql/mutations';
import { Video } from 'expo-av';
import Constants from 'expo-constants';

import config from '../aws-exports'

API.configure(config)             // Configure Amplify
PubSub.configure(config)

class StretchSpeech extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user: null
    }
  }
  getData = async () => {
    try {
      let value = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(value);
      this.setState(
        {
          loaded: true,
          user: parsed
        }
      );
    }
    catch(error) {
      console.log(error);
    }
  }
  UNSAFE_componentWillMount() {
    this.getData().done();
  }
  createExerciseEntry = async() => {
    const entryData = {
      userName: this.state.user.name,
      userEmail: this.state.user.email,
      exerciseName: this.props.navigation.state.routeName,
      date: new Date().toDateString(),
      data: "data"
    };
    await API.graphql(graphqlOperation(createExercise, { input: entryData }));
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
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Video
              source={require('../assets/Stretch_Speech.mp4')}
              useNativeControls={true}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              style={{ width: 300, height: 200, marginTop: 20 }}
            />
          <Text style={{padding:20}}>
            In stretched speech, the duration of each sound and syllable is exaggerated beyond normal conversational limits. Stretched speech enhances awareness of motor movements, provides a foundation for fluent speech, and helps shape speech towards normal patterns. All other targets can be done at a stretched rate. {"\n"}{"\n"}
            Follow these steps:{"\n"}
            (1) Each syllable is stretched for 2 seconds (Example: “zip” is a one syllable word, therefore the whole word is pronounced for 2 seconds. “Cupcake” is two syllables, therefore “cup” and “cake” are each held for 2 seconds, and the entire word is held for 4 seconds){"\n"}
            (2) The first sound in the syllable is held for 1 full second (unless the first sound is an “unstretchable sound” – see below). Your mouth should keep still while holding the sound for one second (example: zzzziip, the "zzzz" is held for 1 second. In “cupcake”, the first sound is the unstretchable plosive sound /k/. Therefore, you can use your Light Contact technique on the /k/, and stretch the second vowel sound /u/ for 1 second: cuuuup-caaaaake){"\n"}
            (3) The rest of the syllable gets the other 1 second: "zzzz(1 sec)iiip(1 sec). 
            (4) If you have a word with more than one syllable, you must pause for 1 full second in between syllables and take a Full Breath.

            Make note of “unstretchable sounds”. These include fricatives (“hissing sounds” – CH, S, H, F, SH, TH) and plosives (“popping sounds” – P, B, T, D, K, G). Stretching fricatives leads to excessive air loss, increasing the likelihood of a prolongation. Plosive sounds are physically impossible to stretch, which leads to blocking. For these sounds, use your Light Contact strategy. Note that all vowels are good sounds to stretch!


          </Text>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("Record")}}><Text style={styles.buttonTitle}>Practice Now!</Text></TouchableOpacity>
        </ScrollView >
      </SafeAreaView>
    );
  }
}

export default StretchSpeech;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollview: {
    backgroundColor: '#daedf8',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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