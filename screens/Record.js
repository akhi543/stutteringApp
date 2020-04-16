import React from 'react';
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  AsyncStorage,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Button } from 'react-native-elements';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../src/graphql/queries';
import { createExercise } from '../src/graphql/mutations';

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_RECORD_BUTTON = new Icon(require('../assets/images/record_button.png'), 70, 119);
const ICON_RECORDING = new Icon(require('../assets/images/record_icon.png'), 20, 14);

const ICON_PLAY_BUTTON = new Icon(require('../assets/images/play_button.png'), 34, 51);
const ICON_PAUSE_BUTTON = new Icon(require('../assets/images/pause_button.png'), 34, 51);
const ICON_STOP_BUTTON = new Icon(require('../assets/images/stop_button.png'), 22, 22);

const ICON_MUTED_BUTTON = new Icon(require('../assets/images/muted_button.png'), 67, 58);
const ICON_UNMUTED_BUTTON = new Icon(require('../assets/images/unmuted_button.png'), 67, 58);

const ICON_TRACK_1 = new Icon(require('../assets/images/track_1.png'), 166, 5);
const ICON_THUMB_1 = new Icon(require('../assets/images/thumb_1.png'), 18, 19);
const ICON_THUMB_2 = new Icon(require('../assets/images/thumb_2.png'), 15, 19);

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#daedf8';
const LIVE_COLOR = '#FF0000';
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;
 
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.wordBank = null;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      exerciseName: null,
      currWord: null,
      recordingDone: false,
      user: null
    };
    this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        'cutive-mono-regular': require('../assets/fonts/CutiveMono-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
    this._askForPermissions();
  }

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted',
    });
  };

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    this.setState({recordingDone: true});
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: false,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  _trySetRate = async (rate, shouldCorrectPitch) => {
    if (this.sound != null) {
      try {
        await this.sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async value => {
    this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
  };

  _onPitchCorrectionPressed = async value => {
    this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
  };

  _onSeekSliderValueChange = value => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(this.state.soundPosition)} / ${this._getMMSSFromMillis(
        this.state.soundDuration
      )}`;
    }
    return '';
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  createExerciseEntry = async() => {
    if(this.state.recordingDone == true) {  
      const entryData = {
          userName: this.state.user.name,
          userEmail: this.state.user.email,
          exerciseName: this.state.exerciseName,
          date: new Date().toDateString(),
          data: "data"
      };
      console.log("[akhiDebug] entryData ==> " + JSON.stringify(entryData));
      await API.graphql(graphqlOperation(createExercise, { input: entryData }));
      Alert.alert(
        'Success!',
        'Recording saved in database..',
        [{
            text: 'OK',
            style: 'cancel',
          }
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert(
        'Recording missing.',
        'Please record first..',
        [{
            text: 'OK',
            style: 'cancel',
          }
        ],
        {cancelable: false},
      );
    }
  }

  getData = async () => {
      try {
          let exName = await AsyncStorage.getItem('exerciseName');
          let exNameParsed = JSON.parse(exName);
          let user = await AsyncStorage.getItem('user');
          let userParsed = JSON.parse(user);
          this.setState({
            exerciseName: exNameParsed,
            user: userParsed
          });
          if(exNameParsed == "ContinuousSpeech") {
          }
          else if(exNameParsed == "EasyOnset") {
            this.wordBank = ["ABANDON","ABANDONMENT","ABDOMEN","ABDUCTION","ABHOR","ABILITY","ABLE","ABOMINABLE","ABOUT","ABOVE","ABRUPT","ABSCESS","ABSOLUTE","ABSOLUTION","ABSTRACTION","ABUNDANCE","ABUNDANT","ABUSE","ACADEMY","ACCELERATION","ACCEPTABLE","ACCIDENT","ACCOMMODATION","ACCOMPLICE","ACCORD","ACCORDANCE","ACCORDION","ACCOUNT","ACCUMULATION","ACCURATE","ACCUSER","ACHE","ACIDITY","ACKNOWLEDGE","ACORN","ACRE","ACROBAT","ACT","ACTIVE","ACTUAL","ACTUALITY","ADAM","ADDER","ADDITION","ADDITIONAL","ADEQUATE","ADHERENCE","ADJECTIVE","ADMINISTRATION","ADMIRAL","ADMIRE","ADMISSION","ADMONISH","ADOLESCENCE","ADORN","ADULT","ADULTERY","ADVANCED","ADVANTAGE","ADVENTURER","ADVERB","ADVERSITY","ADVICE","AERIAL","AFFAIR","AFFECTION","AFFECTIONATE","AFFIRM","AFRAID","AFTER","AFTERNOON","AGAINST","AGE","AGENCY","AGGRESS","AGGRESSIVE","AGGRESSOR","AGILE","AGILITY","AGONY","AGREEMENT","AH","AID","AIL","AIM","AIR","AIRY","AISLE","ALCOHOL","ALE","ALERT","ALGEBRA","ALIAS","ALIEN","ALIMONY","ALIVE","ALKALI","ALL","ALLEGATION","ALLEY","ALLIGATOR","ALLOTMENT","ALLOW","ALLY","ALONE","ALPHABET","ALSO","ALTER","ALTERNATIVE","ALTHOUGH","ALTITUDE","ALUMINIUM","ALUMINUM","ALWAYS","AM","AMATEUR","AMAZEMENT","AMBASSADOR","AMBITION","AMBITIOUS","AMBULANCE","AMBUSH","AMENDMENT","AMMONIA","AMOUNT","AMOUR","AMPLIFIER","AMPLITUDE","AMUSE","AN","ANALOGY","ANALYTIC","ANCHOR","ANCIENT","AND","ANECDOTE","ANGEL","ANGER","ANGLE","ANGRY","ANIMAL","ANKLE","ANNEX","ANNOUNCEMENT","ANNUAL","ANSWER","ANT","ANTAGONISM","ANTICIPATION","ANTIQUE","ANXIETY","ANXIOUS","ANY","ANYBODY","ANYONE","APART","APARTMENT","APATHY","APE","APERTURE","APOLOGY","APPARENT","APPEAL","APPEAR","APPEARANCE","APPENDIX","APPLE","APPLIANCE","APPOINTMENT","APPRAISE","APPRECIATE","APPROACH","APPROVAL","APRICOT","APRON","APT","APTITUDE","ARBITRARY","ARC","ARCH","ARCHERY","ARDENT","ARE","AREA","ARGUE","ARID","ARISE","ARISTOCRACY","ARK","ARM","ARMOR","ARMOUR","ARMY","ARRANGEMENT","ARRAY","ARRIVAL","ARROGANT","ARROW","ART","ARTICLE","ARTIFICIAL","ARTIST","ARTISTIC","AS","ASBESTOS","ASH","ASHAMED","ASPARAGUS","ASPECT","ASPHALT","ASPIRIN","ASSAULT","ASSEMBLE","ASSIST","ASSISTANCE","ASSORTMENT","ASSUMPTION","ASTRONOMY","AT","ATE","ATHLETE","ATHLETICS","ATMOSPHERE","ATOM","ATROCITY","ATTACK","ATTEMPT","ATTEND","ATTENDANT","ATTENTIVE","ATTITUDE","ATTRIBUTE","AUDIENCE","AUDITION","AUDITORIUM","AUNT","AUTHENTIC","AUTHOR","AUTHORITATIVE","AUTOMOBILE","AUTUMN","AVAILABLE","AVALANCHE","AVENUE","AVERAGE","AVID","AWAIT","AWARE","AWAY","AWKWARD","AXE","AXLE","EACH","EAGER","EAGLE","EAR","EARL","EARLY","EARN","EARTH","EARTHWORM","EASE","EASEL","EAST","EASY","EASYGOING","EAT","EATING","EAVES","ECCENTRIC","ECCENTRICITY","ECHO","ECONOMY","EDGE","EDITION","EDUCATION","EDUCATOR","EEL","EERIE","EFFECT","EFFICIENT","EFFORT","EGG","EGO","EGOTISTICAL","EIGHT","ELABORATION","ELBOW","ELECTION","ELECTRICITY","ELEGANT","ELEPHANT","ELF","ELIMINATION","ELLIPSE","ELM","ELOPEMENT","ELSE","EMANCIPATION","EMBEZZLEMENT","EMBRACE","EMBRYO","EMERALD","EMERGENCE","EMERGENCY","EMISSION","EMOTION","EMOTIONAL","EMPEROR","EMPHATIC","EMPIRE","EMPLOYMENT","EMPTY","EMULSION","ENAMEL","ENCOUNTER","END","ENDEAVOUR","ENEMY","ENERGETIC","ENGAGEMENT","ENGINE","ENGINEER","ENLIGHTENMENT","ENOUGH","ENSEMBLE","ENTERING","ENTERPRISE","ENTERPRISING","ENTERTAIN","ENTHUSIASM","ENTHUSIASTIC","ENTIRE","ENTRANCE","ENTREE","ENTRY","ENVELOPE","ENVIOUS","ENVY","EPISODE","EPITAPH","EQUAL","EQUALITY","EQUIPMENT","ERRAND","ERROR","ERUPT","ESCAPE","ESSAY","ESSENCE","ESSENTIAL","ESTABLISHMENT","ESTATE","ESTIMATE","ETERNAL","ETERNITY","ETHER","ETHICAL","EVACUATION","EVALUATE","EVEN","EVENING","EVENT","EVER","EVERGREEN","EVERY","EVIDENCE","EVIL","EVOLUTION","EWE","EXACT","EXACTING","EXAMINATION","EXAMINE","EXASPERATION","EXCELLENT","EXCEPTION","EXCESSIVE","EXCHANGE","EXCISE","EXCITABLE","EXCITEMENT","EXCITING","EXCLUSION","EXCUSE","EXECUTIONER","EXECUTIVE","EXERTION","EXHAUST","EXHAUSTION","EXHIBIT","EXIT","EXPANSE","EXPANSION","EXPEDITION","EXPENSIVE","EXPERIENCE","EXPLANATION","EXPLORATION","EXPOSE","EXPOSURE","EXPRESS","EXPRESSION","EXPULSION","EXTENSIVE","EXTENT","EXTERIOR","EXTERMINATION","EXTRA","EXTRAVAGANT","EXTREME","EXUBERANT","EYE","ICE","ICEBERG","ICICLE","IDEA","IDEAL","IDEALISTIC","IDENTIFICATION","IDIOM","IDLE","IDLENESS","IF","IGNITION","IGNORANCE","IGNORE","ILLITERACY","ILLUSION","IMAGINATION","IMAGINATIVE","IMITATE","IMITATOR","IMMATURE","IMMENSE","IMMENSITY","IMMORTALITY","IMMUNITY","IMPACT","IMPARTIAL","IMPATIENCE","IMPEDIMENT","IMPERFECTION","IMPERSONATION","IMPETUOUS","IMPETUS","IMPORT","IMPORTANCE","IMPORTANT","IMPOSSIBILITY","IMPOSSIBLE","IMPOTENCY","IMPRESSION","IMPRINT","IMPROVE","IMPROVEMENT","IMPUDENT","IMPULSE","IMPULSIVE","IN","INACCURATE","INADEQUATE","INANIMATE","INCAPABLE","INCENSE","INCH","INCIDENT","INCISE","INCLINE","INCOME","INCOMPETENT","INCORRECT","INCREASE","INCREDULITY","INDECISIVE","INDEPENDENCE","INDEPENDENT","INDIAN","INDICATION","INDIFFERENT","INDISCRETION","INDIVIDUAL","INDUCE","INDULGENT","INDUSTRIOUS","INDUSTRY","INEFFICIENCY","INEXPERIENCE","INFANT","INFANTILE","INFANTRY","INFECTION","INFERIOR","INFERNO","INFINITE","INFINITY","INFIRMARY","INFLUENCE","INFORMATION","INFRINGEMENT","INGRATITUDE","INHABITANT","INHALE","INHIBITION","INITIATION","INITIATIVE","INJURY","INK","INN","INNATE","INNOCENCE","INOCULATION","INQUIRY","INQUISITIVE","INSECT","INSECURE","INSIDE","INSIGHT","INSINCERE","INSISTENCE","INSOLENCE","INSOLENT","INSPIRED","INSTANCE","INSTINCT","INSTITUTE","INSTITUTION","INSTRUCTION","INSTRUCTOR","INSTRUMENT","INSUFFICIENCY","INSULT","INSURANCE","INTEGER","INTEGRITY","INTELLECT","INTELLIGENCE","INTENSE","INTENTION","INTEREST","INTERESTING","INTERIOR","INTERMISSION","INTERRUPTION","INTERVIEW","INTIMATE","INTIMATION","INTO","INTOXICATION","INTRODUCTION","INTRODUCTORY","INVADER","INVENTION","INVESTIGATION","INVITATION","INVOICE","INVOLVED","IODINE","ION","IOTA","IRIS","IRON","IRONY","IRREGULARITY","IRRESISTIBLE","IRRIGATION","IRRITABLE","IRRITATION","IS","ISLAND","ISLANDER","ISLE","ISSUE","IT","ITCH","ITEM","ITS","IVORY","IVY","OAK","OAR","OASIS","OAT","OATH","OATMEAL","OBEDIENCE","OBEDIENT","OBESE","OBEY","OBJECT","OBLIQUE","OBLIVION","OBLIVIOUS","OBNOXIOUS","OBSCURE","OBSERVATION","OBSERVER","OBSESSION","OBSTINATE","OBSTRUCTION","OCCASION","OCCASIONAL","OCCUPATION","OCEAN","OCTAGON","OCTOPUS","ODE","ODOUR","OF","OFF","OFFEND","OFFENSIVE","OFFICE","OFFICER","OH","OIL","OKAY","OLD","OLDER","OLIVE","OMEN","ON","ONCE","ONE","ONION","ONLY","ONSLAUGHT","OPAL","OPEN","OPENING","OPINION","OPIUM","OPPONENT","OPPORTUNITY","OPPOSITION","OPTIMISM","OPTIMISTIC","OR","ORAL","ORANGE","ORCHESTRA","ORCHID","ORDER","ORDERLY","ORDINARY","ORGAN","ORIGIN","ORIGINAL","ORIGINALITY","ORIGINATE","ORIGINATOR","ORNAMENT","ORNATE","OSTRICH","OTHER","OTTER","OUNCE","OUR","OUT","OUTBREAK","OUTCOME","OUTFIT","OUTGOING","OUTHOUSE","OUTPOST","OUTPUT","OUTSET","OUTSIDE","OUTSIDER","OUTSPOKEN","OVEN","OVER","OVERCOAT","OVERLAP","OVERPRODUCTION","OVERTONE","OWL","OWN","OWNER","OWNERSHIP","OX","OXIDE","OXYGEN","OYSTER","UGLY","ULCER","UMBRELLA","UMPIRE","UNBELIEF","UNBELIEVER","UNCERTAINTY","UNCLE","UNCLEAN","UNCONCERN","UNDER","UNDERGRADUATE","UNDERSTANDING","UNDERTAKING","UNDERWORLD","UNDOING","UNEASINESS","UNFAIR","UNHAPPINESS","UNIFICATION","UNIFORM","UNION","UNIQUE","UNIT","UNITE","UNIVERSAL","UNIVERSITY","UNJUST","UNKNOWN","UNLIMITED","UNNATURAL","UNPLEASANT","UNPLEASANTNESS","UNPOPULAR","UNREALITY","UNREST","UNSTABLE","UNSUCCESSFUL","UNTIDY","UP","UPHEAVAL","UPHOLSTERY","UPKEEP","UPON","UPRIGHT","UPSET","UPWARDS","URBAN","URN","US","USED","USEFUL","USUAL","UTENSIL","UTTER","UTTERANCE"];
          }
          else if(exNameParsed == "FullBreath") {
          }
          else if(exNameParsed == "LightContact") {
            this.wordBank = ["BABE","BABY","BACK","BACKGROUND","BACTERIA","BAD","BADGE","BAG","BAGPIPE","BAIL","BAKE","BALANCE","BALE","BALL","BALLOON","BALLOT","BANANA","BAND","BANDAGE","BANDIT","BANG","BANK","BANKER","BANNER","BAR","BARE","BARGAIN","BARK","BARN","BARON","BARREL","BASE","BASEMENT","BASHFUL","BASIC","BASIN","BASKET","BASS","BAT","BATH","BATON","BATTLE","BAWL","BAY","BE","BEACH","BEAK","BEAM","BEAN","BEAR","BEARD","BEAST","BEAT","BEAUTIFUL","BEAUTY","BEAVER","BECAME","BECAUSE","BECOME","BED","BEDROOM","BEE","BEECH","BEEF","BEEHIVE","BEEN","BEER","BEET","BEETLE","BEFORE","BEG","BEGAN","BEGGAR","BEGINNING","BEHAVIOUR","BEHIND","BEING","BELIEF","BELL","BELLE","BELLY","BELOVED","BELOW","BELT","BENCH","BEND","BENEFACTOR","BENEFICIAL","BENEFIT","BERET","BERRY","BERTH","BEST","BET","BETRAYAL","BETTER","BEVERAGE","BEWILDERMENT","BIAS","BIB","BIBLE","BID","BIG","BILL","BILLED","BIN","BIOLOGY","BIRCH","BIRD","BIRTH","BISCUIT","BISHOP","BIT","BITE","BITTER","BITTERNESS","BLACK","BLACKSMITH","BLADE","BLAME","BLAND","BLANKET","BLEACH","BLEAK","BLESSING","BLEW","BLIND","BLINK","BLISTER","BLOCK","BLONDE","BLOOD","BLOOM","BLOSSOM","BLOUSE","BLOW","BLUE","BLUEBELL","BLUNDER","BLUNT","BLUSH","BOAR","BOARD","BOAST","BOAT","BOATING","BODY","BOIL","BOISTEROUS","BOLT","BOMB","BOND","BONE","BONUS","BOOK","BOOT","BOOTH","BORDER","BORE","BOREDOM","BORING","BORN","BORNE","BOSOM","BOSS","BOTANY","BOTH","BOTHER","BOTTLE","BOTTOM","BOULDER","BOUNDARY","BOUQUET","BOURBON","BOW","BOWL","BOX","BOY","BRA","BRACELET","BRAIN","BRAKE","BRANCH","BRANDY","BRASS","BRASSIERE","BRAT","BRAVE","BRAVERY","BRAWL","BREAD","BREAK","BREAKFAST","BREAST","BREATH","BRED","BREEZE","BRIBE","BRICK","BRIDGE","BRIEF","BRIGHT","BRILLIANT","BRIM","BRISKET","BRISTLE","BROAD","BROIL","BROKE","BROKEN","BRONZE","BROOK","BROOM","BROTHER","BROWNIE","BRUSH","BRUT","BRUTAL","BRUTALITY","BRUTE","BUBBLE","BUCKET","BUCKLE","BUD","BUDGET","BUFFER","BUILD","BUILDER","BUILDING","BULKY","BULLDOG","BULLET","BUMP","BUNCH","BUNGALOW","BUNNY","BURDEN","BUREAU","BURIAL","BURLAP","BURN","BURNER","BURRO","BURROW","BURY","BUSH","BUSINESS","BUSY","BUSYBODY","BUT","BUTCHER","BUTLER","BUTTER","BUTTERFLY","BUTTON","BUY","BUYER","BY","DAD","DAFFODIL","DAGGER","DAIRY","DAISY","DAMAGE","DAME","DANCE","DANCER","DANCING","DANDELION","DANDRUFF","DANGER","DARE","DARK","DARKNESS","DART","DATE","DAWN","DAY","DAYBREAK","DAYLIGHT","DEAD","DEAL","DEAR","DEATH","DEBATE","DEBT","DEBUT","DECAY","DECEIT","DECISION","DECK","DECOMPOSITION","DECORATE","DECORATED","DECORATION","DECOY","DECREE","DEDUCTION","DEED","DEEP","DEER","DEFACE","DEFEAT","DEFENCE","DEFIANCE","DEFIANT","DEFICIENT","DEFINITION","DEGRADED","DEGREE","DELEGATION","DELIBERATE","DELICATE","DELIGHT","DELIVER","DELTA","DEMOCRACY","DEMOLISH","DEMON","DEMONSTRATION","DENIAL","DENSE","DENT","DENTIST","DEPARTMENT","DEPENDABLE","DEPICT","DEPOSIT","DEPRESSED","DEPRESSION","DEPUTY","DERBY","DERIVATION","DESCRIBE","DESCRIPTION","DESIGN","DESIRE","DESK","DESOLATE","DESPAIR","DESPERATION","DESPISE","DESTROY","DESTROYER","DESTRUCTION","DESTRUCTIVE","DETECTIVE","DETERMINATION","DETERMINE","DETONATION","DEVELOP","DEVELOPMENT","DEVICE","DEVIL","DEVOTION","DEW","DIAL","DIAMOND","DICE","DICTATION","DID","DIE","DIET","DIFFERENCE","DIFFERENT","DIFFUSION","DIGNIFIED","DIGNITY","DILIGENT","DIM","DIME","DIMENSION","DIMPLE","DINER","DINNER","DIP","DIRECTION","DIRT","DIRTY","DISAGREEMENT","DISAPPOINT","DISAPPOINTED","DISASTER","DISAVOW","DISC","DISCHARGE","DISCIPLINE","DISCOLOR","DISCOLOURATION","DISCONNECTION","DISCORD","DISCOVERY","DISCRETION","DISCRIMINATING","DISCUSSION","DISEASE","DISGRACE","DISHONESTY","DISINFECTANT","DISLOCATION","DISMAL","DISMISSAL","DISOBEDIENT","DISPLAY","DISPOSITION","DISPUTE","DISRUPTIVE","DISSECTION","DISTANCE","DISTINCT","DISTINCTION","DISTORTION","DISTRACTION","DISTRESS","DISTURBER","DITCH","DIVE","DIVER","DIVERSITY","DIVIDEND","DIVING","DIVISION","DO","DOCILE","DOCK","DOCTOR","DOE","DOES","DOG","DOLL","DOLLAR","DOME","DOMINATION","DONE","DONOR","DOOR","DOORWAY","DORMITORY","DOT","DOUGH","DOUGHNUT","DOVE","DOWN","DOWNCAST","DOZEN","DRAB","DRAGON","DRAIN","DRAMA","DRAPE","DRAW","DREAD","DREAM","DREAMER","DREARY","DRESS","DRESSER","DRILL","DRINK","DRIVER","DRIZZLE","DROP","DROPPER","DROVE","DRUG","DRUM","DRUNKARD","DRY","DUAL","DUCHESS","DUCK","DUCT","DUEL","DUKE","DULL","DULLNESS","DUMB","DUMMY","DUMP","DUNGEON","DUSK","DUST","DUSTY","DUTY","DWELLER","DWELLING","DYE","DYNAMIC","DYNASTY","GABLE","GAIETY","GAIN","GAIT","GALAXY","GALLANT","GALLERY","GALLON","GAME","GANG","GARBAGE","GARDEN","GARDENIA","GARLIC","GARMENT","GAS","GASKET","GASP","GATE","GAUDY","GAVEL","GEAR","GEESE","GEM","GENDER","GENERAL","GENERATION","GENEROUS","GENIUS","GENTLE","GENTLEMAN","GENUINE","GEOGRAPHICAL","GEOGRAPHY","GERM","GESTURE","GET","GHOST","GIANT","GIDDY","GIFT","GIG","GIN","GINGER","GINGERBREAD","GIRAFFE","GIRDLE","GIRL","GIVE","GIVER","GLACIER","GLAD","GLARE","GLASS","GLEAM","GLIMPSE","GLITTER","GLOBE","GLOOM","GLOOMY","GLORY","GLOVE","GLUM","GLUT","GLUTTON","GNAT","GO","GOAL","GOAT","GOD","GODDESS","GOLD","GOLDEN","GOLF","GONE","GOOD","GOOD","GOODNESS","GOOF","GORILLA","GOSPEL","GOT","GOVERNMENT","GOWN","GRACE","GRACEFUL","GRACIOUS","GRADE","GRADUATE","GRADUATION","GRAFT","GRAMMAR","GRANDFATHER","GRANDMOTHER","GRANNY","GRANULAR","GRAPE","GRAPH","GRAPHIC","GRASS","GRASSHOPPER","GRATE","GRATITUDE","GRAVE","GRAVEL","GRAVITY","GRAVY","GRAY","GRAZE","GREAT","GREATLY","GREED","GREEDILY","GREEDY","GREEN","GREENNESS","GRIEF","GRIEVANCE","GRIND","GRIP","GRISLY","GRIZZLY","GROAN","GROCER","GROIN","GROUND","GROUP","GROVE","GROW","GROWN","GROWTH","GRUDGE","GUARD","GUESS","GUEST","GUIDE","GUILT","GUITAR","GULF","GULLIBLE","GUN","GUSH","GUST","GUTTER","GUY","GYM","GYMNASTICS","KEEN","KEEP","KEEPER","KENNEL","KEPT","KERCHIEF","KERNEL","KEROSENE","KETTLE","KEY","KICK","KID","KILL","KILT","KIND","KINDLE","KINDNESS","KING","KINGDOM","KINK","KISS","KITE","KITTEN","KNEE","KNEW","KNIFE","KNIGHT","KNITTING","KNOB","KNOCKER","KNOLL","KNOW","KNOWLEDGE","KNOWN","KNUCKLE","KU","CABIN","CABINET","CABLE","CACTUS","CAFE","CAGE","CAKE","CALCULUS","CALF","CALL","CALM","CALMNESS","CAME","CAMEL","CAMERA","CAMOUFLAGE","CAMP","CAN","CANADA","CANAL","CANARY","CANCER","CANDID","CANDIDATE","CANDLE","CANDLELIGHT","CANDY","CANE","CANNON","CANOE","CANON","CANTEEN","CAP","CAPABLE","CAPACITY","CAPE","CAPITAL","CAPITOL","CAPSULE","CAPTAIN","CAPTIVE","CAR","CARAT","CARBOHYDRATE","CARBON","CARD","CARDINAL","CARE","CAREER","CAREFREE","CAREFUL","CARELESS","CARGO","CARNATION","CAROL","CARP","CARPET","CARRIAGE","CARROT","CARRY","CART","CARTILAGE","CASE","CASH","CASKET","CAST","CASTE","CASTLE","CASTOR","CASUALTY","CAT","CATASTROPHE","CATERPILLAR","CATFISH","CATHEDRAL","CATTLE","CAUGHT","CAULIFLOWER","CAUSALITY","CAUSE","CAUTIOUS","CAVE","CAVERN","CHAOS","CHAOTIC","CHARACTER","CHEMISTRY","CHLORIDE","CHLORINE","CHOIR","CHORAL","CHORUS","CHRISTMAS","CHROME","CLAIM","CLAM","CLAMMY","CLAMOUR","CLANG","CLARINET","CLASH","CLASP","CLASSIC","CLAW","CLAY","CLEAN","CLEAR","CLEARANCE","CLEAVER","CLEVER","CLIENT","CLIFF","CLINCH","CLINK","CLOAK","CLOCK","CLOSE","CLOSER","CLOSET","CLOTH","CLOTHES","CLOTHING","CLOUD","CLOVE","CLOVER","CLOWN","CLUB","CLUE","CLUMSY","COACH","COAL","COARSE","COAST","COAT","COBWEB","COCK","COCKPIT","COCKTAIL","CODE","COFFEE","COFFIN","COGNITION","COIL","COIN","COKE","COLD","COLLAR","COLLECTION","COLLEGE","COLOGNE","COLONEL","COLONY","COLUMN","COMBINATION","COMBINE","COMBUSTION","COME","COMEDY","COMES","COMET","COMFORT","COMFORTABLE","COMFORTER","COMMAND","COMMANDER","COMMENCE","COMMENCEMENT","COMMERCIAL","COMMITTEE","COMMODE","COMMON","COMMUNICATION","COMMUNITY","COMPACT","COMPANY","COMPARISON","COMPETENCE","COMPETENT","COMPETITION","COMPLACENT","COMPLETE","COMPLICATION","COMPLIMENT","COMPOSER","COMPOSURE","COMPREHENSIVE","COMPRESSION","COMRADE","COMRADESHIP","CONCAVE","CONCEITED","CONCEPT","CONCERN","CONCERT","CONCLUSION","CONCRETE","CONDEMN","CONDITION","CONE","CONFERENCE","CONFIDENCE","CONFIDENT","CONFISCATE","CONFLICT","CONFUSION","CONGRESS","CONJUGATION","CONJUNCTION","CONNOISSEUR","CONQUEST","CONSCIENCE","CONSCIENTIOUS","CONSCIOUS","CONSEQUENCE","CONSERVATION","CONSERVATIVE","CONSIDER","CONSIDERABLE","CONSIDERATION","CONSIST","CONSISTENT","CONSOLATION","CONSPIRATOR","CONSTANT","CONSTITUTION","CONSTRUCTION","CONTACT","CONTAMINATION","CONTENT","CONTENTS","CONTEXT","CONTINENT","CONTINUATION","CONTINUED","CONTRACT","CONTRACTION","CONTRADICTORY","CONTRIBUTION","CONTROL","CONVENT","CONVENTION","CONVEYANCE","COOK","COOKIE","COOL","COOLNESS","COPE","COPPER","CORAL","CORD","CORE","CORK","CORN","CORNER","CORNET","CORPORATION","CORPS","CORPSE","CORRESPONDENT","CORRIDOR","COST","COSTUME","COT","COTTAGE","COTTON","COUCH","COULD","COUNCIL","COUNT","COUNTRY","COURAGE","COURSE","COURT","COURTEOUS","COURTSHIP","COUSIN","COVER","COW","COWARDICE","COWARDLY","COWBOY","COWHIDE","CRAB","CRADLE","CRAFT","CRANBERRY","CRANE","CRANK","CRAWL","CREAM","CREATIVE","CREATOR","CREATURE","CREEPER","CREW","CRIME","CRISIS","CRITERION","CRITICAL","CRITICISM","CROAK","CROCK","CROCODILE","CROOK","CROOKED","CROQUET","CROSS","CROW","CROWD","CROWN","CRUCIFIX","CRUEL","CRUISER","CRUMB","CRUSH","CRUTCH","CRY","CRYSTAL","CUBE","CUCUMBER","CUE","CULT","CULTURE","CUNNING","CUP","CURB","CURE","CURFEW","CURIOSITY","CURLER","CURRENT","CURSE","CURVE","CUSTARD","CUSTOM","CUSTOMARY","CUSTOMER","CUT","QUACK","QUAIL","QUAKE","QUALITY","QUANTITY","QUARREL","QUART","QUARTER","QUEEN","QUEST","QUESTION","QUESTIONABLE","QUICK","QUICKEN","QUICKLY","QUICKNESS","QUIET","QUILL","QUILT","QUIVER","QUOTIENT","PACIFISM","PACKAGE","PACT","PADLOCK","PAGE","PAID","PAIL","PAIN","PAINT","PAINTER","PAINTING","PAIR","PALACE","PALE","PALM","PAN","PANCREAS","PANE","PANIC","PANORAMA","PANTIES","PANTS","PAPER","PARADE","PARADISE","PARADOX","PARAGRAPH","PARALLELOGRAM","PARCEL","PARDON","PARISH","PARK","PARLIAMENT","PART","PARTICIPANT","PARTICULAR","PARTNER","PARTY","PASS","PASSAGE","PASSENGER","PASSING","PASSION","PASSIONATE","PASSIVE","PASSPORT","PAST","PASTE","PASTOR","PASTURE","PAT","PATCH","PATENT","PATH","PATHETIC","PATIENCE","PATIENT","PATRON","PATTERN","PAUL","PAUSE","PAWN","PAYMENT","PEA","PEACE","PEACEFUL","PEACEMAKER","PEACH","PEAL","PEAR","PEARL","PEASANT","PEBBLE","PECK","PEDAL","PEDDLE","PEEK","PEEL","PEEP","PEER","PEG","PELT","PEN","PENCIL","PENDULUM","PENGUIN","PENICILLIN","PENNY","PEON","PEOPLE","PEP","PEPPER","PERCEPTION","PERCH","PERFECT","PERFORMANCE","PERFORMER","PERHAPS","PERIOD","PERIODICAL","PERISH","PERJURY","PERMANENT","PERMISSION","PERMIT","PERSECUTION","PERSISTENT","PERSON","PERSONAL","PERSONALITY","PERSONNEL","PERSUASIVE","PESSIMISTIC","PEST","PET","PETAL","PEW","PHANTOM","PHASE","PHILOSOPHY","PHONE","PHOTOGRAPH","PHRASE","PHYSICIAN","PHYSICS","PIANIST","PIANO","PICK","PICKLE","PICTURE","PIE","PIECE","PIER","PIERCED","PIG","PIGEON","PILE","PILL","PILLOW","PIMPLE","PIN","PINE","PINEAPPLE","PINT","PIONEER","PIOUS","PIPE","PIPING","PISTON","PIT","PITY","PLACE","PLAIN","PLAN","PLANE","PLANET","PLANK","PLANT","PLATE","PLATFORM","PLATTER","PLAUSIBLE","PLAY","PLAYFUL","PLAYING","PLEA","PLEAD","PLEASANT","PLEASING","PLEASURE","PLEDGE","PLENTIFUL","PLIABLE","PLIERS","PLOT","PLUG","PLUM","PLUMB","PLUNGE","POCKET","PODIUM","POET","POETRY","POINT","POISON","POLE","POLICEMAN","POLIO","POLISH","POLITE","POLITICIAN","POLL","POLLEN","POLLUTION","POLO","POND","PONY","POOL","POOR","POPE","POPULAR","POPULATION","PORCH","PORE","PORK","PORT","PORTER","PORTION","PORTRAIT","PORTRAY","POSITION","POSSESSION","POSSESSIVE","POSSIBLE","POST","POSTER","POT","POTATO","POUCH","POUND","POUR","POVERTY","POWDER","POWER","PRACTICAL","PRAIRIE","PRAISE","PRAY","PRAYER","PREACHING","PRECAUTION","PRECEPTION","PRECIOUS","PRECIPITATE","PRECISE","PREDICAMENT","PREDICT","PREFERENCE","PREFIX","PREJUDICE","PRELIMINARY","PRELUDE","PREPARATION","PREPOSITION","PRESENCE","PRESENT","PRESENTABLE","PRESIDENT","PRESSURE","PRESTIGE","PRETENCE","PRETTY","PREVALENT","PREVIOUS","PREY","PRIDE","PRIEST","PRIM","PRIMARY","PRIME","PRINCE","PRINCESS","PRINCIPAL","PRINCIPLE","PRIOR","PRISON","PRISONER","PRIVATE","PRIZE","PROBLEM","PROCESSION","PRODUCE","PRODUCT","PRODUCTION","PRODUCTIVE","PROFESSION","PROFESSIONAL","PROFESSOR","PROFICIENT","PROFILE","PROFIT","PROGRAMME","PROHIBIT","PROJECTILE","PROJECTOR","PROMENADE","PROMISE","PROMISED","PROMISING","PROMOTION","PRONG","PRONOUN","PROOF","PROP","PROPELLER","PROPER","PROPERTY","PROPHET","PROPORTION","PROPRIETOR","PROSECUTOR","PROSPER","PROSPERITY","PROSPEROUS","PROTECTION","PROTEST","PROUD","PROVIDED","PROVINCIAL","PROVISION","PROXY","PRUNE","PSALM","PSYCHOLOGIST","PSYCHOLOGY","PUBLIC","PUDDING","PUDDLE","PULL","PULPIT","PUMP","PUNCH","PUNCTUAL","PUNCTURE","PUNISH","PUNISHABLE","PUNISHMENT","PUNY","PUP","PUPIL","PUPPET","PUPPY","PURE","PURPOSE","PURSE","PUSH","PUT","PUZZLE","PYRAMID","TABLE","TABLESPOON","TACK","TAIL","TAILOR","TAKE","TALE","TALENT","TALENTED","TALES","TALK","TALKATIVE","TALL","TALLY","TAME","TANG","TANGERINE","TANK","TAP","TAPE","TAPER","TAR","TARIFF","TARNISH","TASK","TASTE","TAX","TEA","TEACH","TEACHER","TEAM","TEAR","TECHNICALITY","TEETH","TELEGRAPH","TELEPHONE","TELESCOPE","TELL","TEMPER","TEMPERAMENTAL","TEMPERATURE","TEMPEST","TEMPLE","TEMPT","TEMPTATION","TENDENCY","TENDER","TENNIS","TENSE","TENT","TENTATIVE","TERM","TERRIBLE","TERRITORY","TERROR","TEST","TESTIMONY","TEXT","THAN","THAT","THAW","THE","THEFT","THEIR","THEM","THEME","THEN","THEOLOGIAN","THEORETICAL","THEORY","THERE","THEREFORE","THERMOMETER","THESE","THEY","THICK","THICKET","THIEF","THIMBLE","THIN","THING","THINK","THINKER","THIRSTY","THIS","THISTLE","THORN","THOSE","THOUGHT","THOUGHTFUL","THREAD","THREAT","THREE","THREW","THRIFTY","THRILL","THROAT","THRONG","THROUGH","THROW","THUD","THUMB","THUNDER","THUS","THWART","TICKET","TICKLE","TIDBIT","TIDE","TIDY","TIE","TIGER","TIGHT","TILL","TIMBER","TIME","TIMEPIECE","TIMID","TIN","TIP","TIRE","TIRED","TIRESOME","TITLE","TO","TOAD","TOAST","TOASTER","TOBACCO","TOE","TOGETHER","TOIL","TOILET","TOKEN","TOLD","TOLERANT","TOLL","TOMAHAWK","TOMATO","TOMB","TON","TONGUE","TOO","TOOL","TOOTH","TOP","TOPIC","TOPPED","TORMENT","TORNADO","TORTOISE","TORTURE","TOUCH","TOUGH","TOURIST","TOW","TOWEL","TOWER","TOWN","TOY","TRACE","TRACK","TRACTION","TRACTOR","TRADE","TRADITION","TRAGEDY","TRAIL","TRAILER","TRAIN","TRAINER","TRAITOR","TRANCE","TRANQUIL","TRANSFER","TRANSFORM","TRANSFORMER","TRANSLATION","TRANSPORTATION","TRAPEZE","TRAPEZOID","TRASH","TRAVEL","TRAVELLER","TRAY","TREASON","TREASURER","TREAT","TREATMENT","TREATY","TREE","TREMOR","TREND","TRIAL","TRIANGLE","TRIBE","TRIBUTE","TRICK","TRICYCLE","TRIED","TRIM","TRIP","TRIPOD","TRIUMPH","TRIUMPHANT","TROLLEY","TROMBONE","TROOP","TROUBLE","TROUPE","TROUT","TRUCE","TRUCK","TRUE","TRUISM","TRUMPET","TRUNK","TRUST","TRUSTWORTHY","TRUTH","TRY","TUBE","TUBERCULOSIS","TUCK","TUFF","TULIP","TUMBLE","TUNE","TUNIC","TUNNEL","TURMOIL","TURN","TURNER","TURPENTINE","TURTLE","TUSK","TWANG","TWEED","TWEEZER","TWEEZERS","TWIG","TWILIGHT","TWIST","TWO","TYPE","TYPEWRITER","TYPICAL","TYRANNY","TYRANT"]
          }
          else if(exNameParsed == "StretchSpeech") {
          }
          this.getWord();
      }
      catch(error) {
          console.log(error);
      }
  }

  getWord = async () => {
    let item = null;
    if(this.wordBank != null) {
      let i = Math.floor(Math.random() * this.wordBank.length);
      item = this.wordBank[i];
      this.wordBank.splice(i, 1);
    }
    this.setState({currWord: item});
  }

  showWord() {
    if(this.state.currWord != null) {
      return (
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{"paddingTop": 10, "fontSize": 18}}>Try this word: </Text> 
            <Text style={{"fontSize": 30, "color": "#BF260A"}}>{this.state.currWord}</Text>
          </View>
          <View style={{'alignItems': 'center'}}>
            <TouchableOpacity style={styles.nextWordButton} onPress={this.getWord}><Text style={styles.buttonTitle}>Next word!</Text></TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  UNSAFE_componentWillMount() {
      this.getData().done();
  }

  render() {
    if(!this.state.fontLoaded) {
        return (
            <View style={styles.emptyContainer} />
        )
    }

    if (!this.state.haveRecordingPermissions){
        return (
            <View style={styles.container}>
                <View />
                <Text style={[styles.noPermissionsText, { fontFamily: 'cutive-mono-regular' }]}>
                  You must enable audio recording permissions in order to use this app.
                </Text>
                <View />
            </View>
        )
    }

    return (
      <View style={styles.container}>
        <View style={[styles.halfScreenContainer,{opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,},]}>
        <Text style={{"paddingTop": 30, "fontSize": 23, "color": "#5E106D"}}>{this.state.exerciseName} practice session</Text> 
        {this.showWord()}        
          <View />
          <View style={styles.recordingContainer}>
            <View />
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={this._onRecordPressed}
              disabled={this.state.isLoading}>
              <Image style={styles.image} source={ICON_RECORD_BUTTON.module} />
            </TouchableHighlight>
            <View style={styles.recordingDataContainer}>
              <View />
              <Text style={[styles.liveText, { fontFamily: 'cutive-mono-regular' }]}>
                {this.state.isRecording ? 'Recording..' : ''}
              </Text>
              <View style={styles.recordingDataRowContainer}>
                <Text style={[styles.recordingTimestamp, { fontFamily: 'cutive-mono-regular' }]}>
                  {this._getRecordingTimestamp()}
                </Text>
              </View>
              <View />
            </View>
            <View />
          </View>
          <View />
        </View>
        <View
          style={[
            styles.halfScreenContainer,
            {
              opacity:
                !this.state.isPlaybackAllowed || this.state.isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}>
          <View />
          <View style={styles.playbackContainer}>
            <Slider
              style={styles.playbackSlider}
              trackImage={ICON_TRACK_1.module}
              thumbImage={ICON_THUMB_1.module}
              value={this._getSeekSliderPosition()}
              onValueChange={this._onSeekSliderValueChange}
              onSlidingComplete={this._onSeekSliderSlidingComplete}
              disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
            />
            <Text style={[styles.playbackTimestamp, { fontFamily: 'cutive-mono-regular' }]}>
              {this._getPlaybackTimestamp()}
            </Text>
          </View>
          <View style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}>
            <View style={styles.volumeContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onMutePressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>
                <Image
                  style={styles.image}
                  source={this.state.muted ? ICON_MUTED_BUTTON.module : ICON_UNMUTED_BUTTON.module}
                />
              </TouchableHighlight>
              <Slider
                style={styles.volumeSlider}
                trackImage={ICON_TRACK_1.module}
                thumbImage={ICON_THUMB_2.module}
                value={1}
                onValueChange={this._onVolumeSliderValueChange}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              />
            </View>
            <View style={styles.playStopContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onPlayPausePressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>
                <Image
                  style={styles.image}
                  source={this.state.isPlaying ? ICON_PAUSE_BUTTON.module : ICON_PLAY_BUTTON.module}
                />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onStopPressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>
                <Image style={styles.image} source={ICON_STOP_BUTTON.module} />
              </TouchableHighlight>
            </View>
            <View />
          </View>
          <TouchableOpacity style={styles.logButton} onPress={this.createExerciseEntry}><Text style={styles.buttonTitle}>Save recording?</Text></TouchableOpacity>
          <View style={[styles.buttonsContainerBase, styles.buttonsContainerBottomRow]}>
          </View>
          <View />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topText: {
    paddingTop: 80,
    fontSize: 20
  },
  nextWordButton: {
      backgroundColor: '#3498db',
      opacity: 0.8,
      height: 40,
      width: 150,
      borderRadius: 25,
      justifyContent: 'center',
      margin: 15
  },
  buttonTitle: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 17
  },
  logButton: {
      backgroundColor: '#3498db',
      opacity: 0.8,
      height: 40,
      width: 150,
      borderRadius: 25,
      justifyContent: 'center',
      margin: 15
  },
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
    minHeight: DEVICE_HEIGHT,
    maxHeight: DEVICE_HEIGHT,
  },
  noPermissionsText: {
    textAlign: 'center',
  },
  wrapper: {},
  halfScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: DEVICE_HEIGHT / 2.0,
    maxHeight: DEVICE_HEIGHT / 2.0,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: ICON_RECORD_BUTTON.height,
    maxHeight: ICON_RECORD_BUTTON.height,
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: ICON_RECORD_BUTTON.height,
    maxHeight: ICON_RECORD_BUTTON.height,
    minWidth: ICON_RECORD_BUTTON.width * 3.0,
    maxWidth: ICON_RECORD_BUTTON.width * 3.0,
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: ICON_RECORDING.height,
    maxHeight: ICON_RECORDING.height,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  liveText: {
    color: LIVE_COLOR,
    fontSize: 20
  },
  recordingTimestamp: {
    paddingLeft: 20,
    fontSize: 20
  },
  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
    fontSize: 20
  },
  image: {
    backgroundColor: BACKGROUND_COLOR,
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  playStopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
    maxWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width,
  },
  buttonsContainerBottomRow: {
    maxHeight: ICON_THUMB_1.height,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
});
