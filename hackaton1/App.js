// ------------------------
// Imports
// ------------------------
import React, { useState,useRef, useEffect,createContext, useContext, useMemo } from 'react';  
import {  
  View,  
  Text,  
  TextInput,  
  TouchableOpacity,  
  StyleSheet,  
  ScrollView,  
  Alert,  
  Image,  
  Modal,  
  SafeAreaView,  
  Dimensions,  
  Platform,
  Animated,
  useWindowDimensions,
  ImageBackground,
  Pressable,
  Vibration,
  PanResponder
} from 'react-native';  
import { NavigationContainer } from '@react-navigation/native';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';  
import {  
  createDrawerNavigator,  
  DrawerContentScrollView,  
  DrawerItem,  
} from '@react-navigation/drawer';  
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'react-native';
import scienceImage from './assets/images/subjects/science.png';
import Svg, { Path, G } from 'react-native-svg';
import { useFonts as usePoppins, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { useFonts as useSquada, SquadaOne_400Regular } from '@expo-google-fonts/squada-one';
import AppLoading from 'expo-app-loading';

const ScoreContext = createContext();

const ScoreProvider = ({ children }) => {
  const [totalScore, setTotalScore] = useState(0);

  const addToTotalScore = (points) => {
    setTotalScore(prev => prev + points);
  };

  const resetTotalScore = () => {
    setTotalScore(0);
  };

  return (
    <ScoreContext.Provider value={{ totalScore, addToTotalScore, resetTotalScore }}>
      {children}
    </ScoreContext.Provider>
  );
};
const Stack = createNativeStackNavigator();  
const Drawer = createDrawerNavigator();  

const { height, width } = Dimensions.get('window');
const cardWidth = width < 500 ? width * 0.8 : width / 4 - 20;
const boardSize = Math.min(width * 0.9, 360);
const cellSize = boardSize / 6;

  const subjectGames = {
  MATH: [
    { id: 1, title: 'Snake & Ladders: Math Edition', description: 'Players roll dice to move, but must solve a math problem to climb ladders or avoid snakes! (e.g., “Solve 8x7 to climb ladder”).', image: 'https://th.bing.com/th/id/R.9815f360000e51b5fac089785b9616d5?rik=DVXP6lUTMK5JdQ&riu=http%3a%2f%2fst.depositphotos.com%2f1508955%2f4164%2fv%2f950%2fdepositphotos_41642213-stock-illustration-snakes-and-ladders-board-game.jpg&ehk=jPO0gAvEj6KjCZ0ZRist3DajdSdpkJduRczu86%2fyU4U%3d&risl=&pid=ImgRaw&r=0' },
    { id: 2, title: 'Fraction Pizza Game', description: 'Slice pizzas into fractions to match given problems (great for visuals and interaction).', image: 'https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/15566061/tomato-pizza-fractions-4-6-clipart-sm.png' },
  ],
  ENGLISH: [
    { id: 3, title: 'Word Scramble', description: 'Unscramble jumbled letters to form words.', image: 'https://th.bing.com/th/id/R.4434a941802452ffb58268b41b9391ee?rik=h%2fTLdrgE6iBNJA&riu=http%3a%2f%2fwww.chinmayakids.org%2fwp-content%2fthemes%2ftwentyfifteen%2fimages%2fgods-scramble.png&ehk=AqYVwtlM67DwTqpUfeMljtw8xpJTiS6Ofgx%2b5wFboI4%3d&risl=&pid=ImgRaw&r=0' },
    { id: 4, title: 'Grammar Quest', description: 'Choose the correct grammar in a sentence (MCQ).', image: 'https://st2.depositphotos.com/2228340/5812/i/950/depositphotos_58126803-stock-photo-grammar-background.jpg' },
  ],
  SCIENCE: [
    { id: 5, title: 'Science Trivia', description: 'Multiple-choice trivia questions.', image: 'https://cdn.slidesharecdn.com/ss_thumbnails/scitrivia-161220042155-thumbnail-4.jpg?cb=1482207799' },
    { id: 6, title: 'Periodic Table Puzzle', description: 'Match symbols with element names.', image: 'https://www.thoughtco.com/thmb/yOh5Z_Qx6wq_Ft9tMLw98L31v3g=/4385x4385/filters:no_upscale():max_bytes(150000):strip_icc()/helium-chemical-element-186450350-5810ee405f9b58564c67cefe.jpg' },
  ],
  FILIPINO: [
    { id: 7, title: 'Bugtong Quiz', description: 'Guess the riddle (bugtong) from clues.', image: 'https://assets.rappler.com/612F469A6EA84F6BAE882D2B94A4B421/img/1422757CE25B491CA2C01D2C69468154/bugtong-tues-640.png' },
    { id: 8, title: 'Kahulugan Match', description: 'Match words with their meanings (kahulugan).', image: 'https://screens.cdn.wordwall.net/800/fcdb0002eaa44a5290e69dccaf298f0b_41' },
  ],
  AP: [
    { id: 9, title: 'Who Am I? Heroes Edition', description: 'Guess the hero based on clues.', image: 'https://th.bing.com/th/id/R.d3dd0f3e5ff20461e1206a4e53adee50?rik=Xlw0nXuUYzFKWQ&riu=http%3a%2f%2fnewsline.ph%2fwp-content%2fuploads%2f2017%2f09%2fheroes1.jpg&ehk=Ru957AiJHCdTXAGEcQ8u2ZE9Pe8eqihjpYXX3jhGshY%3d&risl=&pid=ImgRaw&r=0' },
    { id: 10, title: 'Fact or Myth: History Edition', description: 'Identify historical facts vs myths.', image: 'https://static.vecteezy.com/system/resources/previews/011/913/642/original/fact-vc-myth-poster-battle-of-realism-and-fantasy-honest-evidence-against-invented-deception-vector.jpg' },
  ],
  ESP: [
    { id: 11, title: 'Virtue Match', description: 'Match situations with the right virtues (e.g., honesty, respect).', image: 'https://as2.ftcdn.net/v2/jpg/03/78/57/61/1000_F_378576172_GjEOQop5TPmGZvQv7rXCWDRP8RnXU0Zb.jpg' },
    { id: 12, title: 'Role Play Scenarios', description: 'Choose responses to peer or family situations.', image: 'https://www.grammar-monster.com/images/role-play-scenarios-for-students.png' },
  ],
  TLE: [
    { id: 13, title: 'Tool Identification Game', description: 'Match pictures of tools with names (e.g., carpentry, cooking).', image: 'https://torontocaribbean.com/wp-content/uploads/2019/11/Depositphotos_198562496_l-2015.jpg' },
    { id: 14, title: 'Safety Symbol Quiz', description: 'Identify safety symbols and their meanings.', image: 'https://th.bing.com/th/id/R.fb4a5bc88f94b58d46ee930b06a4e590?rik=5hOOVfQ07elBqg&riu=http%3a%2f%2fwww.clipartbest.com%2fcliparts%2f9ip%2f69g%2f9ip69gbpT.jpg&ehk=s4pH3KQPLaFle4Ico%2fJD05IB4tckyYa6tKeYDNyamRM%3d&risl=&pid=ImgRaw&r=0' },
  ],
  MAPEH: [
    { id: 15, title: 'Art Puzzle', description: 'Complete a jigsaw puzzle of famous artworks.', image: 'https://mediaproxy.salon.com/width/600/https://media.salon.com/2020/05/jigsaw-puzzle-0507201.jpg' },
    { id: 16, title: 'Music Note Match', description: 'Match notes to their names on a staff.', image: 'https://static.vecteezy.com/system/resources/previews/002/249/673/original/music-note-icon-song-melody-tune-flat-symbol-free-vector.jpg' },
  ]
};

// ------------------------
// ENTRY PAGE LAYOUT
// ------------------------
const allGames = Object.values(subjectGames).flat();
const EntryScreen = ({ navigation }) => {
  const [poppinsLoaded] = usePoppins({ Poppins_400Regular });
  const [squadaLoaded] = useSquada({ SquadaOne_400Regular });

  if (!poppinsLoaded || !squadaLoaded) {
    return <AppLoading />;
  }

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#eef5ff', paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
    <ScrollView pagingEnabled showsVerticalScrollIndicator={false}>
  {/* EduQualiTech Intro Section */}
  <View style={[styles.introSection]}>
    <Text style={{fontFamily: 'SquadaOne_400Regular',
  fontSize: 56,
  textAlign: 'center', marginBottom: 20}}>EduQualiTech</Text>

    <View style={styles.rowLayout}>
      <View style={styles.textContainer}>
        <Text style={styles.appSubtitle}>
          "Our mission is to ensure free and accessible educational{"\n"}
          materials for everyone, anytime and anywhere."
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>

        <View style={styles.scrollDownWrapper}>
          <Text style={styles.scrollDownText}>Scroll Down ▼</Text>
        </View>
      </View>

      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/230d79be0b125f236b4e1a13d8e1fc0e' }}
        style={styles.sideImage}
        resizeMode="contain"
      />
    </View>
  </View>

  {/* Donate Section */}
  <View style={styles.donateSection}>
    <View style={styles.donateTitleWrapper}>
      <Text style={styles.donateTitleText}>DONATE BOOKS FOR KIDS</Text>
    </View>
    <View style ={{backgroundColor: '#ffff',
  padding: 20,
  borderRadius: 15,
  marginVertical: 20,
  width: '90%',
  alignSelf: 'center',}}>
    <Text style ={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginTop: 30}}>
      Provide access to education for underprivileged children by donating books.{"\n"}
      Your contribution will help bridge the knowledge gap and inspire a love for learning.
    </Text>

    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginTop: 10, textAlign: 'left', }}>How Your Donation Helps:</Text>
    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginLeft: 20, marginTop: 10,}}>
      • Access to Education: Books will be distributed to children who lack access to resources.{"\n"}
      • Fostering a Love for Reading: Your donation will help children develop essential skills.
    </Text>
</View>
    <View style={styles.donateImagesContainer}>
      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/10c35c7c20e883230f4c8636a3b0b9bf' }}
        style={styles.donateImage}
      />
      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/484026ab585b453006a2cfc4e279fe8a' }}
        style={styles.donateImage}
      />
    </View>

    <TouchableOpacity style={styles.donateButton} onPress={() => navigation.navigate('Donate')}>
      <Text style={styles.buttonText}>DONATE</Text>
    </TouchableOpacity>
  </View>

  {/* Events Section */}
  <View style={styles.eventsSection}>
  <View style={{backgroundColor: '#d4d5d6',
  fontWeight: 'bold',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 25,
  marginBottom: 20,
  alignSelf: 'center',
  elevation: 2,}}>
    <Text style={{fontFamily: 'SquadaOne_400Regular',
  fontSize: 30,
  textAlign: 'center', textShadowColor: '3C3535',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,}}>EVENTS & OUTREACH</Text>
</View>
    <View style={styles.eventsCard}>
      <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 18, fontWeight: 'bold',marginLeft: 20}}>
        Read to Reach: Community Literacy Drive Program
      </Text>
      <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 13, marginLeft: 20, marginTop: 20,}}>
        Join us in bringing education and donated books to underserved communities.
      </Text>
    </View>

    <TouchableOpacity style={styles.eventsButton} onPress={() => navigation.navigate('Events')}>
      <Text style={styles.buttonText}>LEARN MORE</Text>
    </TouchableOpacity>
  </View>
</ScrollView>
</SafeAreaView>
  );
};

// --------------------
// LOG-IN PAGE LAYOUT
// --------------------
const LoginScreen = ({ navigation }) => {  
  return (  
    <View style={styles.container}>  
      <Text style={styles.title}>LOG-IN</Text>  
      <TextInput placeholder="Email" style={styles.input} />  
      <TextInput placeholder="Password" secureTextEntry style={styles.input} /> 
      <TouchableOpacity  
        style={{backgroundColor: '#289AC4',  
    paddingVertical: 10,  
    borderRadius: 8,  
    marginTop: 10,  }}  
        onPress={() => navigation.navigate('DrawerHome')}>  
        <Text style={styles.buttonText}>Log-In</Text>  
      </TouchableOpacity>  
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>  
            <Text style={{color: '#000000',  
    marginTop: 15,  
    textAlign: 'center',  
    }}>Don't have an account? <Text style={{color: '#1215C9'}}>Sign Up</Text></Text>  
          </TouchableOpacity>  
    </View>  
  );  
};  
const VerificationModal = ({ visible, onClose, onSubmit, code, setCode, inputs }) => {  
  return (  
    <Modal visible={visible} transparent animationType="slide">  
      <View style={styles.modalContainer}>  
        <View style={styles.modalContent}>  
          <Text style={styles.title}>Enter Verification Code</Text>  
          <View style={styles.codeRow}>  
            {Array(6).fill().map((_, index) => (  
              <TextInput  
                key={index}  
                ref={inputs[index]}  
                style={styles.codeBox}  
                keyboardType="numeric"  
                maxLength={1}  
                value={code[index] || ''}  
                onChangeText={(text) => {  
                  const newCode = code.split('');  
                  newCode[index] = text;  
                  setCode(newCode.join(''));  
                  if (text && index < 5) inputs[index + 1]?.current?.focus();  
                }}  
                onKeyPress={({ nativeEvent }) => {  
                  if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {  
                    inputs[index - 1]?.current?.focus();  
                  }  
                }}  
              />  
            ))}  
          </View>  
          <TouchableOpacity style={styles.button} onPress={onSubmit}>  
            <Text style={styles.buttonText}>SUBMIT</Text>  
          </TouchableOpacity>  
        </View>  
      </View>  
    </Modal>  
  );  
};  

// ------------------------
// SIGN UP PAGE LAYOUT
// ------------------------
const SignupScreen = ({ navigation }) => {  
  const [showModal, setShowModal] = useState(false);  
  const [code, setCode] = useState('');  
  const inputs = Array(6).fill().map(() => useRef(null));  
  
  const handleSignup = () => setShowModal(true);  
  
  const verifyCode = () => {  
    Alert.alert('Verified!', 'You can now login.');  
    setShowModal(false);  
    navigation.navigate('Login', { openLogin: true });  
  };  
  
  return (  
    <View style={styles.container}>  
      <Text style={styles.title}>Sign Up</Text>  
  
      <TextInput placeholder="Name" style={styles.input} />  
      <TextInput placeholder="Age" style={styles.input} keyboardType="numeric" />  
      <TextInput placeholder="Gender" style={styles.input} />  
      <TextInput placeholder="Year/Section" style={styles.input} />  
      <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" />  
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />  
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />  
  
      <TouchableOpacity style={{backgroundColor: '#289AC4',  
    paddingVertical: 10,  
    borderRadius: 8,  
    marginTop: 10,  }} onPress={handleSignup}>  
        <Text style={styles.buttonText} >SIGN-UP</Text>  
      </TouchableOpacity>  
  
      <VerificationModal  
        visible={showModal}  
        onClose={() => setShowModal(false)}  
        onSubmit={verifyCode}  
        code={code}  
        setCode={setCode}  
        inputs={inputs}  
      /> 

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>  
            <Text style={{color: '#000000',  
    marginTop: 15,  
    textAlign: 'center',  
    }}>Already have an account? <Text style={{color: '#1215C9'}}>Log-In</Text></Text>  
          </TouchableOpacity>  
    </View>  
  );  
};

// ------------------------
// DONATE PAGE LAYOUT
// ------------------------
const DonateScreen = ({ navigation }) => (  
  <ScrollView contentContainerStyle={{backgroundColor: '#d1d1d1'}}>  
    <TouchableOpacity onPress={() => navigation.navigate('Entry')} >  <View style={{backgroundColor: '#ffff',  
    paddingVertical: 3,
    paddingHorizontal: 7,    
    borderRadius: 8,  
    marginTop: 10,
    marginRight: 20,
    marginBottom: 20,
    alignSelf: 'flex-end'}}>
      <Text style={{textAlign: 'center',fontFamily: 'Poppins_400Regular', fontSize: 12, fontWeight: 'bold'  }}>BACK →</Text> 
      </View> 
    </TouchableOpacity> 
    <View style={styles.donateTitleWrapper}> 
    <Text style={styles.donateTitleText}>DONATE BOOKS FOR KIDS</Text>
    </View>
    <View style ={{backgroundColor: '#ffff',
  padding: 20,
  borderRadius: 15,
  marginVertical: 20,
  width: '90%',
  alignSelf: 'center',}}>  
    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginTop: 10, textAlign: 'left', }}>  
      Thank you for your interest in our Donation Books Program! We accept donations of gently used books for all ages—children’s books, textbooks, novels, and educational materials.{"\n\n"}Drop-off Location:{"\n"}  
      EduQualiTech Donation Center, #23 Mabini St, San Pedro, Laguna{"\n"}Mon–Fri, 9AM–5PM  
    </Text>  
    

    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginTop: 10, textAlign: 'left', }}>Your Donation will go to:</Text>
    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginLeft: 20, marginTop: 10,}}>
      • 📖 Underprivileged people{"\n"}
      • 📚 Community learning centers{"\n"}
      • 📘 Literacy advocacy groups
    </Text>
    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginTop: 10, textAlign: 'left', }}>✅ How to Donate:</Text>
    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginLeft: 20, marginTop: 10,}}>
      1. Check that your books are in good condition (no missing pages or heavy damage).{"\n"}
      2. Pack them securely in a box.
      3. Drop them off at our main office or schedule a pickup.
    </Text>
    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginTop: 10, textAlign: 'left', }}>📅 We accept donations every Monday to Friday, from 9:00 AM to 5:00 PM.</Text>

    <Text style ={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginTop: 30}}>
      📍 Drop-off Location:{"\n"}
      EduqualiTech - Donation Center
    </Text>
    <Text style={{fontFamily: 'Poppins_400Regular', fontSize: 17, marginLeft: 20, marginTop: 10,}}>
      📌 #23 Mabini Street, Brgy. Malinis, San Pedro, Laguna{"\n"}
      🕘 Open Monday to Friday, 9:00 AM – 5:00 PM
       📞 Contact us at: (0912) 345-6789 or eduqualitech.donate@gmail.com
    </Text>
    </View>
  </ScrollView>  
);  

// ------------------------
// EVENT PAGE LAYOUT
// ------------------------
const EventsScreen = ({ navigation }) => (  
  <ScrollView style={{ flex: 1, backgroundColor: '#d1d1d1' }} 
  contentContainerStyle={{ paddingBottom: 30 }}>
  <TouchableOpacity onPress={() => navigation.navigate('Entry')}>
    <View style={{
      backgroundColor: '#ffff',
      paddingVertical: 3,
      paddingHorizontal: 7,
      borderRadius: 8,
      marginTop: 10,
      marginRight: 20,
      marginBottom: 20,
      alignSelf: 'flex-end'
    }}>
      <Text style={{
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        fontWeight: 'bold'
      }}>BACK →</Text>
    </View>
  </TouchableOpacity>

  <View style={styles.donateTitleWrapper}>
    <Text style={styles.donateTitleText}>
      EVENTS & OUTREACH
    </Text>
  </View>

  <View style={{
    backgroundColor: '#ffff',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center'
  }}>
    <Text style={{
      fontFamily: 'Poppins_400Regular',
      fontSize: 17,
      marginTop: 10,
      textAlign: 'left'
    }}>
      Be part of our mission!{"\n\n"}
      📅 **Event Schedule:**{"\n"}
      • April 20 – Brgy. San Isidro{"\n"}
      • April 27 – Brgy. Malaya{"\n"}
      • May 4 – Bagong Pag-asa{"\n\n"}
      Volunteers and donations are welcome at every stop. For inquiries, contact us at:{"\n"}
      📞 (0912) 345-6789{"\n"}
      ✉️ eduqualitech.events@gmail.com
    </Text>
  </View>
</ScrollView>
);  
  
  
// Section titles for navigation  
const sectionTitles = [  
  'Home',  
  'Materials',  
  'Games',  
  'Support',   
  'Help & FAQ',  
];




// Drawer content to scroll to sections  
let unsubscribeRef = null; // put this outside CustomDrawerContent if possible

const CustomDrawerContent = ({ navigation, scrollRefs }) => (
  <DrawerContentScrollView>
    {sectionTitles.map((title, index) => (
      <DrawerItem
        key={index}
        label={title}
        onPress={() => {
          navigation.closeDrawer();

          if (unsubscribeRef) {
            unsubscribeRef(); // cleanup previous listener if any
            unsubscribeRef = null;
          }

          if (title === 'Redeem') {
            navigation.navigate('Redeem');
          } else {
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;
            if (currentRoute !== 'Main') {
              navigation.navigate('Main');

              unsubscribeRef = navigation.addListener('state', () => {
                const currentRoute = navigation.getState().routes[navigation.getState().index].name;
                if (currentRoute === 'Main') {
                  const sectionRef = scrollRefs.current[title];
                  if (sectionRef && scrollRefs.current.ScrollViewRef) {
                    sectionRef.measureLayout(
                      scrollRefs.current.ScrollViewRef,
                      (x, y) => {
                        scrollRefs.current.ScrollViewRef.scrollTo({ y: y - 50, animated: true });
                      },
                      (err) => console.log('MeasureLayout error:', err)
                    );
                  }
                  unsubscribeRef(); // clean up listener
                  unsubscribeRef = null;
                }
              });
            } else {
              const sectionRef = scrollRefs.current[title];
              if (sectionRef && scrollRefs.current.ScrollViewRef) {
                sectionRef.measureLayout(
                  scrollRefs.current.ScrollViewRef,
                  (x, y) => {
                    scrollRefs.current.ScrollViewRef.scrollTo({ y: y - 50, animated: true });
                  },
                  (err) => console.log('MeasureLayout error:', err)
                );
              }
            }
          }
        }}
      />
    ))}
    {/* Add Redeem manually */}
    <DrawerItem
      label="Redeem"
      onPress={() => {
        navigation.closeDrawer();
        navigation.navigate('Redeem');
      }}
    />
  </DrawerContentScrollView>
);

// ------------------------
// HOME PAGE LAYOUT
// ------------------------ 
const HomeScreen = ({ navigation, scrollRefs }) => {  
const subjects = [  
  { title: 'MATH', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/c8ac682ef6f5f4cb6ae81b8309c49941' },  
  { title: 'SCIENCE', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/99c206c6da676bd508fd47b3f54f1865' },  
  { title: 'ENGLISH', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/e59aa6aab862e8eb87a651e9ed35abab' },  
  { title: 'AP', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/72ebf14ecf8deb94556dd73db778a241' },  
  { title: 'TLE', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/78e26a9db132943b8c6a9d29d8c8ee58' },
  { title: 'FILIPINO', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/77c83e478760e45ceb338dfd441d4897' },
  { title: 'ESP', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/9de7050f6bea6c32ee925b5a60ba427c' },  
  { title: 'MAPEH', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/595b5a66a538afd1c5f8f51624c6eb83' },
];

const supportTeam = [
  {
    name: "John Doe",
    subject: "Math Support",
    image: "https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/201a6fdc37a1147057d586b014036ef5",
    email: "john@example.com",
    phone: "123-456-7890",
    education: [
      { degree: "B.S. Mathematics", institution: "ABC University", year: "2015" },
      { degree: "M.Ed. Education", institution: "XYZ University", year: "2018" }
    ],
    skills: ["Algebra", "Geometry", "Calculus", "Teaching"],
    experience: [
      { role: "Math Teacher", company: "XYZ High School", years: "2018-2024", description: "Taught algebra and geometry." },
      { role: "Tutor", company: "Private", years: "2015-2018", description: "Helped students improve grades." }
    ],
    achievements: ["Teacher of the Year 2022", "Published math workbook"]
  },
  {
    name: "Jane Smith",
    subject: "Science Support",
    image: "https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/87706aa7658281e232c8c957afb6d7f0",
    email: "jane@example.com",
    phone: "987-654-3210",
    education: [
      { degree: "B.S. Biology", institution: "DEF University", year: "2014" },
      { degree: "M.Sc. Chemistry", institution: "UVW University", year: "2017" }
    ],
    skills: ["Biology", "Chemistry", "Lab Experiments", "Research"],
    experience: [
      { role: "Science Teacher", company: "ABC High School", years: "2017-2024", description: "Conducted lab classes and science fairs." }
    ],
    achievements: ["Published 3 research papers", "Science Fair Mentor 2021"]
  }
];
const scrollRef = useRef(null);

  
const [currentIndex, setCurrentIndex] = useState(0);  
const carouselRef = useRef();  
const [searchText, setSearchText] = useState('');  
const [viewAll, setViewAll] = useState(false);  
  
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const { width } = useWindowDimensions();
const isDesktop = width >= 768;
const CARDS_PER_VIEW = isDesktop ? 3 : 1;
const SPACING = 19;
const CARD_WIDTH = (width - (SPACING * (CARDS_PER_VIEW - 1)) - 40) / CARDS_PER_VIEW;

const scrollToIndex = (index) => {  
  setCurrentIndex(index);  
  carouselRef.current?.scrollTo({ x: index * 210, animated: true });  
};  
const filteredSubjects = subjects.filter(subject =>  
  subject.title.toLowerCase().includes(searchText.toLowerCase())  
);  
  
const displayedSubjects = viewAll ? filteredSubjects : filteredSubjects.slice(0, 5);  
useEffect(() => {  
  const unsubscribe = navigation.addListener('focus', () => {  
    // Check if we came back with a param asking to scroll to Materials  
    const route = navigation.getState().routes.find(r => r.name === 'Home');  
    if (route?.params?.scrollToMaterials) {  
      const materialRef = scrollRefs.current['Materials'];  
      const scrollViewRef = scrollRefs.current.ScrollViewRef;  
  
      if (materialRef && scrollViewRef) {  
        materialRef.measureLayout(  
          scrollViewRef,  
          (x, y) => {  
            scrollViewRef.scrollTo({ x: 0, y: y, animated: true });  
          }  
        );  
      }  
  
      // Clear the param so it doesn’t scroll again next time  
      navigation.setParams({ scrollToMaterials: false });  
    }  
  });  
  
  return unsubscribe; // cleanup the listener  
}, [navigation]);  


  return (  
  
    
    <SafeAreaView style={{ flex: 1 }}>  
      <View style={styles.navbar}>  
        <TouchableOpacity onPress={() => navigation.openDrawer()}>  
          <Text style={styles.navIcon}>≡</Text>  
        </TouchableOpacity>  
        <Text style={styles.navTitle}>EduQualiTech</Text>  
        <TouchableOpacity
  onPress={() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Entry')
        }
      ]
    );
  }}
>
  <Text style={styles.navIcon}>👤</Text>
</TouchableOpacity>
      </View>  
  
      <ScrollView  
        ref={(ref) => {  
          scrollRefs.current.ScrollViewRef = ref;  
        }}>  
        {sectionTitles.map((title, index) => (
          <View  
            key={index}  
            style={styles.sectionScreen}  
            ref={(ref) => (scrollRefs.current[title] = ref)}>  
             
            {title === 'Home' && (  
              <View>
              <Text style={{fontFamily: 'SquadaOne_400Regular', fontSize: 40, fontWeight: 'bold', justifyContent: 'flex-start', textAlign: 'center'}}>MAKE LEARNING A BREEZE!</Text> 
              <Text style={styles.sectionText}>  
                EXPLORE OUR LIST OF LEARNING MATERIALS JUST FOR YOU.  
              </Text>
              </View>  
            )}  
            

{title === 'Materials' && (  
  <View>
  <Text style={{fontFamily: 'SquadaOne_400Regular', fontSize: 40, fontWeight: 'bold', justifyContent: 'flex-start', textAlign: 'center'}}>LEARNING MATERIALS</Text>   
    <View style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 5 }}>
  <TouchableOpacity
    onPress={() => navigation.navigate('ViewAllSubjects', { subjects })}
    style={{
      backgroundColor: '#4690B3',
      paddingVertical: 6,
      paddingHorizontal: 15,
      borderRadius: 6,
    }}
  >
    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>View All</Text>
  </TouchableOpacity>
</View>

    <ScrollView  
      ref={carouselRef}  
      horizontal  
      showsHorizontalScrollIndicator={false}  
      contentContainerStyle={{  
        paddingHorizontal: 10,  
        alignItems: 'center',  
        paddingVertical: 10,  
      }}  
    >  
      {subjects.map((subject, idx) => (  
        <TouchableOpacity  
          key={idx}  
          style={{  
            width: cardWidth,
            height: height * 0.4,  
            marginRight: 25,  
            backgroundColor: '#fff',  
            borderRadius: 10,  
            overflow: 'hidden',  
            elevation: 3,  
            shadowColor: '#000',  
            shadowOpacity: 0.1,  
            shadowOffset: { width: 0, height: 2 },  
            shadowRadius: 4,  
            padding: 10,  
            alignItems: 'center',  
            justifyContent: 'center'
          }}  
          onPress={() => navigation.navigate('SubjectDetail', { subject })}  
          activeOpacity={0.7}  
        >  
          <Image  
            source={{ uri: subject.image }}  
            style={{ width: '100%', height: '50%', marginBottom: 10 }}  
            resizeMode="contain"  
          />  
          <Text style={{ fontWeight: 'bold', textAlign: 'center', flexDirection: 'row' , fontFamily: 'Poppins_400Regular', textShadowColor: 'rgba(0, 0, 0, 1)', 
    textShadowOffset: { width: 1, height: 1,  },
    textShadowRadius: 1, marginTop: 20}}>
  <Text style={{ fontSize: 30, color: '#4690B3' }}>
    {subject.title.slice(0, Math.floor(subject.title.length / 3))}
  </Text>
  <Text style={{  fontSize: 30,color: '#C45C27' }}>
    {subject.title.slice(Math.floor(subject.title.length / 3), Math.floor((2 * subject.title.length) / 3))}
  </Text>
  <Text style={{  fontSize: 30, color: '#E4BA3C' }}>
    {subject.title.slice(Math.floor((2 * subject.title.length) / 3))}
  </Text>
</Text>
        </TouchableOpacity>  
      ))}  
    </ScrollView>  

    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
      <TouchableOpacity  
        style={{  
          backgroundColor: '#007bff',  
          paddingVertical: 10,  
          paddingHorizontal: 20,  
          borderRadius: 8,  
          marginRight: 10,  
        }}  
        onPress={() => scrollToIndex(Math.max(currentIndex - 1, 0))}  
      >  
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Previous</Text>  
      </TouchableOpacity>  

      <TouchableOpacity  
        style={{  
          backgroundColor: '#007bff',  
          paddingVertical: 10,  
          paddingHorizontal: 20,  
          borderRadius: 8,  
        }}  
        onPress={() => scrollToIndex(Math.min(currentIndex + 1, subjects.length - 1))}  
      >  
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>  
      </TouchableOpacity>  
    </View>  
  </View>  
)}
{title === 'Support' && (
  <View style={{ flex: 1,  }}>
    <Text style={{fontFamily: 'SquadaOne_400Regular', fontSize: 40, fontWeight: 'bold', justifyContent: 'flex-start', textAlign: 'center', marginTop: 20}}>REACH OUT NOW</Text>
    <Animated.ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  snapToInterval={CARD_WIDTH + SPACING}
  decelerationRate="fast"
  contentContainerStyle={{
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    alignItems: 'center',
  }}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false } // or true if only transforming
  )}
  scrollEventThrottle={16}
>
      {supportTeam.map((person, idx) => {
        const inputRange = [
          (idx - 1) * (CARD_WIDTH + SPACING),
          idx * (CARD_WIDTH + SPACING),
          (idx + 1) * (CARD_WIDTH + SPACING),
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1, 0.8],
          extrapolate: 'clamp',
        });

        return (
          <TouchableOpacity
            key={idx}
            onPress={() => console.log('Clicked:', person.name)}
            activeOpacity={0.7}
          >
          <View style={{ alignItems: 'center' }}>
    {/* Floating image */}
    <Image
      source={{ uri: person.image }}
      style={styles.supportCardImage}
      resizeMode="contain"
    />
            <Animated.View
  style={[
    styles.supportCard,
    {
      transform: [{ scale }],
      marginHorizontal: SPACING / 2,
      width: CARD_WIDTH,
    },
  ]}
>
              
              <View style={styles.supportTextContainer}>
              <Text style={styles.supportCardName}>{person.name}</Text>
              <Text style={styles.supportCardSubject}>{person.subject}</Text>
              </View>
              <TouchableOpacity style={styles.supportViewMoreButton}>
                <Text style={styles.supportViewMoreText}
                onPress={() => navigation.navigate('SupportDetail', { person })}>View More</Text>
              </TouchableOpacity>
            </Animated.View>
            </View>
          </TouchableOpacity>
        );
      })}
    </Animated.ScrollView>
  </View>
)}
{title === 'Games' && (
  <View style={{ flex: 1, paddingVertical: 20, backgroundColor: '#f8f9fa' }}>
    <Text style={{fontFamily: 'SquadaOne_400Regular', fontSize: 40, fontWeight: 'bold', justifyContent: 'flex-start', textAlign: 'center'}}>SUBJECT GAMES</Text>

    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          if (currentIndex > 0) {
            scrollRef.current.scrollTo({ x: (currentIndex - 1) * width, animated: true });
            setCurrentIndex(currentIndex - 1);
          }
        }}
        style={{
          padding: 10,
          backgroundColor: '#ddd',
          borderRadius: 20,
          marginRight: 5,
        }}
      >
        <Text style={{ fontSize: 24 }}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {Object.values(subjectGames).flat().map((game, index) => (
          <View
            key={index}
            style={{
              width: width * 0.65,
              height: height *0.5,
              marginHorizontal: width * 0.075,
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 5,
              elevation: 4,
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: game.image }}
              style={{
                width: '100%',
                height: 160,
                borderRadius: 10,
                marginBottom: 12,
              }}
              resizeMode="cover"
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
              {game.title}
            </Text>
            <Text style={{ fontSize: 13, marginVertical: 8, textAlign: 'center', color: '#555' }}>
              {game.description}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#2196f3',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 6,
              }}
              onPress={() =>
                navigation.navigate('GameScreen', {
                  gameId: game.id,
                  gameTitle: game.title,
                  gameDescription: game.description,
                })
              }
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Start</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < Object.values(subjectGames).flat().length) {
              scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
              return nextIndex;
            }
            return prevIndex;
          });
        }}
        style={{
          padding: 10,
          backgroundColor: '#ddd',
          borderRadius: 20,
          marginLeft: 5,
        }}
      >
        <Text style={{ fontSize: 24 }}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
            {title === 'Help & FAQ' && (
  <View style={{ flex: 1, padding: 20 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      
      {/* Left Column - FAQ */}
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>FAQ</Text>
        <View style={{ backgroundColor: '#f5f5f5', borderRadius: 10, padding: 10 }}>
          <Text>• How to sign up?</Text>
          <Text>• How to contact support?</Text>
          <Text>• How to reset password?</Text>
          <TouchableOpacity
  style={{ marginTop: 10, backgroundColor: '#4fc3f7', padding: 10, borderRadius: 5 }}
  onPress={() => navigation.navigate('FAQ')}
>
  <Text style={{ color: 'white', textAlign: 'center' }}>See More</Text>
</TouchableOpacity>
        </View>
      </View>

      {/* Right Column - Help */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>HELP</Text>
        <TouchableOpacity style={{ backgroundColor: '#4fc3f7', padding: 10, borderRadius: 5, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="facebook" size={22} color="white" />
          <Text style={{ color: 'white', textAlign: 'center', marginLeft: 10 }}
          onPress={() => Linking.openURL('https://www.facebook.com/login.php/')}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#4fc3f7', padding: 10, borderRadius: 5, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="facebook-messenger" size={22} color="white" />
          <Text style={{ color: 'white', textAlign: 'center', marginLeft: 10 }}
          onPress={() => Linking.openURL('https://www.messenger.com/')}>Messenger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#4fc3f7', padding: 10, borderRadius: 5, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="viber" size={22} color="white" />
          <Text style={{ color: 'white', textAlign: 'center', marginLeft: 10 }}
          onPress={() => Linking.openURL('https://www.viber.com/en/')}>Viber</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#4fc3f7', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="phone" size={22} color="white" />
          <Text style={{ color: 'white', textAlign: 'center', marginLeft: 10 }}>+63-0945-8753</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={{ marginTop: 20, alignItems: 'center' }}>
      <Text style={{ color: 'gray' }}>© 2025 EduQualiTech. All rights reserved.</Text>
    </View>
  </View>
)}
          </View>  
            ))}
      </ScrollView>  
    </SafeAreaView>  

  
)};  

// ------------------------
// VIEWALLSUBJECTSSCREEN PAGE LAYOUT
// ------------------------
const ViewAllSubjectsScreen = ({ navigation, route }) => {  
  const { subjects } = route.params;  
  
  const [searchText, setSearchText] = useState('');  
  
  const filteredSubjects = subjects.filter(subject =>  
    subject.title.toLowerCase().includes(searchText.toLowerCase())  
  );  
  
  return (  
    <SafeAreaView style={{ flex: 1, padding: 10 }}>  
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, }}>  
        <TouchableOpacity  
          onPress={() => navigation.goBack()}
          style={{ padding: 8 }}  
        >  
          <Text style={{ fontSize: 24 }}>←</Text>  
        </TouchableOpacity>  
        <Text style={{ fontSize: 18, marginLeft: 8, fontWeight: 'bold' }}>All Subjects</Text>  
      </View>  
  
<View style={styles.searchContainer}>  
        <TextInput  
          placeholder="Search subject"  
          value={searchText}  
          onChangeText={setSearchText}  
          style={styles.searchInput}  
        />  
      </View>  
        
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#f0f0f0',  }}>  
        {filteredSubjects.map((subject, index) => ( 
         
          <TouchableOpacity  
            key={index}  
            style={{  
              width: '46%',  
              margin: '2%',  
              backgroundColor: '#ffff',  
              borderRadius: 10,  
              padding: 10,  
              alignItems: 'center',  
              elevation: 3,  
              shadowColor: '#000',  
              shadowOffset: { width: 0,  height: 2 },  
              shadowOpacity: 0.2,  
              shadowRadius: 4,  
            }}  
            onPress={() => navigation.navigate('SubjectDetail', { subject })}
          >  
            <Image  
              source={{ uri: subject.image }}  
              style={{ width: 120, height: 100, borderRadius: 8 }}  
            />  
             <Text style={{ fontWeight: 'bold', textAlign: 'center', flexDirection: 'row' , fontFamily: 'Poppins_400Regular', textShadowColor: 'rgba(0, 0, 0, 1)', 
    textShadowOffset: { width: 1, height: 1,  },
    textShadowRadius: 1,}}>
  <Text style={{ fontSize: 20, color: '#4690B3' }}>
    {subject.title.slice(0, Math.floor(subject.title.length / 3))}
  </Text>
  <Text style={{  fontSize: 20,color: '#C45C27' }}>
    {subject.title.slice(Math.floor(subject.title.length / 3), Math.floor((2 * subject.title.length) / 3))}
  </Text>
  <Text style={{  fontSize: 20, color: '#E4BA3C' }}>
    {subject.title.slice(Math.floor((2 * subject.title.length) / 3))}
  </Text>
</Text>
          </TouchableOpacity>  
          
        ))}  
      </ScrollView>  
    </SafeAreaView>  
  );  
};  

// ------------------------
// REDEEM PAGE LAYOUT
// ------------------------
const RedeemScreen = ({ navigation }) => {
  

  const handleRedeem = (item) => {
    Alert.alert(
      'Success',
      `You have redeemed ${item}. Points deducted successfully. Earn more points to redeem gifts.`
    );
  };

  const handleDonate = (item) => {
    Alert.alert(
      'Thank you!',
      `You have donated ${item}. Earn more points to donate again.`
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.navbar}>  
        <TouchableOpacity onPress={() => navigation.openDrawer()}>  
          <Text style={styles.navIcon}>≡</Text>  
        </TouchableOpacity>  
        <Text style={styles.navTitle}>EduQualiTech</Text>  
        <TouchableOpacity
  onPress={() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Entry')
        }
      ]
    );
  }}
>
  <Text style={styles.navIcon}>👤</Text>
</TouchableOpacity>
      </View>  

      <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#f2f2f2' }}>
  <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: '#333' }}>
    REDEEM REWARDS
  </Text>

  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
    {/* Reward 1 */}
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      width: width * 0.8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    }}>
      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/707aee25cb13af8f24ff776d226ecc1a' }}
        style={{
          height: 150,
          width: width * 0.7,
          resizeMode: 'contain',
          marginBottom: 10,
          alignSelf: 'center'
        }}
      />
    
      <Text style={{ fontSize: 20, color: '#DE8B16', marginBottom: 10 }}>
        500 Points
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#27ae60',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={() => handleRedeem('School Supplies Pack')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Choose</Text>
      </TouchableOpacity>
    </View>

    {/* Reward 2 */}
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      width: width * 0.8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    }}>
      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/215b6a44c435ec617f3574e96685c58a' }}
        style={{
          height: 150,
          width: width * 0.7,
          resizeMode: 'contain',
          marginBottom: 10,
          alignSelf: 'center'
        }}
      />
    
      <Text style={{ fontSize: 20, color: '#DE8B16', marginBottom: 10 }}>
        300 Points
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#27ae60',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={() => handleRedeem('Notebook Bundle')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Choose</Text>
      </TouchableOpacity>
    </View>

    {/* Reward 3 */}
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      width: width * 0.8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    }}>
      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/3b5800489d599d05153ee9356483db32' }}
        style={{
          height: 150,
          width: width * 0.7,
          resizeMode: 'contain',
          marginBottom: 10,
          alignSelf: 'center'
        }}
      />
      
      <Text style={{ fontSize: 20, color: '#DE8B16', marginBottom: 10 }}>
        200 Points
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#27ae60',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={() => handleRedeem('Pencil Set')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Choose</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>

  <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12, color: '#333' }}>
    DONATE TO FOUNDATION
  </Text>

  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {/* Donate 1 */}
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      width: width * 0.8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    }}>
      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/a694168149c6f20b0a62ad8e9e09dff8' }}
        style={{
          height: 150,
          width: width * 0.7,
          resizeMode: 'contain',
          marginBottom: 10,
          alignSelf: 'center'
        }}
      />
       <Text style={{ fontSize: 18, fontWeight: '600', color: '#222', marginBottom: 5 }}>
        Bright Futures for Kids
      </Text>
      <Text style={{ fontSize: 20, color: '#DE8B16', marginBottom: 10 }}>
        300 Points
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#e67e22',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={() => handleDonate('Education Foundation')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Donate</Text>
      </TouchableOpacity>
    </View>

    {/* Donate 2 */}
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      width: width * 0.8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    }}>
      <Image
        source={{ uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/dee8ce4d89632e547f554aaa737a71c0' }}
        style={{
          height: 150,
          width: width * 0.7,
          resizeMode: 'contain',
          marginBottom: 10,
          alignSelf: 'center'
        }}
      />
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#222', marginBottom: 5 }}>
        Feed a Child Program
      </Text>
      <Text style={{ fontSize: 20, color: '#DE8B16', marginBottom: 10 }}>
        400 Points
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#e67e22',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={() => handleDonate('Feed a Child Program')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Donate</Text>
      </TouchableOpacity>
    </View>

    {/* Donate 3 */}
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      width: width * 0.8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    }}>
      <Image
        source={{ uri: 'https://thumbs.dreamstime.com/z/sutter-health-palo-alto-medical-foundation-sign-october-sunnyvale-ca-usa-facilities-san-francisco-bay-area-130733581.jpg' }}
        style={{
          height: 150,
          width: width * 0.7,
          resizeMode: 'cover',
          marginBottom: 10,
          alignSelf: 'center',
          borderRadius: 10
        }}
      />
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#222', marginBottom: 5 }}>
        Medical Aid Fund
      </Text>
      <Text style={{ fontSize: 20, color: '#DE8B16', marginBottom: 10 }}>
        600 Points
      </Text>
    
      <TouchableOpacity
        style={{
          backgroundColor: '#e67e22',
          padding: 10,
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={() => handleDonate('Medical Aid Fund')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Donate</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
</ScrollView>
    </SafeAreaView>
  );
};


const SupportDetailScreen = ({ navigation, route }) => {
  const { person } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: '#f9f9f9' }}>
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ padding: 8, backgroundColor: '#e0e0e0', borderRadius: 8 }}
    >
      <Text style={{ fontSize: 20 }}>← Back</Text>
    </TouchableOpacity>
    <Text style={{ fontSize: 20, marginLeft: 40, fontWeight: 'bold', color: '#333' }}>Professor Details</Text>
  </View>

  <ScrollView>
    <Image
  source={{ uri: person.image }}
  style={{
    width: '60%',
    height: height * 0.3,
    borderRadius: 15,
    marginBottom: height * 0.025,
    resizeMode: 'cover', // Ensures the image fills the box proportionally
    alignSelf: 'center'
  }}
/>

    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#2c3e50' }}>{person.name}</Text>
    <Text style={{ fontSize: 18, color: '#7f8c8d', marginBottom: 15 }}>{person.subject}</Text>

    {/* Contact Info */}
    <View style={{ backgroundColor: '#ffffff', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 }}>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>Email: <Text style={{ fontWeight: '500' }}>{person.email}</Text></Text>
      <Text style={{ fontSize: 16 }}>Phone: <Text style={{ fontWeight: '500' }}>{person.phone}</Text></Text>
    </View>

    {/* Section: Education */}
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10, color: '#34495e' }}>Education</Text>
    {person.education.map((edu, index) => (
      <View key={index} style={{ marginVertical: 6, padding: 10, backgroundColor: '#ecf0f1', borderRadius: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#2d3436' }}>{edu.degree}</Text>
        <Text style={{ fontSize: 16, color: '#636e72' }}>{edu.institution} ({edu.year})</Text>
      </View>
    ))}

    {/* Section: Skills */}
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#34495e' }}>Skills</Text>
    <Text style={{ fontSize: 16, marginTop: 6, backgroundColor: '#dfe6e9', padding: 10, borderRadius: 8 }}>
      {person.skills.join(', ')}
    </Text>

    {/* Section: Experience */}
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#34495e' }}>Experience</Text>
    {person.experience.map((exp, index) => (
      <View key={index} style={{ marginVertical: 8, padding: 12, backgroundColor: '#f1f2f6', borderRadius: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#2d3436' }}>{exp.role}</Text>
        <Text style={{ fontSize: 16, color: '#636e72' }}>{exp.company} ({exp.years})</Text>
        <Text style={{ fontSize: 14, marginTop: 4, color: '#636e72' }}>{exp.description}</Text>
      </View>
    ))}

    {/* Section: Achievements */}
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#34495e' }}>Achievements</Text>
    <View style={{ marginTop: 8, paddingLeft: 10 }}>
      {person.achievements.map((ach, index) => (
        <Text key={index} style={{ fontSize: 16, marginVertical: 4, color: '#2d3436' }}>• {ach}</Text>
      ))}
    </View>
  </ScrollView>
</SafeAreaView>
);
};
//-------------------------
// FAQ PAGE LAYOUT
// ------------------------
const FaqScreen = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: '#ffffff' }}>
  {/* Top Navbar */}
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
      <Text style={{ fontSize: 26, color: '#333' }}>←</Text>
    </TouchableOpacity>
    <Text style={{ fontSize: 20, marginLeft: 10, fontWeight: 'bold', color: '#3b5998' }}>Frequently Asked Questions</Text>
  </View>

  {/* FAQ Content */}
  <ScrollView contentContainerStyle={{ padding: 10 }}>
    <View style={{ backgroundColor: '#e8f0fe', borderRadius: 12, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1a73e8', marginBottom: 6 }}>1. How do I sign up?</Text>
      <Text style={{ color: '#444' }}>You can sign up by clicking the Sign Up button on the login screen and filling out the form.</Text>
    </View>

    <View style={{ backgroundColor: '#e6f4ea', borderRadius: 12, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#188038', marginBottom: 6 }}>2. How can I contact support?</Text>
      <Text style={{ color: '#444' }}>You can contact support through Facebook, Messenger, Viber, or by calling the phone number listed in Help.</Text>
    </View>

    <View style={{ backgroundColor: '#fef7e0', borderRadius: 12, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#f9ab00', marginBottom: 6 }}>3. How do I reset my password?</Text>
      <Text style={{ color: '#444' }}>Go to the login screen, click "Forgot Password", and follow the instructions sent to your email.</Text>
    </View>

    <View style={{ backgroundColor: '#fce8e6', borderRadius: 12, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#d93025', marginBottom: 6 }}>4. How do I redeem rewards?</Text>
      <Text style={{ color: '#444' }}>Go to the Redeem section from the menu to view and claim available rewards using your points.</Text>
    </View>

    <View style={{ backgroundColor: '#e4eaf1', borderRadius: 12, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#5f6368', marginBottom: 6 }}>5. Can I use multiple devices?</Text>
      <Text style={{ color: '#444' }}>Yes, you can log in to multiple devices using the same account, but some features may be limited per device.</Text>
    </View>
  </ScrollView>
</SafeAreaView>
);
// ------------------------
// SUBJECTDETAILSCREEN PAGE LAYOUT
// ------------------------
const SubjectDetailScreen = ({ route, navigation }) => {
  const { subject } = route.params;
  const [gradeLevel, setGradeLevel] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const modules = [
  { 
    id: 1, 
    title: 'Module 1', 
    grade: 7,
    overview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a velit non leo finibus gravida.'
  },
  { 
    id: 2, 
    title: 'Module 2', 
    grade: 8,
    overview: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
  },
  { 
    id: 3, 
    title: 'Module 3', 
    grade: 9,
    overview: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.'
  },
  { 
    id: 4, 
    title: 'Module 4', 
    grade: 10,
    overview: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.'
  },
];


const scoreboard = [
  { name: 'Player 1', points: 100 },
  { name: 'Player 2', points: 80 },
  { name: 'Player 3', points: 60 },
  { name: 'Player 3', points: 60 },
  { name: 'Player 3', points: 60 },
];

const completedGames = [
  { id: 1, title: 'Math Shooter' },
  { id: 2, title: 'Grammar Quest' },
  { id: 3, title: 'Science Trivia' },
];
  const filteredModules = gradeLevel ? modules.filter(mod => mod.grade === gradeLevel) : modules;

  const gamesForSubject = subjectGames[subject?.title] || [];
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      {/* HEADER */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>
          {subject.title} Overview
        </Text>
        <TouchableOpacity
          style={{ position: 'absolute', right: 0, padding: 8, backgroundColor: '#e57373', borderRadius: 5 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white' }}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 10 }}>
  <View style={{ flexDirection: 'row' }}>
    {/* LEFT SIDE */}
    <View style={{ flex: 1 }}>
      {/* MODULES */}
      <View style={{ marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Modules</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#4fc3f7', padding: 8, borderRadius: 5 }}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={{ color: 'white' }}>
              {gradeLevel ? `Grade ${gradeLevel}` : 'Select Grade'}
            </Text>
          </TouchableOpacity>
        </View>
        {showDropdown && (
  <View style={{ backgroundColor: '#fff', elevation: 3, marginTop: 5, borderRadius: 5 }}>
    {['All', 7, 8, 9, 10].map((grade, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setGradeLevel(grade === 'All' ? null : grade);
          setShowDropdown(false);
        }}
        style={{ padding: 10, borderBottomWidth: index !== 4 ? 1 : 0, borderColor: '#ccc' }}
      >
        <Text>{grade === 'All' ? 'All Grades' : `Grade ${grade}`}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}
        {filteredModules.map(mod => (
          <View
            key={mod.id}
            style={{
              backgroundColor: '#f5f5f5',
              padding: 10,
              marginVertical: 5,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>{mod.title} (G{mod.grade})</Text>
            <TouchableOpacity
  style={{ backgroundColor: '#4caf50', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 }}
  onPress={() => navigation.navigate('ModuleOverview', { module: mod })}
>
  <Text style={{ color: 'white' }}>Choose</Text>
</TouchableOpacity>
          </View>
        ))}
      </View>

      {/* GAMES */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Games</Text>
        {gamesForSubject.map((game, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#e0e0e0',
              padding: 10,
              marginVertical: 4,
              borderRadius: 8,
            }}
          >
            <Image
              source={{ uri: game.image }}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 8,
                marginBottom: 8,
              }}
              resizeMode="cover"
            />
            <Text style={{ fontWeight: 'bold' }}>{game.title}</Text>
            <Text style={{ fontSize: 12, marginBottom: 5 }}>{game.description}</Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#2196f3',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 5,
                alignSelf: 'flex-start',
              }}
              onPress={() =>
                navigation.navigate('GameScreen', {
                  gameId: game.id, // <-- send id
                  gameTitle: game.title,
                  gameDescription: game.description,
                })
              }
            >
              <Text style={{ color: 'white' }}>Start</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>

    {/* RIGHT SIDE */}
    <View style={{ flex: 1, marginLeft: 12 }}>
      {/* SCOREBOARD */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Scoreboard</Text>
        {scoreboard.map((player, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#ffecb3',
              padding: 10,
              marginVertical: 4,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text>{player.name}</Text>
            <Text>{player.points} pts</Text>
          </View>
        ))}
      </View>

      {/* COMPLETED GAMES */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Completed Games</Text>
        {completedGames.map(comp => (
          <TouchableOpacity
            key={comp.id}
            style={{
              backgroundColor: '#c8e6c9',
              padding: 12,
              marginVertical: 4,
              borderRadius: 8,
            }}
            onPress={() => alert(`Viewing ${comp.title}`)}
          >
            <Text>{comp.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
</ScrollView>
    </SafeAreaView>
  );
};

const ModuleOverviewScreen = ({ route, navigation }) => {
  const { module } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>{'< Back'}</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        {module.title}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        {module.overview}
      </Text>

      <TouchableOpacity
        style={{ backgroundColor: '#2196f3', padding: 10, borderRadius: 5, marginBottom: 10 }}
        onPress={() => alert('Successfully downloaded PDF')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Download PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: '#4caf50', padding: 10, borderRadius: 5 }}
        onPress={() => alert('Successfully downloaded Word')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Download Word</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------------
// GAMESCREEN PAGE LAYOUT
// ------------------------
const GameScreen = ({ route, navigation }) => {
  const { gameId, gameTitle, gameDescription } = route.params;

  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { totalScore, addToTotalScore, resetTotalScore } = useContext(ScoreContext);

  const handleCorrectAnswer = () => {
    addToTotalScore(10); // Add 10 points
  };

  const questions = [
  // Percentages (IDs 1–10)
  { id: 1, question: 'What is 50 percent of 100?', answer: '50' },
  { id: 2, question: 'What is 25 percent of 80?', answer: '20' },
  { id: 3, question: 'Convert 0.5 to a percent.', answer: '50 percent' },
  { id: 4, question: 'Convert 60 percent to a decimal.', answer: '0.6' },
  { id: 5, question: 'Increase 100 by 10 percent.', answer: '110' },
  { id: 6, question: 'Decrease 200 by 25 percent.', answer: '150' },
  { id: 7, question: 'A $60 item is 20 percent off. What is the discount?', answer: '12' },
  { id: 8, question: 'What is 10 percent of 250?', answer: '25' },
  { id: 9, question: 'A student got 18 out of 20 questions correct. What percent is that?', answer: '90 percent' },
  { id: 10, question: 'A price went from 50 to 65. What is the percent increase?', answer: '30 percent' },

  // Area and Perimeter (IDs 11–20)
  { id: 11, question: 'What is the area of a rectangle with length 6 and width 4?', answer: '24' },
  { id: 12, question: 'What is the perimeter of a square with sides of 5?', answer: '20' },
  { id: 13, question: 'What is the area of a triangle with base 10 and height 3?', answer: '15' },
  { id: 14, question: 'What is the perimeter of a rectangle with length 8 and width 2?', answer: '20' },
  { id: 15, question: 'What is the area of a square with side 9?', answer: '81' },
  { id: 16, question: 'A triangle has sides 3, 4, and 5. What is the perimeter?', answer: '12' },
  { id: 17, question: 'What is the area of a rectangle with length 7 and width 6?', answer: '42' },
  { id: 18, question: 'What is the area of a square with side 10?', answer: '100' },
  { id: 19, question: 'A triangle has base 6 and height 5. What is the area?', answer: '15' },
  { id: 20, question: 'What is the perimeter of a rectangle with length 9 and width 5?', answer: '28' },

  // Integers (IDs 21–30)
  { id: 21, question: 'What is 5 minus 8?', answer: '-3' },
  { id: 22, question: 'What is -4 plus 9?', answer: '5' },
  { id: 23, question: 'What is -6 minus 3?', answer: '-9' },
  { id: 24, question: 'What is -2 times 3?', answer: '-6' },
  { id: 25, question: 'What is 6 minus 10?', answer: '-4' },
  { id: 26, question: 'What is -7 plus 4?', answer: '-3' },
  { id: 27, question: 'What is -5 plus (-2)?', answer: '-7' },
  { id: 28, question: 'What is 3 minus (-2)?', answer: '5' },
  { id: 29, question: 'What is -9 plus 10?', answer: '1' },
  { id: 30, question: 'What is -6 minus (-4)?', answer: '-2' },

  // Rounding Numbers (IDs 31–40)
  { id: 31, question: 'Round 76 to the nearest ten.', answer: '80' },
  { id: 32, question: 'Round 143 to the nearest hundred.', answer: '100' },
  { id: 33, question: 'Round 89 to the nearest ten.', answer: '90' },
  { id: 34, question: 'Round 152 to the nearest ten.', answer: '150' },
  { id: 35, question: 'Round 367 to the nearest hundred.', answer: '400' },
  { id: 36, question: 'Round 205 to the nearest ten.', answer: '210' },
  { id: 37, question: 'Round 349 to the nearest hundred.', answer: '300' },
  { id: 38, question: 'Round 98 to the nearest ten.', answer: '100' },
  { id: 39, question: 'Round 444 to the nearest hundred.', answer: '400' },
  { id: 40, question: 'Round 999 to the nearest hundred.', answer: '1000' }
];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
// Classic Ladders

const [playerPosition, setPlayerPosition] = useState(0);
const [diceValue, setDiceValue] = useState(null);
const [message, setMessage] = useState('');

const [fractionIndex, setFractionIndex] = useState(0);
const [userFractionAnswer, setUserFractionAnswer] = useState('');
const [selectedSlices, setSelectedSlices] = useState([]);
// Classic Ladders
const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

// Classic Snakes
const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const allFractionQuestions = useMemo(() => [
  // Set 1: 3 points
  ...Array.from({ length: 10 }, () => ({
    type: 'identify',
    numerator: Math.floor(Math.random() * 9) + 1,
    denominator: 10,
    points: 3,
  })),

  // Set 2: 5 points (add)
  ...Array.from({ length: 10 }, () => ({
    type: 'add',
    frac1: { n: 1 + Math.floor(Math.random() * 5), d: 2 + Math.floor(Math.random() * 5) },
    frac2: { n: 1 + Math.floor(Math.random() * 5), d: 2 + Math.floor(Math.random() * 5) },
    points: 5,
  })),

  // Set 3: 10 points (subtract)
  ...Array.from({ length: 10 }, () => ({
    type: 'subtract',
    frac1: { n: 4 + Math.floor(Math.random() * 5), d: 5 + Math.floor(Math.random() * 5) },
    frac2: { n: 1 + Math.floor(Math.random() * 3), d: 5 + Math.floor(Math.random() * 5) },
    points: 10,
  })),

  // Set 4: 15 points (multiply/divide)
  ...Array.from({ length: 5 }, () => ({
    type: 'multiply',
    frac1: { n: 1 + Math.floor(Math.random() * 3), d: 2 + Math.floor(Math.random() * 5) },
    frac2: { n: 1 + Math.floor(Math.random() * 3), d: 2 + Math.floor(Math.random() * 5) },
    points: 15,
  })),
  ...Array.from({ length: 5 }, () => ({
    type: 'divide',
    frac1: { n: 1 + Math.floor(Math.random() * 3), d: 2 + Math.floor(Math.random() * 5) },
    frac2: { n: 1 + Math.floor(Math.random() * 3), d: 2 + Math.floor(Math.random() * 5) },
    points: 15,
  })),
], []);
  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (userInput.trim() === currentQuestion.answer) {
      setScore(prev => prev + 10);
      setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
    } else {
      setWrongCount(prev => prev + 1);
      if (wrongCount + 1 >= 3) setGameOver(true);
    }
    setUserInput('');
  };
const handleSubmitAnswer = () => {
  const currentQuestion = questions[currentQuestionIndex];
  if (userInput.trim() === currentQuestion.answer) {
    setScore(prev => prev + 10);
    addToTotalScore(10);
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);
    let newPos = playerPosition + roll;

    if (newPos > 100) {
      setMessage(`You need an exact roll to finish. You rolled a ${roll}, but you were at position ${playerPosition}.`);
    } else {
      // Check if the player landed on a ladder or snake
      if (ladders[newPos]) {
        newPos = ladders[newPos];
        setMessage(`You climbed a ladder from position ${newPos - roll} to position ${newPos}!`);
      } else if (snakes[newPos]) {
        newPos = snakes[newPos];
        setMessage(`Oh no! You got bitten by a snake, sliding from position ${newPos + roll} to position ${newPos}.`);
      } else {
        setMessage(`You rolled a ${roll} and moved to position ${newPos}.`);
      }
      setPlayerPosition(newPos);

      if (newPos === 100) {
        setGameOver(true);
        setMessage(`Congratulations! You've reached the end at position ${newPos}!`);
      }
    }
  } else {
    setWrongCount(prev => prev + 1);
    setMessage(`Wrong answer! (${wrongCount + 1} / 3)`);
    if (wrongCount + 1 >= 3) setGameOver(true);
  }
  setUserInput('');
  setCurrentQuestionIndex((currentQuestionIndex + 1) % questions.length);
};
  


//--------- ----------------------
const computeFraction = (question) => {
  const { frac1, frac2, type } = question;

  const simplify = (n, d) => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(n, d);
    return { n: n / divisor, d: d / divisor };
  };

  let result = { n: 0, d: 1 };

  switch (type) {
    case 'add':
      result.n = (frac1.n * frac2.d) + (frac2.n * frac1.d);
      result.d = frac1.d * frac2.d;
      break;
    case 'subtract':
      result.n = (frac1.n * frac2.d) - (frac2.n * frac1.d);
      result.d = frac1.d * frac2.d;
      break;
    case 'multiply':
      result.n = frac1.n * frac2.n;
      result.d = frac1.d * frac2.d;
      break;
    case 'divide':
      if (frac2.n === 0) return { n: 0, d: 1 }; // prevent divide-by-zero
      result.n = frac1.n * frac2.d;
      result.d = frac1.d * frac2.n;
      break;
    default:
      result = { n: 0, d: 1 };
  }

  return simplify(result.n, result.d);
};
  
  const handleFractionSubmit = () => {
  const question = allFractionQuestions[fractionIndex];
  let correct = false;

  if (question.type === 'identify') {
    correct = selectedSlices.length === question.numerator;
  } else {
    const [n, d] = userFractionAnswer.split('/').map(Number);
    const result = computeFraction(question);
    correct = n === result.n && d === result.d;
  }

  // Show feedback message
  setFractionFeedback(correct ? 'correct' : 'incorrect');
setTimeout(() => setFractionFeedback(null), 1500);
  
  if (correct) {
    setScore(prev => prev + question.points);
    addToTotalScore(question.points);
  } else {
    setWrongCount(prev => prev + 1);
    if (wrongCount + 1 >= 3) {
      setGameOver(true);
      return;
    }
  }

  if (fractionIndex + 1 >= allFractionQuestions.length) {
    setGameOver(true);
  } else {
    setFractionIndex(prev => prev + 1);
    setUserFractionAnswer('');
    setSelectedSlices([]);
  }
};

//---------------------------------------------
  const wordList = [
    { word: "accomplish", meaning: "To achieve or complete successfully." },
    { word: "ambiguous", meaning: "Open to more than one interpretation; unclear." },
    { word: "analyze", meaning: "To examine something in detail to understand it better." },
    { word: "beneficial", meaning: "Having a positive effect or impact." },
    { word: "comprehend", meaning: "To understand or grasp the meaning of something." },
    { word: "controversial", meaning: "Likely to cause disagreement or discussion." },
    { word: "dynamic", meaning: "Constantly changing or active." },
    { word: "eloquent", meaning: "Fluent or persuasive in speaking or writing." },
    { word: "evolve", meaning: "To develop gradually over time." },
    { word: "fluctuate", meaning: "To change or vary irregularly." },
    { word: "illustrate", meaning: "To explain or clarify something with examples or pictures." },
    { word: "substantial", meaning: "Considerable in size, importance, or worth." },
    { word: "hypothesis", meaning: "An idea or theory that is tested through research or experimentation." },
    { word: "persuasive", meaning: "Able to convince someone to believe or do something." },
    { word: "revelation", meaning: "A surprising or previously unknown fact that has been disclosed." },
    { word: "resilient", meaning: "Able to recover quickly from difficulties." },
    { word: "synthesize", meaning: "To combine different ideas or information to create something new." },
    { word: "vivid", meaning: "Producing powerful feelings or strong, clear images in the mind." },
    { word: "zoology", meaning: "The scientific study of animals." }
  ];

  const [scrambledWord, setScrambledWord] = useState('');
const [userGuess, setUserGuess] = useState('');
const [selectedDifficulty, setSelectedDifficulty] = useState(null);
const [currentMeaning, setCurrentMeaning] = useState('');
const [isRoundStarted, setIsRoundStarted] = useState(false); // New state to check if round has started

const pointsByDifficulty = {
  easy: 3,
  medium: 7,
  hard: 15,
};

// Function to scramble a word
const scrambleWord = (word) => {
  return word.split('').sort(() => Math.random() - 0.5).join('');
};

// Function to start a new round of the game
const startNewRound = () => {
  if (!selectedDifficulty) {
    Alert.alert("Select Difficulty", "Please choose a difficulty to start the game.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * wordList.length);
  const word = wordList[randomIndex].word;
  const meaning = wordList[randomIndex].meaning;

  // Set the scrambled word and meaning after selecting difficulty
  setScrambledWord(scrambleWord(word));
  setCurrentMeaning(meaning);
  setIsRoundStarted(true); // Round started, trigger re-render
};

// UseEffect to monitor selected difficulty change and start the new round
useEffect(() => {
  if (selectedDifficulty !== null) {
    startNewRound(); // Start a new round when difficulty is set
  }
}, [selectedDifficulty]); // Depend on selectedDifficulty

const handleGuess = () => {
  const correctWord = scrambledWord.split('').sort().join(''); // sorted letters of the scrambled word
  const userAnswer = userGuess.toLowerCase().split('').sort().join(''); // sort user input for comparison

  if (userAnswer === correctWord) {
    setScore(prev => prev + pointsByDifficulty[selectedDifficulty]);
    Alert.alert("Correct!", `You unscrambled the word! Meaning: ${currentMeaning}`);
  } else {
    setWrongCount(prev => prev + 1);
    if (wrongCount + 1 >= 3) setGameOver(true);
    Alert.alert("Wrong!", "Try again.");
  }
  setUserGuess('');
  if (!gameOver) startNewRound();
};

//---------------------------
const grammarQuestions = [
  // Easy (3 points)
  {
    question: "She _____ to school every day.",
    options: ["go", "goes", "gone", "going"],
    correctAnswer: "goes",
    difficulty: "easy",
    points: 3,
  },
  {
    question: "I _____ happy today.",
    options: ["is", "are", "am", "be"],
    correctAnswer: "am",
    difficulty: "easy",
    points: 3,
  },
  {
    question: "They _____ playing football.",
    options: ["is", "are", "was", "be"],
    correctAnswer: "are",
    difficulty: "easy",
    points: 3,
  },

  // Medium (7 points)
  {
    question: "If I _____ rich, I would travel the world.",
    options: ["was", "were", "am", "be"],
    correctAnswer: "were",
    difficulty: "medium",
    points: 7,
  },
  {
    question: "They have been waiting _____ 9 a.m.",
    options: ["for", "since", "in", "from"],
    correctAnswer: "since",
    difficulty: "medium",
    points: 7,
  },
  {
    question: "He doesn't have _____ money left.",
    options: ["some", "any", "many", "few"],
    correctAnswer: "any",
    difficulty: "medium",
    points: 7,
  },

  // Hard (15 points)
  {
    question: "The cake was baked by Mary. (Change to active voice)",
    options: [
      "Mary bakes the cake.",
      "Mary has baked the cake.",
      "Mary baked the cake.",
      "Mary is baking the cake.",
    ],
    correctAnswer: "Mary baked the cake.",
    difficulty: "hard",
    points: 15,
  },
  {
    question: "Which sentence is grammatically correct?",
    options: [
      "She don't like apples.",
      "He doesn't likes to swim.",
      "They doesn't want to come.",
      "He doesn't like to swim.",
    ],
    correctAnswer: "He doesn't like to swim.",
    difficulty: "hard",
    points: 15,
  },
  {
    question: "Not only _____ late, but he also forgot his homework.",
    options: ["he was", "was he", "he is", "is he"],
    correctAnswer: "was he",
    difficulty: "hard",
    points: 15,
  },
];

// Grammar Quest State
const [grammarDifficulty, setGrammarDifficulty] = useState(null);
const [currentGrammarQuestion, setCurrentGrammarQuestion] = useState(null);
const [selectedGrammarOption, setSelectedGrammarOption] = useState(null);

// Function to start a new grammar question based on selected difficulty
const startGrammarNewRound = (difficulty) => {
  // Filter questions based on selected difficulty
  const filteredQuestions = grammarQuestions.filter(
    (q) => q.difficulty === difficulty
  );

  // Select a random question from the filtered questions
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  const randomQuestion = filteredQuestions[randomIndex];

  // Set the selected question and reset the selected option
  setCurrentGrammarQuestion(randomQuestion);
  setSelectedGrammarOption(null); // Reset option selection
};

// Function to handle the user's answer
const handleGrammarAnswer = () => {
  // Ensure that an option has been selected and there is a current question
  if (!selectedGrammarOption || !currentGrammarQuestion) return;

  // Check if the selected answer is correct
  if (selectedGrammarOption === currentGrammarQuestion.correctAnswer) {
    // If correct, add points based on the current question's points
    setScore((prevScore) => prevScore + currentGrammarQuestion.points);
  } else {
    // If incorrect, increment the wrong count
    setWrongCount((prevCount) => {
      const newCount = prevCount + 1;

      // End game if wrong attempts reach 3
      if (newCount >= 3) {
        setGameOver(true); // End the game
      }
      return newCount;
    });
  }

  // If the game isn't over, go to the next question after a short delay
  setTimeout(() => {
    if (!gameOver) {
      startGrammarNewRound(grammarDifficulty); // Load a new question with the current difficulty
    }
  }, 500); // Wait for 0.5 seconds before showing next question
};

//----------_------------------
// Game Progress and State
const [triviaQuestionsPool, setTriviaQuestionsPool] = useState([]);
const [triviaCurrentIndex, setTriviaCurrentIndex] = useState(0);
const [triviaCurrentQuestion, setTriviaCurrentQuestion] = useState(null);
const [triviaSelectedOption, setTriviaSelectedOption] = useState(null);


// Difficulty Setup
const triviaQuestionFlow = [
  ...Array(10).fill('easy'),
  ...Array(20).fill('medium'),
  ...Array(10).fill('hard')
];

const triviaPointsByDifficulty = {
  easy: 4,
  medium: 8,
  hard: 15
};

// Sample questions by difficulty
const triviaQuestionBank = {
  easy: [
    { question: 'What planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Venus', 'Jupiter'], answer: 'Mars' },
    { question: 'Which animal says "meow"?', options: ['Dog', 'Cow', 'Cat', 'Horse'], answer: 'Cat' },
    { question: 'What color is the sky on a clear day?', options: ['Red', 'Blue', 'Green', 'Purple'], answer: 'Blue' },
    { question: 'How many legs does a spider have?', options: ['6', '8', '4', '10'], answer: '8' },
    { question: 'What fruit is yellow and curved?', options: ['Apple', 'Orange', 'Banana', 'Grape'], answer: 'Banana' },
    { question: 'Which day comes after Friday?', options: ['Sunday', 'Monday', 'Saturday', 'Thursday'], answer: 'Saturday' },
    { question: 'What do bees make?', options: ['Milk', 'Honey', 'Bread', 'Cheese'], answer: 'Honey' },
    { question: 'What shape has three sides?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], answer: 'Triangle' },
    { question: 'Which sense do you use to smell?', options: ['Eyes', 'Nose', 'Ears', 'Hands'], answer: 'Nose' },
    { question: 'What is the opposite of "cold"?', options: ['Wet', 'Dry', 'Hot', 'Soft'], answer: 'Hot' }
  ],
  medium: [
    { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], answer: 'Carbon Dioxide' },
    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: '7' },
    { question: 'What is H2O commonly known as?', options: ['Oxygen', 'Salt', 'Water', 'Hydrogen'], answer: 'Water' },
    { question: 'Which planet is the largest in our solar system?', options: ['Earth', 'Jupiter', 'Saturn', 'Neptune'], answer: 'Jupiter' },
    { question: 'Who wrote "Romeo and Juliet"?', options: ['Shakespeare', 'Dickens', 'Rowling', 'Tolkien'], answer: 'Shakespeare' },
    { question: 'What is the capital city of France?', options: ['Berlin', 'Madrid', 'Rome', 'Paris'], answer: 'Paris' },
    { question: 'Which organ pumps blood through the body?', options: ['Lungs', 'Liver', 'Heart', 'Kidney'], answer: 'Heart' },
    { question: 'Which metal is liquid at room temperature?', options: ['Gold', 'Iron', 'Mercury', 'Silver'], answer: 'Mercury' },
    { question: 'How many days are in a leap year?', options: ['365', '366', '364', '360'], answer: '366' },
    { question: 'What is the boiling point of water in Celsius?', options: ['100', '0', '50', '75'], answer: '100' },
    { question: 'What’s the main language spoken in Brazil?', options: ['Spanish', 'Portuguese', 'French', 'English'], answer: 'Portuguese' },
    { question: 'Which month has 28 days (at least)?', options: ['Only February', 'February and March', 'All months', 'January'], answer: 'All months' },
    { question: 'How many legs does an insect have?', options: ['6', '8', '10', '4'], answer: '6' },
    { question: 'What is the square root of 64?', options: ['6', '7', '8', '9'], answer: '8' },
    { question: 'Which ocean is the biggest?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 'Pacific' },
    { question: 'What is the longest bone in the body?', options: ['Femur', 'Skull', 'Spine', 'Tibia'], answer: 'Femur' },
    { question: 'Which continent is Egypt in?', options: ['Asia', 'Europe', 'Africa', 'South America'], answer: 'Africa' },
    { question: 'What is the plural of “mouse”?', options: ['Mouses', 'Mouse', 'Mice', 'Mices'], answer: 'Mice' },
    { question: 'Which country invented pizza?', options: ['France', 'USA', 'Greece', 'Italy'], answer: 'Italy' },
    { question: 'What is 9 x 9?', options: ['81', '72', '90', '99'], answer: '81' }
  ],
  hard: [
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], answer: 'Mitochondria' },
    { question: 'Who developed the theory of relativity?', options: ['Newton', 'Einstein', 'Tesla', 'Galileo'], answer: 'Einstein' },
    { question: 'What is the capital of Iceland?', options: ['Oslo', 'Reykjavik', 'Copenhagen', 'Helsinki'], answer: 'Reykjavik' },
    { question: 'Which element has the chemical symbol "Fe"?', options: ['Fluorine', 'Iron', 'Fermium', 'Francium'], answer: 'Iron' },
    { question: 'How many hearts does an octopus have?', options: ['1', '2', '3', '4'], answer: '3' },
    { question: 'What’s the square root of 144?', options: ['10', '11', '12', '13'], answer: '12' },
    { question: 'Which Shakespeare play features the characters Rosencrantz and Guildenstern?', options: ['Macbeth', 'Othello', 'Hamlet', 'Julius Caesar'], answer: 'Hamlet' },
    { question: 'Which planet has the most moons?', options: ['Earth', 'Jupiter', 'Mars', 'Saturn'], answer: 'Saturn' },
    { question: 'What is the hardest natural substance on Earth?', options: ['Steel', 'Diamond', 'Iron', 'Quartz'], answer: 'Diamond' },
    { question: 'What is the chemical formula for table salt?', options: ['NaCl', 'KCl', 'H2O', 'CO2'], answer: 'NaCl' }
  ]
};

// Initialize trivia questions in order
useEffect(() => {
  const compiledTriviaQuestions = [];

  const clonedBank = {
    easy: [...triviaQuestionBank.easy],
    medium: [...triviaQuestionBank.medium],
    hard: [...triviaQuestionBank.hard]
  };

  triviaQuestionFlow.forEach(difficulty => {
    const questionList = clonedBank[difficulty];
    if (questionList.length > 0) {
      compiledTriviaQuestions.push(questionList.shift());
    }
  });

  setTriviaQuestionsPool(compiledTriviaQuestions);
  setTriviaCurrentQuestion(compiledTriviaQuestions[0]);
}, []);

const handleTriviaAnswerSubmission = () => {
  if (!triviaSelectedOption || gameOver) return;

  const currentDifficulty = triviaQuestionFlow[triviaCurrentIndex];
  const isCorrect = triviaSelectedOption === triviaCurrentQuestion.answer;

  if (isCorrect) {
    setScore(prev => prev + triviaPointsByDifficulty[currentDifficulty]);
  } else {
    setWrongCount(prev => {
      const updated = prev + 1;
      if (updated >= 3) {
        setGameOver(true);
        setTriviaCurrentQuestion(null);
      }
      return updated;
    });
  }

  const nextIndex = triviaCurrentIndex + 1;

  if (nextIndex >= triviaQuestionsPool.length) {
    setGameOver(true);
    setTriviaCurrentQuestion(null);
  } else {
    setTriviaCurrentIndex(nextIndex);
    setTriviaCurrentQuestion(triviaQuestionsPool[nextIndex]);
    setTriviaSelectedOption(null);
  }
};

//--------------------------
const [elementQuestionsPool, setElementQuestionsPool] = useState([]);
const [elementCurrentIndex, setElementCurrentIndex] = useState(0);
const [elementCurrentQuestion, setElementCurrentQuestion] = useState(null);
const [elementUserInput, setElementUserInput] = useState('');

const elementQuestionBank = {
  easy: [
    { symbol: 'H', name: 'Hydrogen' },
    { symbol: 'O', name: 'Oxygen' },
    { symbol: 'C', name: 'Carbon' },
    { symbol: 'N', name: 'Nitrogen' },
    { symbol: 'He', name: 'Helium' },
    { symbol: 'Li', name: 'Lithium' },
    { symbol: 'Na', name: 'Sodium' },
    { symbol: 'Cl', name: 'Chlorine' },
    { symbol: 'K', name: 'Potassium' },
    { symbol: 'Ca', name: 'Calcium' }
  ],
  medium: [
    { symbol: 'Fe', name: 'Iron' },
    { symbol: 'Cu', name: 'Copper' },
    { symbol: 'Zn', name: 'Zinc' },
    { symbol: 'Si', name: 'Silicon' },
    { symbol: 'Mg', name: 'Magnesium' },
    { symbol: 'Al', name: 'Aluminum' },
    { symbol: 'P', name: 'Phosphorus' },
    { symbol: 'S', name: 'Sulfur' },
    { symbol: 'F', name: 'Fluorine' },
    { symbol: 'I', name: 'Iodine' },
    { symbol: 'Br', name: 'Bromine' },
    { symbol: 'Mn', name: 'Manganese' },
    { symbol: 'Co', name: 'Cobalt' },
    { symbol: 'Cr', name: 'Chromium' },
    { symbol: 'Ni', name: 'Nickel' }
  ],
  hard: [
    { symbol: 'Sn', name: 'Tin' },
    { symbol: 'Sb', name: 'Antimony' },
    { symbol: 'Pb', name: 'Lead' },
    { symbol: 'Bi', name: 'Bismuth' },
    { symbol: 'U', name: 'Uranium' },
    { symbol: 'Pu', name: 'Plutonium' },
    { symbol: 'Ra', name: 'Radium' },
    { symbol: 'Fr', name: 'Francium' },
    { symbol: 'Rn', name: 'Radon' },
    { symbol: 'Tc', name: 'Technetium' },
    { symbol: 'Re', name: 'Rhenium' },
    { symbol: 'Th', name: 'Thorium' },
    { symbol: 'Os', name: 'Osmium' },
    { symbol: 'Ir', name: 'Iridium' },
    { symbol: 'At', name: 'Astatine' }
  ]
};

const elementQuestionFlow = [
  ...Array(10).fill('easy'),
  ...Array(15).fill('medium'),
  ...Array(15).fill('hard')
];

const elementPointsByDifficulty = {
  easy: 3,
  medium: 7,
  hard: 15
};

useEffect(() => {
  const compiledElementQuestions = [];
  const clonedBank = {
    easy: [...elementQuestionBank.easy],
    medium: [...elementQuestionBank.medium],
    hard: [...elementQuestionBank.hard]
  };

  elementQuestionFlow.forEach(difficulty => {
    const questionList = clonedBank[difficulty];
    if (questionList.length > 0) {
      compiledElementQuestions.push(questionList.shift());
    }
  });

  setElementQuestionsPool(compiledElementQuestions);
  setElementCurrentQuestion(compiledElementQuestions[0]);
}, []);

const handleElementAnswerSubmission = () => {
  if (!elementUserInput || gameOver) return;

  const currentDifficulty = elementQuestionFlow[elementCurrentIndex];
  const isCorrect = elementUserInput.trim().toLowerCase() === elementCurrentQuestion.name.toLowerCase();

  if (isCorrect) {
    setScore(prev => prev + elementPointsByDifficulty[currentDifficulty]);
  } else {
    setWrongCount(prev => {
      const updated = prev + 1;
      if (updated >= 3) {
        setGameOver(true);
        setElementCurrentQuestion(null);
      }
      return updated;
    });
  }

  const nextIndex = elementCurrentIndex + 1;
  if (nextIndex >= elementQuestionsPool.length) {
    setGameOver(true);
    setElementCurrentQuestion(null);
  } else {
    setElementCurrentIndex(nextIndex);
    setElementCurrentQuestion(elementQuestionsPool[nextIndex]);
    setElementUserInput('');
  }
};

//-------------------_------------
const [bugtongIndex, setBugtongIndex] = useState(0);
const [bugtongUserAnswer, setBugtongUserAnswer] = useState('');
const [showBugtongAnswer, setShowBugtongAnswer] = useState(false);

const bugtongQuestions = [
  { question: 'Puno ng letra, di makapagsalita, binubuklat sa tuwina.', answer: 'Aklat', difficulty: 'easy' },
  { question: 'Tagapagsalita ng tula, kwento’t dula, di artista pero bida sa klase.', answer: 'Guro sa Filipino', difficulty: 'easy' },
  { question: 'Walang bibig pero bumibigkas, binabasa ng estudyanteng masigasig.', answer: 'Tula', difficulty: 'easy' },
  { question: 'May pamagat at wakas, minsan nakakaiyak o nakakatawa.', answer: 'Maikling Kwento', difficulty: 'easy' },
  { question: 'Sulat na pormal o di pormal, ipinapasa kay guro sa Filipino.', answer: 'Sanaysay', difficulty: 'easy' },
  { question: 'Bawat salita ay may kahulugan, hanapin mo ako sa diksiyonaryo.', answer: 'Kahulugan o Kasingkahulugan', difficulty: 'easy' },
  { question: 'Lumalaban gamit ay dila, dumadaan sa harapan ng klase.', answer: 'Talumpati', difficulty: 'easy' },
  { question: 'Palaging tinuturo sa klase, bahagi ako ng pananalita.', answer: 'Pangngalan', difficulty: 'easy' },
  { question: 'Hindi galit, pero may tandang!', answer: 'Pautos o Pangungusap na Pautos', difficulty: 'easy' },
  { question: 'Walang mata, pero nakakaintindi ng pagbabasa.', answer: 'Isip (Pag-unawa sa binasa)', difficulty: 'easy' },
  { question: 'Walang paa pero gumagalaw, nagsasalaysay ng buhay o alamat.', answer: 'Nobela o Epiko', difficulty: 'easy' },
  { question: 'Kasama ng "kay", "kina", at "ni", ako\'y kilala sa panitikang wika.', answer: 'Pangatnig o Pang-ukol', difficulty: 'easy' },
  { question: 'Di sinusulat pero pinapasa, madalas ay oral at may kodigo pa.', answer: 'Bugtong o Salawikain sa pagsusulit', difficulty: 'easy' },
  { question: 'Ako\'y balangkas ng ideya, ginagamit sa paggawa ng talata.', answer: 'Balangkas o Outline', difficulty: 'easy' },
  { question: 'Ako’y tanong na patula, sagot mo’y palaisipan pa.', answer: 'Bugtong', difficulty: 'easy' },

  { question: 'Ako\'y kasabihang luma, may aral at talinghaga.', answer: 'Salawikain', difficulty: 'medium' },
  { question: 'May simuno at panaguri, ako’y buo at may saysay.', answer: 'Pangungusap', difficulty: 'medium' },
  { question: 'Ako’y hindi lang kuwento, ako’y kultura ng ating bayan.', answer: 'Alamat', difficulty: 'medium' },
  { question: 'May gitling at panipi, ako’y makikita sa mga tula’t dula.', answer: 'Bantas', difficulty: 'medium' },
  { question: 'Ako’y isang pag-uusap, may diyalogo at emosyon.', answer: 'Dula', difficulty: 'medium' },
  { question: 'Ako’y kwento ng bayani, taglay ko’y kabayanihan, binabasa sa klase ng may damdamin.', answer: 'Epiko', difficulty: 'medium' },
  { question: 'Ako’y mahaba at may kabanata, hindi ako kwento, pero hawig din sa nobela.', answer: 'Nobela', difficulty: 'medium' },
  { question: 'May tauhan at tagpo, sa dula ako’y kasama, ako’y panuto ng kilos at diyalogo.', answer: 'Iskrip', difficulty: 'medium' },
  { question: 'Ako’y bahagi ng tula, may tugma’t sukat ang katawan ko.', answer: 'Saknong', difficulty: 'medium' },
  { question: 'Ako’y makasaysayang kwento, laging may aral sa dulo.', answer: 'Alamat', difficulty: 'medium' },
  { question: 'Ako’y pamana ng mga ninuno, masaya akong pakinggan sa bawat tribo.', answer: 'Kwentong Bayan', difficulty: 'medium' },
  { question: 'Ako\'y ginagamit sa debate, masinsin at may paksang pinaglalaban.', answer: 'Pagtatalo o Debateng Pormal', difficulty: 'medium' },
  { question: 'Ako\'y salita ng matanda, minsan palaisipan, minsan payo pa.', answer: 'Salawikain', difficulty: 'medium' },
  { question: 'Ako’y sining ng pagsusulat, minsan ay tula, minsan ay kwento.', answer: 'Panitikan', difficulty: 'medium' },
  { question: 'Ako’y salita na naiiba ang kahulugan sa literal.', answer: 'Idyoma', difficulty: 'medium' },

  { question: 'Ako’y tanong na di naman hinahanapan ng sagot.', answer: 'Pagtatanong Retorikal', difficulty: 'hard' },
  { question: 'Ako\'y ginuguhit ng isipan, at isinusulat ng may damdamin.', answer: 'Sanaysay', difficulty: 'hard' },
  { question: 'Ako\'y kabaligtaran ng literal, sa tula ako\'y laganap.', answer: 'Tayutay', difficulty: 'hard' },
  { question: 'Ako’y bahagi ng akda, simula, gitna, at wakas ang aking laman.', answer: 'Banghay', difficulty: 'hard' },
  { question: 'Ako’y tumutukoy kung sino o ano ang gumaganap.', answer: 'Simuno', difficulty: 'hard' },
  { question: 'Ako naman ang nagsasabi kung ano ang ginawa.', answer: 'Panaguri', difficulty: 'hard' },
  { question: 'Ako’y sinusuri sa pagsusulit, hinahanap ang ideya’t layunin ko.', answer: 'Pokus ng Pagbasa', difficulty: 'hard' },
  { question: 'Ako’y tanong na maraming sagot, paborito sa pagsusulit ni guro.', answer: 'Pagsusuring Pangwika', difficulty: 'hard' },
  { question: 'Ako’y sinasambit kapag may emosyon – gulat, tuwa, lungkot.', answer: 'Pang-ugnay o Padamdam', difficulty: 'hard' },
  { question: 'Ako\'y payak ngunit malaman, lagi akong ginagamit sa pagsisimula ng talata.', answer: 'Paksa', difficulty: 'hard' },
];

const handleBugtongAnswerSubmission = () => {
  const current = bugtongQuestions[bugtongIndex];
  const normalizedAnswer = bugtongUserAnswer.trim().toLowerCase();
  const correctAnswer = current.answer.toLowerCase();

  const isCorrect = normalizedAnswer === correctAnswer;

  if (isCorrect) {
    let points = 0;
    if (current.difficulty === 'easy') points = 3;
    else if (current.difficulty === 'medium') points = 7;
    else if (current.difficulty === 'hard') points = 15;

    setScore(prev => prev + points);
    setShowBugtongAnswer(false);
  } else {
    setWrongCount(prev => prev + 1);
    setShowBugtongAnswer(true);
  }

  setTimeout(() => {
    setBugtongUserAnswer('');
    setShowBugtongAnswer(false);

    if (bugtongIndex + 1 < bugtongQuestions.length) {
      setBugtongIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  }, isCorrect ? 300 : 2000); // 2 seconds if wrong, short delay if correct
};

//----------------------------------------
const kahuluganQuestions = [
  // EASY (3 points)
  {
    word: "Butas ang bulsa",
    options: ["Walang pera", "Maraming trabaho", "Laging gutom", "Nawawala ang gamit"],
    answer: "Walang pera",
    difficulty: "easy"
  },
  {
    word: "Makapal ang mukha",
    options: ["Maganda", "Walang hiya", "Matapang", "Matigas ang ulo"],
    answer: "Walang hiya",
    difficulty: "easy"
  },
  {
    word: "Mainit ang ulo",
    options: ["Masakit ang ulo", "Laging galit", "May sakit", "Nag-aalala"],
    answer: "Laging galit",
    difficulty: "easy"
  },
  {
    word: "Mabigat ang kamay",
    options: ["Matapang", "Palasuntok", "Masipag", "Madamot"],
    answer: "Palasuntok",
    difficulty: "easy"
  },
  {
    word: "Maikli ang pisi",
    options: ["Madaling magalit", "Matipid", "Masaya", "Tahimik"],
    answer: "Madaling magalit",
    difficulty: "easy"
  },
  {
    word: "Itaga mo sa bato",
    options: ["Kalilimutan", "Kalokohan", "Pangako", "Pagkakamali"],
    answer: "Pangako",
    difficulty: "easy"
  },
  {
    word: "Kaututang-dila",
    options: ["Kakampi", "Kausap", "Kalaban", "Kumare"],
    answer: "Kausap",
    difficulty: "easy"
  },
  {
    word: "Nagbibilang ng poste",
    options: ["Nagpapahinga", "Walang trabaho", "Naglalakad", "Nagpaparusa"],
    answer: "Walang trabaho",
    difficulty: "easy"
  },
  {
    word: "Ahas na tulog",
    options: ["Tahimik", "Mapanlinlang", "Tamad", "Natutulog lang"],
    answer: "Mapanlinlang",
    difficulty: "easy"
  },
  {
    word: "Bilog ang mundo",
    options: ["May pag-asa", "Hindi tiyak", "Magulo", "Umiikot ang buhay"],
    answer: "Umiikot ang buhay",
    difficulty: "easy"
  },

  // MEDIUM (7 points)
  {
    word: "May gatas pa sa labi",
    options: ["Inosente", "Matakaw", "May tagpi-tagpi", "Malambing"],
    answer: "Inosente",
    difficulty: "medium"
  },
  {
    word: "Balat-sibuyas",
    options: ["Maselan", "Matapang", "Mainitin ang ulo", "Malakas"],
    answer: "Maselan",
    difficulty: "medium"
  },
  {
    word: "Naglalakad na advertisement",
    options: ["Palabiro", "Masalita", "Mahilig sa tsismis", "Laging pinopromote ang sarili"],
    answer: "Laging pinopromote ang sarili",
    difficulty: "medium"
  },
  {
    word: "Nasa dulo ng dila",
    options: ["Nalilimutan", "Naiisip", "Halos masabi na", "Naaalala"],
    answer: "Halos masabi na",
    difficulty: "medium"
  },
  {
    word: "Pagputi ng uwak",
    options: ["Sigurado", "Hindi mangyayari", "Laging mangyayari", "Umiikot lang"],
    answer: "Hindi mangyayari",
    difficulty: "medium"
  },
  {
    word: "Naglalaway",
    options: ["Gutom", "May gusto", "Tamad", "May ubo"],
    answer: "May gusto",
    difficulty: "medium"
  },
  {
    word: "Pasan ang daigdig",
    options: ["Malungkot", "Maraming problema", "Tahimik", "Mapagkumbaba"],
    answer: "Maraming problema",
    difficulty: "medium"
  },
  {
    word: "Basang sisiw",
    options: ["Kawawa", "Malungkot", "Tahimik", "Mahina"],
    answer: "Kawawa",
    difficulty: "medium"
  },
  {
    word: "Nag-aapoy ang mata",
    options: ["Galit na galit", "Mainit", "Naglalakad", "Malinaw"],
    answer: "Galit na galit",
    difficulty: "medium"
  },
  {
    word: "Luha ng buwaya",
    options: ["Tunay na lungkot", "Pakunwaring iyak", "Pekeng tao", "Pagkukunwari"],
    answer: "Pakunwaring iyak",
    difficulty: "medium"
  },
  {
    word: "Parang kandilang nauupos",
    options: ["Matanda na", "Nanghihina", "Nauubos", "Napapagod"],
    answer: "Nanghihina",
    difficulty: "medium"
  },
  {
    word: "Itim ang budhi",
    options: ["Masama ang ugali", "Malungkot", "Galit", "Tahimik"],
    answer: "Masama ang ugali",
    difficulty: "medium"
  },
  {
    word: "Maitim ang dugo",
    options: ["Mainitin ang ulo", "Masama ang loob", "Pikon", "Kuripot"],
    answer: "Masama ang loob",
    difficulty: "medium"
  },
  {
    word: "Nagbukas ng dibdib",
    options: ["Nagsalita ng totoo", "Sumigaw", "Nagpaliwanag", "Nagalit"],
    answer: "Nagsalita ng totoo",
    difficulty: "medium"
  },
  {
    word: "Kalapating mababa ang lipad",
    options: ["Manunulat", "Hindi mapagkakatiwalaan", "Prostitusyon", "Masayahin"],
    answer: "Prostitusyon",
    difficulty: "medium"
  },
  {
    word: "Kapag may tiyaga, may nilaga",
    options: ["Mahihirapan ka", "Pag may sipag, may bunga", "Masarap kumain", "Magtipid"],
    answer: "Pag may sipag, may bunga",
    difficulty: "medium"
  },
  {
    word: "Nagpalusot",
    options: ["Tumakas", "Nagpaliwanag", "Nagkunwari", "Nagsinungaling"],
    answer: "Nagsinungaling",
    difficulty: "medium"
  },
  {
    word: "Matigas ang ulo",
    options: ["Mahirap turuan", "Walang laman", "Mapurol", "Mayabang"],
    answer: "Mahirap turuan",
    difficulty: "medium"
  },
  {
    word: "Makati ang kamay",
    options: ["Madaldal", "Mandurukot", "Palabigay", "Mabait"],
    answer: "Mandurukot",
    difficulty: "medium"
  },
  {
    word: "Buntot mo, hila mo",
    options: ["Ikaw ang may gawa", "Ikaw ang biktima", "May iniwang problema", "May kasalanan"],
    answer: "Ikaw ang may gawa",
    difficulty: "medium"
  },

  // HARD (15 points)
  {
    word: "Namuti ang mata",
    options: ["Naghintay ng matagal", "Nagalit", "Napagod", "Umiiyak"],
    answer: "Naghintay ng matagal",
    difficulty: "hard"
  },
  {
    word: "Pinagbiyak na bunga",
    options: ["Magkamukha", "Magkapatid", "Magkaaway", "Magkaibigan"],
    answer: "Magkamukha",
    difficulty: "hard"
  },
  {
    word: "Nagdurugtong ang bituka",
    options: ["Gutom na gutom", "Masakit ang tiyan", "May sakit", "Nalilito"],
    answer: "Gutom na gutom",
    difficulty: "hard"
  },
  {
    word: "Laging nasa ilalim ng palad",
    options: ["Laging talo", "Sunod-sunuran", "May kontrol", "Mapagkumbaba"],
    answer: "Laging talo",
    difficulty: "hard"
  },
  {
    word: "Makalaglag-panga",
    options: ["Nakakatuwa", "Nakagugulat", "Nakakatawa", "Nakakainis"],
    answer: "Nakagugulat",
    difficulty: "hard"
  },
  {
    word: "May daga sa dibdib",
    options: ["Takot", "May sikreto", "Masama ang loob", "Galit"],
    answer: "Takot",
    difficulty: "hard"
  },
  {
    word: "Parang sinampal ng katotohanan",
    options: ["Nagising sa katotohanan", "Nasaktan", "Nahuli", "Napahiya"],
    answer: "Nagising sa katotohanan",
    difficulty: "hard"
  },
  {
    word: "Utak lamok",
    options: ["Mahina ang isip", "Mainitin ang ulo", "Maingay", "Makulit"],
    answer: "Mahina ang isip",
    difficulty: "hard"
  },
  {
    word: "Bilog ang mundo",
    options: ["Paikot-ikot", "Bumabalik ang sitwasyon", "Laging nagbabago", "Magulo"],
    answer: "Bumabalik ang sitwasyon",
    difficulty: "hard"
  },
  {
    word: "Kumakain ng oras",
    options: ["Matagal gawin", "Nakakainip", "Hindi importante", "Masayang gawin"],
    answer: "Matagal gawin",
    difficulty: "hard"
  }
];

const [kahuluganIndex, setKahuluganIndex] = useState(0);
const [selectedKahuluganOption, setSelectedKahuluganOption] = useState('');
const [showKahuluganAnswer, setShowKahuluganAnswer] = useState(false);

const handleKahuluganAnswerSubmission = () => {
  const current = kahuluganQuestions[kahuluganIndex];
  const isCorrect = selectedKahuluganOption === current.answer;

  if (isCorrect) {
    let points = 0;
    if (current.difficulty === 'easy') points = 3;
    else if (current.difficulty === 'medium') points = 7;
    else if (current.difficulty === 'hard') points = 15;

    setScore(prev => prev + points);
    setShowKahuluganAnswer(false);
  } else {
    setWrongCount(prev => prev + 1);
    setShowKahuluganAnswer(true);
  }

  const delay = isCorrect ? 300 : 2000;

  setTimeout(() => {
    setSelectedKahuluganOption('');

    if (kahuluganIndex + 1 < kahuluganQuestions.length) {
      setKahuluganIndex(prev => prev + 1);
      setShowKahuluganAnswer(false); // hide answer again for next question
    } else {
      setGameOver(true);
    }
  }, delay);
};

//------------------------------------------------------
const heroQuestions = [
  // Easy (3 points)
  { 
    clue: "Bayani ng Katipunan na kilala sa kanyang tapang at pula ang bandila.",
    answer: "Andres Bonifacio",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/09/Andres_Bonifacio.jpg",
    difficulty: "easy",
    options: ['Andres Bonifacio', 'Emilio Aguinaldo', 'Jose Rizal']
  },
  { 
    clue: "Unang Pangulo ng Pilipinas.",
    answer: "Emilio Aguinaldo",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Emilio_Aguinaldo_ca.1919%28Restored%29.jpg",
    difficulty: "easy",
    options: ['Emilio Aguinaldo', 'Andres Bonifacio', 'Jose Rizal']
  },
  { 
    clue: "Ina ng Katipunan.",
    answer: "Melchora Aquino",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Melchora_Aquino.jpg",
    difficulty: "easy",
    options: ['Melchora Aquino', 'Teresa Magbanua', 'Gregoria de Jesus']
  },
  { 
    clue: "Kilala bilang 'Dakilang Lumpo' at may akdang Noli Me Tangere.",
    answer: "Jose Rizal",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/97/Jose_rizal_01.jpg",
    difficulty: "easy",
    options: ['Jose Rizal', 'Emilio Aguinaldo', 'Andres Bonifacio']
  },
  { 
    clue: "Babaeng bayani mula sa Visayas na lumaban sa mga Kastila.",
    answer: "Teresa Magbanua",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Teresa_Magbanua.jpg",
    difficulty: "easy",
    options: ['Teresa Magbanua', 'Melchora Aquino', 'Julio Nakpil']
  },
  { 
    clue: "Kapatid ni Gregoria de Jesus at aktibo sa Katipunan.",
    answer: "Julio Nakpil",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/58/Julio_Nakpil.jpg",
    difficulty: "easy",
    options: ['Julio Nakpil', 'Vicente Lim', 'Sultan Kudarat']
  },
  { 
    clue: "Pinuno ng Sandatahang Lakas sa panahon ng Hapon.",
    answer: "Vicente Lim",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Vicente_Lim.jpg",
    difficulty: "easy",
    options: ['Vicente Lim', 'Emilio Aguinaldo', 'Gregoria de Jesus']
  },
  { 
    clue: "Bayani ng Balangiga, Samar.",
    answer: "Valeriano Abanador",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Valeriano_Abanador.jpg",
    difficulty: "easy",
    options: ['Valeriano Abanador', 'Jose Rizal', 'Julio Nakpil']
  },
  { 
    clue: "Lider ng mga Muslim na lumaban sa mga Amerikano sa Mindanao.",
    answer: "Sultan Kudarat",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Sultan_Kudarat_statue.jpg",
    difficulty: "easy",
    options: ['Sultan Kudarat', 'Emilio Aguinaldo', 'Jose Rizal']
  },
  { 
    clue: "Tinaguriang 'Lakambini ng Katipunan'.",
    answer: "Gregoria de Jesus",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Gregoria_de_Jesus.jpg",
    difficulty: "easy",
    options: ['Gregoria de Jesus', 'Melchora Aquino', 'Julio Nakpil']
  },

  // Medium (7 points)
  { 
    clue: "Mahalagang lider ng rebolusyon laban sa mga Kastila at pinuno ng mga Katipunero sa Tondo.",
    answer: "Andres Bonifacio",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/31/Andres_Bonifacio_1896.jpg",
    difficulty: "medium",
    options: ['Andres Bonifacio', 'Emilio Aguinaldo', 'Jose Rizal']
  },
  { 
    clue: "Pinuno ng mga katipunero sa Bicol at lumaban sa mga Kastila.",
    answer: "Francisco Carreon",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Francisco_Carreon.jpg",
    difficulty: "medium",
    options: ['Francisco Carreon', 'Vicente Lim', 'Melchora Aquino']
  },

  // You can add more questions here for hard difficulty
];



const [heroIndex, setHeroIndex] = useState(0);
const [selectedHeroAnswer, setSelectedHeroAnswer] = useState('');
const [showHeroAnswer, setShowHeroAnswer] = useState(false);
const flipAnim = useRef(new Animated.Value(0)).current;
const fadeAnim = useRef(new Animated.Value(1)).current;

const frontInterpolate = flipAnim.interpolate({
  inputRange: [0, 180],
  outputRange: ['0deg', '180deg']
});

const backInterpolate = flipAnim.interpolate({
  inputRange: [0, 180],
  outputRange: ['180deg', '360deg']
});

const frontAnimatedStyle = {
  transform: [{ rotateY: frontInterpolate }]
};

const backAnimatedStyle = {
  transform: [{ rotateY: backInterpolate }]
};

const handleHeroAnswerSubmission = () => {
  const current = heroQuestions[heroIndex];
  const isCorrect = selectedHeroAnswer === current.answer;

  if (isCorrect) {
    const points = current.difficulty === 'easy' ? 3 : current.difficulty === 'medium' ? 7 : 15;
    setScore(prev => prev + points);
  } else {
    setWrongCount(prev => prev + 1);
  }

  setShowHeroAnswer(true);

  Animated.timing(flipAnim, {
    toValue: 180,
    duration: 600,
    useNativeDriver: true
  }).start(() => {
    setTimeout(() => {
      // Start fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      }).start(() => {
        // After fade out, flip back and change question
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true
        }).start(() => {
          setShowHeroAnswer(false);
          setSelectedHeroAnswer('');
          if (heroIndex + 1 < heroQuestions.length) {
            setHeroIndex(prev => prev + 1);
          } else {
            setGameOver(true);
          }

          // Fade in next question
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
          }).start();
        });
      });
    }, 1500);
  });
};

//-----------------------------------------------
const factOrMythQuestions = [
  // Easy (3 points each)
  {
    statement: "Jose Rizal was the first president of the Philippines.",
    answer: "Myth",
    explanation: "Emilio Aguinaldo was the first president, not Rizal.",
  },
  {
    statement: "The Cry of Pugad Lawin marked the start of the Philippine Revolution.",
    answer: "Fact",
    explanation: "This event symbolized the Filipinos' break from Spanish rule.",
  },
  {
    statement: "The Spanish colonization of the Philippines lasted over 400 years.",
    answer: "Myth",
    explanation: "It lasted about 333 years from 1565 to 1898.",
  },
  {
    statement: "The Code of Kalantiaw was an ancient legal code in the Philippines.",
    answer: "Myth",
    explanation: "The Code of Kalantiaw was proven to be a historical hoax.",
  },
  {
    statement: "The Battle of Mactan in 1521 was led by Lapu-Lapu against Ferdinand Magellan.",
    answer: "Fact",
    explanation: "Lapu-Lapu defeated Magellan in the Battle of Mactan.",
  },
  {
    statement: "The Philippines was named after King Philip II of Spain.",
    answer: "Fact",
    explanation: "The name came from King Philip II during Spanish exploration.",
  },
  {
    statement: "The Katipunan was a peaceful reform movement during the Spanish era.",
    answer: "Myth",
    explanation: "The Katipunan aimed for revolution, not reform.",
  },
  {
    statement: "The Philippine Declaration of Independence was proclaimed on June 12, 1898.",
    answer: "Fact",
    explanation: "Emilio Aguinaldo declared independence from Spain on this date.",
  },
  {
    statement: "The American occupation of the Philippines began in 1898 after the Spanish-American War.",
    answer: "Fact",
    explanation: "The Treaty of Paris gave the Philippines to the U.S. in 1898.",
  },
  {
    statement: "The Malolos Constitution was the first republican constitution in Asia.",
    answer: "Fact",
    explanation: "It established the First Philippine Republic in 1899.",
  },

  // Medium (7 points each)
  {
    statement: "Andres Bonifacio was the first president of the Katipunan.",
    answer: "Fact",
    explanation: "He founded and led the Katipunan revolutionary group.",
  },
  {
    statement: "Melchora Aquino fought in battles during the revolution.",
    answer: "Myth",
    explanation: "She aided revolutionaries but did not fight in battles.",
  },
  {
    statement: "The Treaty of Paris ended the Spanish-American War and transferred the Philippines to the United States.",
    answer: "Fact",
    explanation: "Spain ceded the Philippines to the U.S. in 1898.",
  },
  {
    statement: "Manuel L. Quezon was the first President of the Commonwealth of the Philippines.",
    answer: "Fact",
    explanation: "He served from 1935 to 1944.",
  },
  {
    statement: "La Solidaridad was a publication that praised the Spanish friars.",
    answer: "Myth",
    explanation: "It exposed abuses by friars and advocated for reforms.",
  },
  {
    statement: "The Gabaldon Act funded the construction of public schools in the Philippines.",
    answer: "Fact",
    explanation: "Passed in 1907, it funded nationwide school buildings.",
  },
  {
    statement: "The Battle of Pinaglabanan was the first real battle of the revolution.",
    answer: "Fact",
    explanation: "Fought on August 30, 1896, in San Juan.",
  },
  {
    statement: "The rightist wing of La Liga Filipina was called 'Cuerpos de Compromisarios.'",
    answer: "Fact",
    explanation: "They favored reform rather than revolution.",
  },
  {
    statement: "The first President of the Katipunan was Deodato Arellano.",
    answer: "Fact",
    explanation: "He was elected president in 1892.",
  },
  {
    statement: "The first Filipino novel was 'Nínay' authored by Pedro Paterno.",
    answer: "Fact",
    explanation: "Published in 1885, it was the first Filipino novel.",
  },
  {
    statement: "The first female chief nurse of PGH was Melchora Aquino.",
    answer: "Myth",
    explanation: "Anastacia Giron-Tupas held that role in 1917.",
  },
  {
    statement: "The first labor union in the Philippines was Unión Obrera Democrática Filipina.",
    answer: "Fact",
    explanation: "It was established in 1902.",
  },
  {
    statement: "The first Balagtasan took place in 1898.",
    answer: "Myth",
    explanation: "The first Balagtasan was held in 1924.",
  },
  {
    statement: "Kenkoy was the first Filipino comic strip.",
    answer: "Fact",
    explanation: "It debuted on January 11, 1929.",
  },
  {
    statement: "Aimee Carandang was the first female commercial airline captain in the Philippines.",
    answer: "Fact",
    explanation: "She became captain in 1993.",
  },

  // Hard (15 points each)
  {
    statement: "Tandang Sora appeared on the ₱100 banknote during the English series.",
    answer: "Fact",
    explanation: "She was honored on the 1951–1966 ₱100 bill.",
  },
  {
    statement: "Carriedo water system was the first waterworks in the Philippines.",
    answer: "Fact",
    explanation: "Inaugurated in 1882 to serve Manila.",
  },
  {
    statement: "The first automobile arrived in the Philippines in 1904.",
    answer: "Fact",
    explanation: "It was a Richard-Brasier car.",
  },
  {
    statement: "The Skylark biplane first flew in the Philippines in 1911.",
    answer: "Fact",
    explanation: "Flown by Bud Mars on February 21, 1911.",
  },
  {
    statement: "The Spanish friars encouraged the teaching of science to Filipinos.",
    answer: "Myth",
    explanation: "They limited education to maintain control.",
  },
  {
    statement: "The Cavite Mutiny led directly to the execution of Rizal.",
    answer: "Myth",
    explanation: "It led to the execution of Gomburza, not Rizal.",
  },
  {
    statement: "The Philippine-American War lasted only one year.",
    answer: "Myth",
    explanation: "It lasted from 1899 to 1902.",
  },
  {
    statement: "Apolinario Mabini was known as 'The Brains of the Revolution.'",
    answer: "Fact",
    explanation: "He advised Aguinaldo and shaped revolutionary policy.",
  },
  {
    statement: "The Manila-Acapulco Galleon Trade lasted for over 250 years.",
    answer: "Fact",
    explanation: "It operated from 1565 to 1815.",
  },
  {
    statement: "The Katipunan had a women's chapter called 'Kapatiran ng Kababaihan.'",
    answer: "Myth",
    explanation: "Its actual women's chapter was 'Katipunang Kababaihan.'",
  },
  {
    statement: "The Philippine flag’s red stripe on top means peace.",
    answer: "Myth",
    explanation: "Red on top indicates the country is at war.",
  },
  {
    statement: "Rizal's novels were originally written in English.",
    answer: "Myth",
    explanation: "They were written in Spanish.",
  },
  {
    statement: "Corazon Aquino was the first female president in Asia.",
    answer: "Fact",
    explanation: "She became president in 1986.",
  },
  {
    statement: "Barter was used as the primary form of trade in pre-colonial Philippines.",
    answer: "Fact",
    explanation: "Goods were exchanged directly, without money.",
  },
  {
    statement: "Fort Santiago was built by the Americans.",
    answer: "Myth",
    explanation: "It was built by the Spanish in the 16th century.",
  },
];

const [factIndex, setFactIndex] = useState(0);
const [selectedFactAnswer, setSelectedFactAnswer] = useState('');
const [showFactFeedback, setShowFactFeedback] = useState(false);
const [factResult, setFactResult] = useState('');

const handleFactOrMythSubmission = () => {
  const current = factOrMythQuestions[factIndex];
  const isCorrect = selectedFactAnswer === current.answer;

  let points = 0;
  if (factIndex < 10) {
    points = 3;
  } else if (factIndex < 25) {
    points = 7;
  } else {
    points = 15;
  }

  if (isCorrect) {
    setScore(prev => prev + points);
    setFactResult('Correct!');
  } else {
    setWrongCount(prev => prev + 1);
    setFactResult('Oops! That’s incorrect.');
  }

  setShowFactFeedback(true);

  setTimeout(() => {
    setShowFactFeedback(false);
    setSelectedFactAnswer('');

    if (factIndex + 1 < factOrMythQuestions.length) {
      setFactIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  }, 2500);
};

//-------------------------------------------
 const virtueSituations = [
  {
    situation: "Nakita mong may nahulog na pitaka at isinauli mo ito sa may-ari.",
    answer: "Katapatan",
    explanation: "Ang pagsasauli ng gamit na hindi iyo ay nagpapakita ng katapatan.",
  },
  {
    situation: "Pinakinggan mong mabuti ang saloobin ng iyong kaibigan kahit hindi ka sang-ayon.",
    answer: "Paggalang",
    explanation: "Ang pakikinig sa opinyon ng iba ay isang anyo ng paggalang.",
  },
  {
    situation: "Nagtapon ka ng basura sa tamang basurahan kahit walang nakakakita.",
    answer: "Responsibilidad",
    explanation: "Ginagawa mo ang tama kahit walang nakakakita, tanda ng pagiging responsable.",
  },
  {
    situation: "Nakita mong ang iyong kaibigan ay nahulog, at agad mo siyang tinulungan upang bumangon.",
    answer: "Pagpapakumbaba",
    explanation: "Ang pagtulong sa iba, lalo na sa oras ng pangangailangan, ay nagpapakita ng pagpapakumbaba.",
  },
  {
    situation: "Pinili mong mag-aral ng husto para sa pagsusulit upang magtagumpay, kahit maraming kaibigan ang nag-aanyaya sa iyo na lumabas.",
    answer: "Pagpapahalaga sa Edukasyon",
    explanation: "Ang pag-prioritize sa iyong pag-aaral ay isang pagpapahalaga sa iyong edukasyon at kinabukasan.",
  },
  {
    situation: "Tinutulungan mo ang isang kamag-aral na nahirapan sa aralin, kahit na ikaw ay abala.",
    answer: "Kabutihan-loob",
    explanation: "Ang pagtulong sa iba ng walang kapalit ay isang magandang halimbawa ng kabutihan-loob.",
  },
  {
    situation: "Pinili mong magdasal ng taimtim bago matulog at humingi ng gabay sa Diyos.",
    answer: "Relihiyon",
    explanation: "Ang pagpapakita ng pananampalataya sa Diyos ay isang mahalagang bahagi ng relihiyon.",
  },
  {
    situation: "Nagbigay ka ng iyong paboritong laruan sa isang batang hindi kayang bumili ng sarili niyang laruan.",
    answer: "Pagpapatawad",
    explanation: "Ang pagbibigay at pagtulong ay isang pagpapakita ng pagpapatawad at malasakit sa kapwa.",
  },
  {
    situation: "Pagkatapos mong magkamali sa iyong mga gawain, nag-sorry ka sa iyong guro at mga kamag-aral.",
    answer: "Pagpapakumbaba",
    explanation: "Ang pagpapakumbaba at pagtanggap ng pagkakamali ay isang mahalagang ugali ng isang taong may integridad.",
  },
  {
    situation: "Ang mga magulang mo ay nagbigay ng ilang payo na hindi mo maintindihan, ngunit ipinagpatuloy mong sundin dahil naniniwala kang para sa iyong kabutihan.",
    answer: "Paggalang",
    explanation: "Ang paggalang sa mga magulang ay isang pagpapakita ng malasakit sa kanilang karanasan at kaalaman.",
  },
  {
    situation: "Nagbigay ka ng pagkain sa isang kakilala na nagugutom kahit hindi ka nila inutusan.",
    answer: "Kabutihan-loob",
    explanation: "Ang pagbibigay ng tulong sa iba ng walang hinihintay na kapalit ay isang halimbawa ng kabutihan-loob.",
  },
  {
    situation: "Tinulungan mo ang iyong kaibigan sa kanyang proyekto kahit na ikaw ay abala sa iyong mga gawain.",
    answer: "Pagka-mahigpit sa kaibigan",
    explanation: "Ang pagtulong sa mga kaibigan ay isang magandang halimbawa ng pagka-mahigpit sa mga mahal sa buhay.",
  },
  {
    situation: "Nakita mong mayroong batang nahulog at hindi kayang bumangon, kaya't agad mong tinulungan.",
    answer: "Pagpapatawad",
    explanation: "Ang pagiging maagap at pagtulong sa mga nangangailangan ay isang halimbawa ng pagpapatawad.",
  },
  {
    situation: "Habang abala ka sa iyong mga gawain, ikaw ay nakaramdam ng pagmamalasakit sa mga kapwa mo at nagbigay ng iyong oras para tumulong sa kanila.",
    answer: "Pagpapakatao",
    explanation: "Ang pagpapakita ng malasakit sa kapwa at pagtulong ng walang hinihinging kapalit ay isang halimbawa ng pagpapakatao.",
  },
  {
    situation: "Minsan ay naiintindihan mo na magkamali ang mga magulang mo, ngunit tinatanggap mo pa rin sila at pinapakita ang respeto.",
    answer: "Paggalang",
    explanation: "Ang pagpapakita ng respeto sa magulang, kahit na sila ay nagkamali, ay isang halimbawa ng pagiging magalang.",
  },
  {
    situation: "Kahit na ikaw ay may mga opinyon na magkaiba sa ibang tao, natututo kang tanggapin ang kanilang pananaw.",
    answer: "Pagpapakumbaba",
    explanation: "Ang pagpapakumbaba ay isang pagkatuto na tanggapin ang ibang opinyon, kahit na magkaiba sa iyong pananaw.",
  },
  {
    situation: "Pinili mong magtrabaho ng husto at magsakripisyo upang maabot ang iyong mga pangarap.",
    answer: "Pagsusumikap",
    explanation: "Ang pagtutok sa mga pangarap at ang pagsusumikap para makamit ito ay isang halimbawa ng pagsusumikap.",
  },
  {
    situation: "Iniiwasan mong magbiro ng labis-labis na nakakasakit sa iyong mga kaibigan.",
    answer: "Paggalang",
    explanation: "Ang pag-iwas sa pagmumura o pagbibiro ng labis ay isang pagpapakita ng paggalang sa iba.",
  },
  {
    situation: "Pinipili mong magbigay ng oras upang makinig sa iyong kaibigan na may problema.",
    answer: "Kabutihan-loob",
    explanation: "Ang pagbibigay ng oras para makinig sa kaibigan na may problema ay isang pagpapakita ng kabutihan-loob.",
  },
  {
    situation: "Nagpakita ka ng malasakit sa isang tao kahit na hindi ito kapwa mo kilala o hindi mo pa nakikilala.",
    answer: "Pagpapakatao",
    explanation: "Ang pagpapakita ng malasakit at pagtulong sa ibang tao ay isang pagpapakita ng magandang ugali sa isang tao.",
  },
  {
    situation: "Nagbigay ka ng simpleng pasasalamat sa iyong guro dahil sa kanyang pagtulong.",
    answer: "Paggalang",
    explanation: "Ang pagpapakita ng pasasalamat sa guro ay isang pagpapakita ng respeto at paggalang sa kanyang pagiging tagapagturo.",
  },
  {
    situation: "Bumangon ka at nagsumikap upang maging mas magaling kahit sa harap ng mga pagsubok.",
    answer: "Pagsusumikap",
    explanation: "Ang pagiging masigasig at pagsusumikap upang magtagumpay ay isang halimbawa ng pagsusumikap.",
  },
  {
    situation: "Tinulungan mo ang iyong kamag-aral na nahulog, at inalalayan mo siya para makabangon.",
    answer: "Pagpapatawad",
    explanation: "Ang pagtulong sa iba, lalo na sa oras ng pangangailangan, ay isang pagpapakita ng pagpapatawad.",
  },
  {
    situation: "Nakita mong malungkot ang iyong kaibigan at pinili mong makinig sa kanyang mga problema.",
    answer: "Kabutihan-loob",
    explanation: "Ang pagiging handa upang makinig at tumulong sa kaibigan ay isang pagpapakita ng kabutihan-loob.",
  },
  {
    situation: "Nagpapakita ka ng malasakit sa mga nangangailangan sa pamamagitan ng pagbibigay ng iyong oras o tulong.",
    answer: "Pagpapakatao",
    explanation: "Ang pagbibigay ng oras at tulong sa mga nangangailangan ay isang pagpapakita ng kabutihang-loob.",
  },
  {
    situation: "Tinutulungan mo ang isang batang magbasa ng mga aklat, kahit na ikaw ay may mga bagay na ginagawa.",
    answer: "Responsibilidad",
    explanation: "Ang pagtulong sa iba upang matuto ay isang pagpapakita ng responsibilidad sa iyong kapwa.",
  },
  {
    situation: "Habang ikaw ay nahihirapan, pinipili mong magpatuloy at magtrabaho ng mabuti upang magtagumpay.",
    answer: "Pagsusumikap",
    explanation: "Ang pagsusumikap at pagtutok sa layunin ay nagpapakita ng hindi pagsuko sa mga pagsubok.",
  },
  {
    situation: "Pinili mong makinig sa mga opinyon ng ibang tao at magpakita ng pagpapahalaga sa kanilang mga pananaw.",
    answer: "Paggalang",
    explanation: "Ang pagpapakita ng respeto sa opinyon ng iba ay isang pagpapakita ng pagiging magalang.",
  },
  {
    situation: "Nagbigay ka ng tulong sa isang pamilya na nangangailangan ng pagkain at mga gamit sa panahon ng sakuna.",
    answer: "Pagkabuklod-buklod",
    explanation: "Ang pagtulong sa mga nangangailangan ay nagpapakita ng pagkakaisa at pagkakabuklod ng komunidad.",
  },
];

const [virtueIndex, setVirtueIndex] = useState(0);
const [selectedVirtue, setSelectedVirtue] = useState('');
const [showVirtueFeedback, setShowVirtueFeedback] = useState(false);
const [virtueResult, setVirtueResult] = useState('');

const handleVirtueMatchSubmission = () => {
  const current = virtueSituations[virtueIndex];
  const isCorrect = selectedVirtue === current.answer;

  if (isCorrect) {
    const points = virtueIndex < 10 ? 3 : virtueIndex < 25 ? 7 : 15;
    setScore(prev => prev + points);
    setVirtueResult('Tama!');
  } else {
    setWrongCount(prev => prev + 1);
    setVirtueResult('Mali.');
  }

  setShowVirtueFeedback(true);

  setTimeout(() => {
    setShowVirtueFeedback(false);
    setSelectedVirtue('');

    if (virtueIndex + 1 < virtueSituations.length) {
      setVirtueIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  }, 2500);
};

//-------------------------------------------
const rolePlayScenarios = [
  {
    scenario: "May nakita kang kaklase na pinagtatawanan dahil sa kanyang pananamit. Ano ang dapat mong gawin?",
    options: ["Makisabay sa pagtawa", "Ipagtanggol siya at kausapin ang mga nambu-bully", "Magkunwaring walang nakita", "I-post ito sa social media"],
    answer: "Ipagtanggol siya at kausapin ang mga nambu-bully",
  },
  {
    scenario: "Nahuli mo ang kaibigan mong kumukuha ng gamit ng iba. Ano ang tamang hakbang?",
    options: ["Ipagsigawan sa buong klase", "Walang gawin", "Kaibiganin pa rin at balewalain", "Kaibiganin pa rin ngunit kausapin siya ng masinsinan"],
    answer: "Kaibiganin pa rin ngunit kausapin siya ng masinsinan",
  },
  {
    scenario: "May takdang-aralin na hindi mo alam gawin. Lumapit ka sa kaklase at siya’y nag-alok ng kopya. Ano ang dapat mong gawin?",
    options: ["Kopyahin para hindi mapagalitan", "Tanggihan at humingi ng tulong para maintindihan", "Ipasa na lang kahit blanco", "Magalit sa guro"],
    answer: "Tanggihan at humingi ng tulong para maintindihan",
  },
  {
    scenario: "Nagkamali ka ng sagot sa recitation at tinawanan ka ng iba. Ano ang dapat mong gawin?",
    options: ["Tumahimik at hindi na sumagot muli", "Magalit sa tumawa", "Magpatuloy at gamitin ang pagkakamali bilang aral", "Umalis ng klase"],
    answer: "Magpatuloy at gamitin ang pagkakamali bilang aral",
  },
  {
    scenario: "Habang naglalakad pauwi, may matandang nahulog ang kanyang dala. Ano ang dapat mong gawin?",
    options: ["Lakasan ang tawa", "Tulungan siyang pulutin ito", "Iwasan siya", "Kunwaring hindi nakita"],
    answer: "Tulungan siyang pulutin ito",
  },
  {
    scenario: "Ang isang kaklase ay hindi makasabay sa klase dahil sa personal na problema. Ano ang nararapat mong gawin?",
    options: ["Pabayaan na lang siya", "Kausapin siya at alamin kung paano matutulungan", "Sabihin na lang na mag-aral siya ng mabuti", "Tawanan siya at gawing biro"],
    answer: "Kausapin siya at alamin kung paano matutulungan",
  },
  {
    scenario: "Nakita mong naninira ng kapwa ang isang kaibigan mo. Ano ang dapat mong gawin?",
    options: ["Sumali at manira din", "Manahimik lang", "Kaibiganin pa rin siya ngunit ipaliwanag ang mali niyang ginawa", "Sabihin sa guro agad"],
    answer: "Kaibiganin pa rin siya ngunit ipaliwanag ang mali niyang ginawa",
  },
  {
    scenario: "May isang batang nangungutya sa isang kaklase. Ano ang dapat mong gawin?",
    options: ["Makisabay sa pagtawa", "Sabihin sa guro", "Ipagtanggol ang nambu-bully", "Tumulong sa kaklase na tinutukso"],
    answer: "Ipagtanggol ang nambu-bully",
  },
  {
    scenario: "Habang naglalakad, may isang bata na humingi ng tulong upang makauwi ng ligtas. Ano ang dapat mong gawin?",
    options: ["Iwanan siya", "I-accompany siya at tulungan siya", "Takpan ang mukha at magtago", "Pagtawanan siya"],
    answer: "I-accompany siya at tulungan siya",
  },
  {
    scenario: "Nakita mong malungkot ang iyong kaibigan dahil sa isang pagsubok. Ano ang dapat mong gawin?",
    options: ["Pabayaan siya", "Makipagkwentuhan at pakinggan siya", "Isumbong siya sa guro", "Sabihin sa kanya na magtiis lang"],
    answer: "Makipagkwentuhan at pakinggan siya",
  },
  {
    scenario: "Nahulog ang gamit ng iyong kaklase sa harap ng marami. Ano ang dapat mong gawin?",
    options: ["Pagtawanan siya", "Tulungan siyang pulutin ito", "Iwasan siya", "Maglakad lang at huwag alalahanin"],
    answer: "Tulungan siyang pulutin ito",
  },
  {
    scenario: "May kaibigan kang walang sapat na gamit para sa klase. Ano ang dapat mong gawin?",
    options: ["Sabihin na lang na hindi mo siya matutulungan", "Pahulogan siya ng gamit", "Tulungan siya at ipakita ang malasakit", "Pag-bully-an siya dahil sa kakulangan"],
    answer: "Tulungan siya at ipakita ang malasakit",
  },
  {
    scenario: "May isang tao na hindi maganda ang ugali sa iyong pamilya. Ano ang dapat mong gawin?",
    options: ["Pabayaan na lang siya", "Makipag-usap at magpaliwanag sa kanya", "Magalit at awayin siya", "Patagilid na lang"],
    answer: "Makipag-usap at magpaliwanag sa kanya",
  },
  {
    scenario: "Sa isang pagdiriwang, may isang bata na hindi isinama ng grupo. Ano ang dapat mong gawin?",
    options: ["Sabihin sa guro na may isang bata na hindi isinama", "Pabayaan ang bata na mag-isa", "Isama siya sa kalaro", "Sabay-sabay na ibukod siya"],
    answer: "Isama siya sa kalaro",
  },
  {
    scenario: "Habang nagsisimba, may nakapansin na may cellphone ang isang batang nagdarasal. Ano ang dapat mong gawin?",
    options: ["Sabihin sa guro agad", "Patagilid na lang", "Kaibiganin siya at ipaliwanag na hindi tama", "Pagtawanan siya"],
    answer: "Kaibiganin siya at ipaliwanag na hindi tama",
  },
  {
    scenario: "May isang batang nahulog ang wallet at hindi ito napansin. Ano ang dapat mong gawin?",
    options: ["Tawanan siya", "Ibigay ang wallet sa may-ari", "Kunin ito at itago", "Magpatuloy lang ng lakad"],
    answer: "Ibigay ang wallet sa may-ari",
  },
  {
    scenario: "Nag-aaway ang iyong magulang sa bahay. Ano ang dapat mong gawin?",
    options: ["Makialam at magalit sa isa", "Subukang pag-usapan at pakinggan ang kanilang pananaw", "Iwasan sila", "Magtago sa kwarto"],
    answer: "Subukang pag-usapan at pakinggan ang kanilang pananaw",
  },
  {
    scenario: "Ang iyong kasamahan sa proyekto ay hindi nakakapasok, ngunit hindi siya nakipag-communicate. Ano ang iyong gagawin?",
    options: ["Magtampo sa kanya", "Makipag-usap at alamin ang dahilan ng hindi pagkaka-kwentuhan", "Ibigay ang buong proyekto", "Sabihin sa guro"],
    answer: "Makipag-usap at alamin ang dahilan ng hindi pagkaka-kwentuhan",
  },
  {
    scenario: "Ang guro mo ay nagbigay ng takdang-aralin. Hindi ka nakapag-aral at hindi mo na-prepare. Ano ang dapat mong gawin?",
    options: ["Pagsabihan ang guro na hindi kaya", "I-explain na hindi mo ito nagawa", "Mag-kopya sa kaklase", "Kunin na lang ang takdang-aralin ng huling minuto"],
    answer: "I-explain na hindi mo ito nagawa",
  },
  {
    scenario: "Ang iyong kapatid ay may kasalanan, ngunit ikaw ang pinagbintangan. Ano ang dapat mong gawin?",
    options: ["Tumahimik at hindi magsalita", "Pagtawanan siya", "Ipaliwanag sa magulang ang nangyari", "Magalit sa kanya"],
    answer: "Ipaliwanag sa magulang ang nangyari",
  },
  {
    scenario: "Ang iyong magulang ay binigyan ka ng responsibilidad na bumili ng pagkain sa tindahan. Sa iyong pagbabalik, ikaw ay nadelay dahil may problema sa iyong daan. Ano ang iyong gagawin?",
    options: ["Magalit at itapon ang mga pagkain", "Ipaliwanag sa magulang kung bakit nadelay", "Magsinungaling at sabihin na hindi na maghapon", "Tuloy lang sa trabaho at tapusin"],
    answer: "Ipaliwanag sa magulang kung bakit nadelay",
  },
  {
    scenario: "May isang batang walang maisuot na uniforme sa klase. Ano ang dapat mong gawin?",
    options: ["Pagtawanan siya", "Sabihin sa guro upang magbigay ng tulong", "Isama siya at ipaliwanag sa guro ang sitwasyon", "Bansagan siya ng hindi maganda"],
    answer: "Sabihin sa guro upang magbigay ng tulong",
  },
  {
    scenario: "Ang iyong kaibigan ay may isang mahalagang pagsubok ngunit hindi niya kaya. Ano ang iyong gagawin?",
    options: ["Ilangin siya at pabayaan", "Tulungan siya upang maging handa", "Sabihin sa kanya na kaya niya", "Mag-husga na lang"],
    answer: "Tulungan siya upang maging handa",
  },
  {
    scenario: "Nagbigay ka ng tulong sa iyong kapatid, ngunit hindi siya nagpapasalamat. Ano ang iyong gagawin?",
    options: ["Magalit at ipahiya siya", "Manatili pa rin na mabait at magpatuloy sa pagtulong", "Sabihin na huwag nang tumulong", "Hindi magsalita"],
    answer: "Manatili pa rin na mabait at magpatuloy sa pagtulong",
  },
  // Add 20 more scenarios...
];

const [rolePlayIndex, setRolePlayIndex] = useState(0); // Tracks the index of current scenario
const [selectedRolePlayAnswer, setSelectedRolePlayAnswer] = useState(''); // Holds the selected answer
const [showRolePlayFeedback, setShowRolePlayFeedback] = useState(false); // Shows feedback after submission
const [rolePlayResult, setRolePlayResult] = useState(''); // Displays whether the answer is correct or incorrect

const handleRolePlaySubmission = () => {
  const currentScenario = rolePlayScenarios[rolePlayIndex];
  const isCorrect = selectedRolePlayAnswer === currentScenario.answer;

  if (isCorrect) {
    const points = rolePlayIndex < 10 ? 3 : rolePlayIndex < 25 ? 7 : 15; // Points based on the scenario range
    setScore(prev => prev + points);
    setRolePlayResult('Tama!');
  } else {
    setWrongCount(prev => prev + 1);
    setRolePlayResult('Mali!'); 
  }

  setShowRolePlayFeedback(true);

  setTimeout(() => {
    setShowRolePlayFeedback(false);
    setSelectedRolePlayAnswer('');

    if (rolePlayIndex + 1 < rolePlayScenarios.length) {
      setRolePlayIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  }, 2500);
};

//---------------
const toolQuestions = [
  {
    question: "What tool is used to mix or beat ingredients by hand?",
    answer: "Whisk",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Whisk.jpg" }
  },
  {
    question: "What tool is used to flatten dough?",
    answer: "Rolling Pin",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Rolling_pin.jpg" }
  },
  {
    question: "What tool is used to fry food?",
    answer: "Frying Pan",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Frying_pan.jpg" }
  },
  {
    question: "What tool is used to heat soup or boil water?",
    answer: "Saucepan",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Saucepan.jpg" }
  },
  {
    question: "What tool is used to stir hot dishes during cooking?",
    answer: "Wooden Spoon",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Wooden_spoon.jpg" }
  },
  {
    question: "What tool is used to drain pasta or vegetables?",
    answer: "Colander",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Colander.jpg" }
  },
  {
    question: "What tool is used to bake cakes and pastries?",
    answer: "Oven",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Oven.jpg" }
  },
  {
    question: "What tool is used to measure liquid ingredients?",
    answer: "Measuring Cup",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Measuring_cup.jpg" }
  },
  {
    question: "What tool is used to separate solids from liquids?",
    answer: "Strainer",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Strainer.jpg" }
  },
  {
    question: "What tool is used to measure dry ingredients?",
    answer: "Measuring Spoon",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Measuring_spoons.jpg" }
  },
  {
    question: "What tool is used to drive nails into wood?",
    answer: "Hammer",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hammer.jpg" }
  },
  {
    question: "What tool is used to cut wood manually?",
    answer: "Handsaw",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Handsaw.jpg" }
  },
  {
    question: "What tool is used to smooth wood surfaces?",
    answer: "Sandpaper",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Sandpaper.jpg" }
  },
  {
    question: "What tool is used to measure and mark wood accurately?",
    answer: "Tape Measure",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tape_measure.jpg" }
  },
  {
    question: "What tool is used to tighten or loosen nuts and bolts?",
    answer: "Wrench",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Wrench.jpg" }
  },
  {
    question: "What tool is used to make holes in wood or metal?",
    answer: "Drill",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Drill.jpg" }
  },
  {
    question: "What tool is used to hold wood or metal tightly in place while working?",
    answer: "Clamp",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Clamp.jpg" }
  },
  {
    question: "What tool is used to ensure 90-degree angles on corners?",
    answer: "Try Square",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Try_square.jpg" }
  },
  {
    question: "What tool is used to file down sharp edges or surfaces?",
    answer: "Metal File",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Metal_file.jpg" }
  },
  {
    question: "What tool is used to mark straight lines on wood or metal?",
    answer: "Chalk Line",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Chalk_line.jpg" }
  },
  {
    question: "What drafting tool is used for drawing straight lines and measuring?",
    answer: "Ruler",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Ruler.jpg" }
  },
  {
    question: "What tool is used to draw vertical and horizontal lines accurately?",
    answer: "T-square",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/2/2b/T-square.jpg" }
  },
  {
    question: "What tool is used to draw circles and arcs?",
    answer: "Compass",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Compass.jpg" }
  },
  {
    question: "What tool is used to measure and draw angles?",
    answer: "Protractor",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Protractor.jpg" }
  },
  {
    question: "What tool is used to keep the drawing paper in place on the drawing board?",
    answer: "Drawing Tape",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Drawing_tape.jpg" }
  },
  {
    question: "What tool is used to erase pencil marks cleanly?",
    answer: "Eraser",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Eraser.jpg" }
  },
  {
    question: "What tool is used to protect the drawing when erasing specific parts?",
    answer: "Eraser Shield",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Eraser_shield.jpg" }
  },
  {
    question: "What tool is used for precise drawing and layout of parallel lines?",
    answer: "Drawing Board",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Drawing_board.jpg" }
  },
  {
    question: "What tool is used to sharpen pencils to a fine point for drafting?",
    answer: "Pencil Sharpener",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Pencil_sharpener.jpg" }
  },
  {
    question: "What drafting tool is used to draw consistent curves?",
    answer: "French Curve",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/0/0f/French_curve.jpg" }
  },
  {
    question: "What tool is used to dig and loosen soil?",
    answer: "Hand Trowel",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Hand_trowel.jpg" }
  },
  {
    question: "What tool is used to water plants manually?",
    answer: "Watering Can",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Watering_can.jpg" }
  },
  {
    question: "What tool is used to transport soil, compost, or garden waste?",
    answer: "Wheelbarrow",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Wheelbarrow.jpg" }
  },
  {
    question: "What tool is used to trim or cut branches and leaves?",
    answer: "Pruning Shears",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Pruning_shears.jpg" }
  },
  {
    question: "What tool is used to break up and smooth soil surfaces?",
    answer: "Garden Rake",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Garden_rake.jpg" }
  },
  {
    question: "What tool is used to dig larger holes or turn over soil?",
    answer: "Spade",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Spade.jpg" }
  },
  {
    question: "What tool is used to cultivate soil in tight spaces?",
    answer: "Hand Fork",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Hand_fork.jpg" }
  },
  {
    question: "What tool is used to mow the lawn manually?",
    answer: "Grass Cutter or Lawn Mower",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Lawn_mower.jpg" }
  },
  {
    question: "What tool is used to pull out weeds from the soil?",
    answer: "Weeder",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Weeder.jpg" }
  },
  {
    question: "What tool is used to cut thick stems or small branches?",
    answer: "Garden Scissors or Lopper",
    image: { uri: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Garden_lopper.jpg" }
  }
];

const [toolIndex, setToolIndex] = useState(0);
const [selectedTool, setSelectedTool] = useState("");
const [showToolAnswer, setShowToolAnswer] = useState(false);
const [toolResult, setToolResult] = useState("");

const fadeToolAnim = useRef(new Animated.Value(0)).current;
const flipToolAnim = useRef(new Animated.Value(0)).current;

const toolFrontInterpolate = flipToolAnim.interpolate({
  inputRange: [0, 180],
  outputRange: ['0deg', '180deg']
});
const toolBackInterpolate = flipToolAnim.interpolate({
  inputRange: [0, 180],
  outputRange: ['180deg', '360deg']
});

const toolFrontAnimatedStyle = {
  transform: [{ rotateY: toolFrontInterpolate }]
};
const toolBackAnimatedStyle = {
  transform: [{ rotateY: toolBackInterpolate }]
};

const getToolScore = (index) => {
  if (index < 10) return 3;
  if (index < 25) return 7;
  return 15;
};
const handleToolMatchSubmission = () => {
  const current = toolQuestions[toolIndex];
  const isCorrect = selectedTool === current.answer;

  if (isCorrect) {
    setScore(prev => prev + getToolScore(toolIndex));
    setToolResult("Tama!");
  } else {
    setWrongCount(prev => prev + 1);
    setToolResult("Mali!");
  }

  // Flip to answer side
  Animated.timing(flipToolAnim, {
    toValue: 180,
    duration: 500,
    useNativeDriver: true
  }).start(() => {
    setShowToolAnswer(true);

    // Wait for feedback display, then go to next
    setTimeout(() => {
      const nextIndex = toolIndex + 1;

      if (nextIndex < toolQuestions.length) {
        setToolIndex(nextIndex);
        setSelectedTool("");
        setToolResult("");
        setShowToolAnswer(false);
        flipToolAnim.setValue(0); // Reset flip

        // Trigger fade in for new question
        fadeToolAnim.setValue(0);
        Animated.timing(fadeToolAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start();
      } else {
        setGameOver(true);
      }
    }, 1200); // Wait before moving to next
  });
};

//-------------------------
const safetyQuestions = [
  // First 3 sample image-based questions
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ISO_7010_W001.svg/1200px-ISO_7010_W001.svg.png',
    meaning: 'General hazard',
    choices: ['Flammable Material', 'Radiation Hazard', 'General Hazard', 'No Entry'],
    answer: 'General Hazard',
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/ISO_7010_W021.svg/1200px-ISO_7010_W021.svg.png',
    meaning: 'Flammable material',
    choices: ['Biohazard', 'Flammable Material', 'Laser Hazard', 'Toxic Gas'],
    answer: 'Flammable Material',
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/ISO_7010_W003.svg/1200px-ISO_7010_W003.svg.png',
    meaning: 'Explosive material',
    choices: ['Explosive Material', 'Radiation', 'Electric Shock', 'Hot Surface'],
    answer: 'Explosive Material',
  },

  // Sample meaning-based questions (no image)
  {
    image: null,
    meaning: 'Warns that a substance can ignite and burn easily.',
    choices: ['Flammable Material', 'Fire Extinguisher', 'Corrosive', 'Radioactive'],
    answer: 'Flammable Material',
  },
  {
    image: null,
    meaning: 'Indicates biological substances that pose a threat to human health.',
    choices: ['Laser Beam', 'Corrosive', 'Biohazard', 'No Entry'],
    answer: 'Biohazard',
  },
];

// Current question index (0 to 39)
const [safetyCurrentIndex, setSafetyCurrentIndex] = useState(0);

// Holds the current question object
const [safetyCurrentQuestion, setSafetyCurrentQuestion] = useState(safetyQuestions[0]);
const [showSafetyFeedback, setShowSafetyFeedback] = useState(false); // Controls if feedback is showing
const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // true/false depending on answer
const [selectedSafetyAnswer, setSelectedSafetyAnswer] = useState(''); // What the user picked

const handleSafetySymbolAnswer = (selectedChoice) => {
  const isCorrect = selectedChoice === safetyCurrentQuestion.answer;

  setSelectedSafetyAnswer(selectedChoice);
  setIsAnswerCorrect(isCorrect);
  setShowSafetyFeedback(true);

  let newWrongCount = wrongCount;
  if (isCorrect) {
    const points = safetyCurrentIndex < 20 ? 10 : 15;
    setScore(prev => prev + points);
  } else {
    newWrongCount += 1;
    setWrongCount(newWrongCount);
    if (newWrongCount >= 3) setGameOver(true);
  }

  setTimeout(() => {
    const nextIndex = safetyCurrentIndex + 1;

    const isLastQuestion = nextIndex >= safetyQuestions.length;
    const isGameOver = isLastQuestion || newWrongCount >= 3;

    if (isGameOver) {
      setGameOver(true);
    } else {
      setSafetyCurrentIndex(nextIndex);
      setSafetyCurrentQuestion(safetyQuestions[nextIndex]);
    }

    setShowSafetyFeedback(false);
    setIsAnswerCorrect(null);
    setSelectedSafetyAnswer('');
  }, 1500);
};

//------------------------------------
const artQuestions = [
  // Easy (1–10) – 4 Points Each
  { clue: "A type of painting that uses water-soluble pigments.", answer: "Watercolor", difficulty: "easy" },
  { clue: "Primary colors include red, yellow, and...?", answer: "Blue", difficulty: "easy" },
  { clue: "A pencil drawing that only uses lines.", answer: "Sketch", difficulty: "easy" },
  { clue: "Element of art that refers to the darkness or lightness of a color.", answer: "Value", difficulty: "easy" },
  { clue: "A visual representation of something.", answer: "Picture", difficulty: "easy" },
  { clue: "The area around or within objects in art.", answer: "Space", difficulty: "easy" },
  { clue: "The feel or appearance of a surface in art.", answer: "Texture", difficulty: "easy" },
  { clue: "Tool used to apply paint.", answer: "Brush", difficulty: "easy" },
  { clue: "A color made by mixing blue and yellow.", answer: "Green", difficulty: "easy" },
  { clue: "A design or drawing made with pencils or pens.", answer: "Drawing", difficulty: "easy" },

  // Medium (11–30) – 8 Points Each
  { clue: "A Filipino artist known for the painting Spoliarium.", answer: "Juan Luna", difficulty: "medium" },
  { clue: "A decorative design or pattern repeated in a work of art.", answer: "Motif", difficulty: "medium" },
  { clue: "Element of art defined by a point moving in space.", answer: "Line", difficulty: "medium" },
  { clue: "A printmaking tool used to cut wood or linoleum.", answer: "Gouge", difficulty: "medium" },
  { clue: "A style of art that does not represent real objects.", answer: "Abstract", difficulty: "medium" },
  { clue: "An element that refers to light reflected off surfaces.", answer: "Color", difficulty: "medium" },
  { clue: "Technique using small dots to create shading.", answer: "Stippling", difficulty: "medium" },
  { clue: "The surface on which a painting is made.", answer: "Canvas", difficulty: "medium" },
  { clue: "A sculpture made by combining different materials.", answer: "Assemblage", difficulty: "medium" },
  { clue: "The study of beauty in art.", answer: "Aesthetics", difficulty: "medium" },
  { clue: "A shape with height and width only.", answer: "2D", difficulty: "medium" },
  { clue: "The repetition of elements to create rhythm in art.", answer: "Pattern", difficulty: "medium" },
  { clue: "A style of art that looks real or lifelike.", answer: "Realism", difficulty: "medium" },
  { clue: "Combining visual elements to create a whole.", answer: "Unity", difficulty: "medium" },
  { clue: "The visual weight of elements in an artwork.", answer: "Balance", difficulty: "medium" },
  { clue: "Process of removing material to create sculpture.", answer: "Carving", difficulty: "medium" },
  { clue: "A mural painter and one of the Thirteen Moderns.", answer: "Carlos Francisco", difficulty: "medium" },
  { clue: "A traditional Filipino cloth weaving from the Ilocos Region.", answer: "Inabel", difficulty: "medium" },
  { clue: "A famous festival in Lucban, Quezon showcasing art with kiping.", answer: "Pahiyas", difficulty: "medium" },
  { clue: "Art using digital technology as a medium.", answer: "Digital", difficulty: "medium" },

  // Hard (31–40) – 15 Points Each
  { clue: "A technique using wax and dye in textile art.", answer: "Batik", difficulty: "hard" },
  { clue: "Prehistoric art found in cave walls.", answer: "Petroglyphs", difficulty: "hard" },
  { clue: "A three-dimensional form with height, width, and depth.", answer: "Sculpture", difficulty: "hard" },
  { clue: "A technique using overlapping to show depth.", answer: "Perspective", difficulty: "hard" },
  { clue: "Painting style characterized by light and color, seen in Monet’s works.", answer: "Impressionism", difficulty: "hard" },
  { clue: "A method of etching designs on glass or metal using acid.", answer: "Engraving", difficulty: "hard" },
  { clue: "The golden ratio is often used to achieve this in art.", answer: "Proportion", difficulty: "hard" },
  { clue: "An art movement with dreamlike or irrational subjects.", answer: "Surrealism", difficulty: "hard" },
  { clue: "He painted “The Parisian Life,” a significant Philippine painting.", answer: "Juan Luna", difficulty: "hard" },
  { clue: "The art of creating images with a camera.", answer: "Photography", difficulty: "hard" },
];

const [artCurrentIndex, setArtCurrentIndex] = useState(0); // Tracks current question index
const [artCurrentQuestion, setArtCurrentQuestion] = useState(artQuestions[0]); // Holds current question
const [userArtAnswer, setUserArtAnswer] = useState(''); // Stores user input
const [artFeedback, setArtFeedback] = useState(''); // Shows feedback message
const [showArtFeedback, setShowArtFeedback] = useState(false); // Controls visibility of feedback
const [draggedAnswer, setDraggedAnswer] = useState(null);

const DraggableWord = ({ word, onDrop }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        onDrop(word);  // Call drop handler
        pan.setValue({ x: 0, y: 0 }); // Reset position
      }
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), { margin: 6 }]}
    >
      <View style={{
        backgroundColor: '#ffe0b2',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ff9800'
      }}>
        <Text style={{ fontSize: 16, color: '#bf360c' }}>{word}</Text>
      </View>
    </Animated.View>
  );
};

const DropZone = ({ clue }) => (
  <View style={{
    backgroundColor: '#fff3e0',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffb74d',
    marginBottom: 20,
    alignItems: 'center'
  }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#e65100' }}>
      Clue:
    </Text>
    <Text style={{ fontSize: 20, color: '#bf360c', marginTop: 8 }}>
      {clue}
    </Text>
  </View>
);
const handleDropAnswer = (droppedWord) => {
  const isCorrect = droppedWord.toLowerCase() === artCurrentQuestion.answer.toLowerCase();

  if (isCorrect) {
    let points = 0;
    switch (artCurrentQuestion.difficulty) {
      case 'easy': points = 4; break;
      case 'medium': points = 8; break;
      case 'hard': points = 15; break;
    }
    setScore(prev => prev + points);
    setArtFeedback('Correct! Great job!');
  } else {
    setWrongCount(prev => {
      const newWrong = prev + 1;
      if (newWrong >= 3) setGameOver(true);
      return newWrong;
    });
    setArtFeedback(`Incorrect. The correct answer is: ${artCurrentQuestion.answer}`);
  }

  setShowArtFeedback(true);

  setTimeout(() => {
    const nextIndex = artCurrentIndex + 1;
    if (nextIndex >= artQuestions.length || wrongCount + (isCorrect ? 0 : 1) >= 3) {
      setGameOver(true);
    } else {
      setArtCurrentIndex(nextIndex);
      setArtCurrentQuestion(artQuestions[nextIndex]);
      setShowArtFeedback(false);
      setArtFeedback('');
    }
  }, 1500);
};

const shuffledChoices = useMemo(() => {
  if (!artCurrentQuestion) return [];
  
  const correct = artCurrentQuestion.answer;
  const wrongAnswers = artQuestions
    .filter(q => q.answer !== correct) // get wrong answers
    .sort(() => 0.5 - Math.random()) // shuffle
    .slice(0, 2) // get 2 wrong answers
    .map(q => q.answer);

  const allChoices = [correct, ...wrongAnswers].sort(() => 0.5 - Math.random());
  
  return allChoices;
}, [artCurrentQuestion]);


const musicNoteQuestions = [
  // Easy (1–10) – 4 Points Each
  { clue: "This note is represented by a round shape with no stem.", answer: "Whole Note", difficulty: "easy" },
  { clue: "A note with a filled-in oval and a stem, but no flag.", answer: "Quarter Note", difficulty: "easy" },
  { clue: "A note with a stem and one flag.", answer: "Eighth Note", difficulty: "easy" },
  { clue: "A note with a stem and two flags.", answer: "Sixteenth Note", difficulty: "easy" },
  { clue: "A note with no stem, only a single dot.", answer: "Half Note", difficulty: "easy" },
  { clue: "This note is often associated with silence in music.", answer: "Rest", difficulty: "easy" },
  { clue: "A note that gets half the duration of a half note.", answer: "Quarter Note", difficulty: "easy" },
  { clue: "A note that represents a short burst of sound, often half the length of a quarter note.", answer: "Eighth Note", difficulty: "easy" },
  { clue: "A note with no stem but looks like a filled-in circle.", answer: "Dotted Whole Note", difficulty: "easy" },
  { clue: "The note that divides the duration of a whole note in half.", answer: "Half Note", difficulty: "easy" },

  // Medium (11–30) – 8 Points Each
  { clue: "A symbol that indicates the tempo or speed of music.", answer: "Metronome", difficulty: "medium" },
  { clue: "The musical symbol indicating silence.", answer: "Rest", difficulty: "medium" },
  { clue: "A musical scale consisting of eight notes.", answer: "Octave", difficulty: "medium" },
  { clue: "This term refers to a specific part of the musical staff where notes are placed.", answer: "Clef", difficulty: "medium" },
  { clue: "A symbol that raises the pitch of a note by a half-step.", answer: "Sharp", difficulty: "medium" },
  { clue: "The note that signifies one beat in a 4/4 time signature.", answer: "Quarter Note", difficulty: "medium" },
  { clue: "A musical term that refers to the gradual increase in loudness.", answer: "Crescendo", difficulty: "medium" },
  { clue: "A note that holds for two beats in a 4/4 time signature.", answer: "Half Note", difficulty: "medium" },
  { clue: "A note that holds for four beats in 4/4 time.", answer: "Whole Note", difficulty: "medium" },
  { clue: "A musical term meaning gradually getting softer.", answer: "Diminuendo", difficulty: "medium" },

  // Hard (31–40) – 15 Points Each
  { clue: "A note that holds for one and a half beats in 4/4 time.", answer: "Dotted Quarter Note", difficulty: "hard" },
  { clue: "The symbol for a note that is one step higher than a note without the sharp sign.", answer: "Sharp", difficulty: "hard" },
  { clue: "A note that represents half the value of a quarter note.", answer: "Eighth Note", difficulty: "hard" },
  { clue: "This note's value is equal to the sum of a half note and a quarter note.", answer: "Dotted Half Note", difficulty: "hard" },
  { clue: "A rest that signifies silence for a whole note's duration.", answer: "Whole Rest", difficulty: "hard" },
  { clue: "The time signature with four beats per measure, commonly used in popular music.", answer: "4/4 Time", difficulty: "hard" },
  { clue: "A musical symbol that indicates the absence of a note or sound.", answer: "Rest", difficulty: "hard" },
  { clue: "This term refers to the space between two notes on a staff.", answer: "Interval", difficulty: "hard" },
  { clue: "The symbol used to indicate a note is raised by a half-step.", answer: "Sharp", difficulty: "hard" },
  { clue: "This musical sign indicates the note is lowered by a half-step.", answer: "Flat", difficulty: "hard" },
];

// Music-specific state variables
const [musicFeedbackVisible, setMusicFeedbackVisible] = useState(false); // To show or hide feedback for answers in the music game
const [musicFeedbackMessage, setMusicFeedbackMessage] = useState(""); // Feedback message after each answer in the music game
const [currentMusicQuestionIndex, setCurrentMusicQuestionIndex] = useState(0); // Index of the current music question
const [currentMusicQuestion, setCurrentMusicQuestion] = useState(musicNoteQuestions[0]); // Current question from musicNoteQuestions

const [shuffledMusicChoices, setShuffledMusicChoices] = useState([]);
const dropZoneRef = useRef(null);
const musicDropZoneLayout = useRef(null);

const onDropZoneLayout = (event) => {
  const { x, y, width, height } = event.nativeEvent.layout;
  musicDropZoneLayout.current = { x, y, width, height };
};
useEffect(() => {
  const choices = [
    currentMusicQuestion.answer,
    ...musicNoteQuestions
      .filter(q => q !== currentMusicQuestion)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(q => q.answer),
  ];
  setShuffledMusicChoices(choices.sort(() => 0.5 - Math.random()));
}, [currentMusicQuestion]);

const DraggableMusicNote = ({ note }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        const drop = musicDropZoneLayout.current;
        if (drop) {
          const { moveX, moveY } = gestureState;
          const inZone =
            moveX >= drop.x &&
            moveX <= drop.x + drop.width &&
            moveY >= drop.y &&
            moveY <= drop.y + drop.height;

          if (inZone) {
            handleMusicNoteDrop(note); // <<<<<< This must be called
          }
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), {
        padding: 12,
        backgroundColor: '#90caf9',
        borderRadius: 10,
        margin: 6,
      }]}
    >
      <Text style={{ fontSize: 16, color: '#0d47a1', fontWeight: 'bold' }}>{note}</Text>
    </Animated.View>
  );
};
const MusicDropZone = () => (
  <View
    onLayout={(event) => {
      const { x, y, width, height } = event.nativeEvent.layout;
      musicDropZoneLayout.current = { x, y, width, height };
    }}
    style={{
      borderWidth: 2,
      borderColor: '#2196f3',
      borderStyle: 'dashed',
      borderRadius: 10,
      padding: 30,
      marginVertical: 20,
      alignItems: 'center',
      backgroundColor: '#e3f2fd',
    }}
  >
    <Text style={{ fontSize: 16, color: '#1565c0' }}>
      Drag the correct note here
    </Text>
  </View>
);
// Function to handle the drop action for matching notes
const handleMusicNoteDrop = (droppedNote) => {
  const isCorrect = droppedNote.toLowerCase() === currentMusicQuestion.answer.toLowerCase();

  if (isCorrect) {
    let points = 0;
    switch (currentMusicQuestion.difficulty) {
      case 'easy': points = 4; break;
      case 'medium': points = 8; break;
      case 'hard': points = 15; break;
    }
    setMusicScore(prev => prev + points);
    setMusicFeedbackMessage('Correct! Great job!');
  } else {
    setWrongMusicCount(prev => {
      const newWrong = prev + 1;
      if (newWrong >= 3) setMusicGameOver(true);
      return newWrong;
    });
    setMusicFeedbackMessage(`Incorrect. The correct answer is: ${currentMusicQuestion.answer}`);
  }

  setMusicFeedbackVisible(true);

  setTimeout(() => {
    const nextIndex = currentMusicQuestionIndex + 1;
    if (nextIndex >= musicNoteQuestions.length || wrongMusicCount + (isCorrect ? 0 : 1) >= 3) {
      setMusicGameOver(true);
    } else {
      setCurrentMusicQuestionIndex(nextIndex);
      setCurrentMusicQuestion(musicNoteQuestions[nextIndex]);
      setMusicFeedbackVisible(false);
      setMusicFeedbackMessage('');
    }
  }, 1500);
};
const snakeAndLaddersLayout = (
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{ flex: 1, backgroundColor: '#f0f4c3', alignItems: 'center', paddingTop: 20 }}>
      

      {/* Game Board */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: 300,  // Adjust board size
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 10,
          padding: 5,
          borderColor: '#4caf50',
          borderWidth: 2,
          marginBottom: 20,
        }}
      >
        {Array.from({ length: 100 }, (_, i) => {
          const pos = 100 - i;
          const isPlayerHere = playerPosition === pos;
          const isLadder = ladders[pos];
          const isSnake = snakes[pos];
          const cellColor = isPlayerHere
            ? '#81c784'
            : isLadder
              ? '#ffee58'
              : isSnake
                ? '#ef5350'
                : '#fff';

          const emoji = isPlayerHere
            ? '🧍'
            : isLadder
              ? '🪜'
              : isSnake
                ? '🐍'
                : '';

          return (
            <View
              key={pos}
              style={{
                width: 30,  // Adjust cell size
                height: 30,
                borderWidth: 1,
                borderColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: cellColor,
                borderRadius: 5,
                margin: 2,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 12, color: '#000', fontWeight: 'bold' }}>{pos}</Text>
              <Text style={{ fontSize: 16 }}>{emoji}</Text>
            </View>
          );
        })}
      </View>

      {/* Answer Input */}
      <View style={{ marginVertical: 15, width: '85%' }}>
        <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'center' }}>Answer this to roll dice:</Text>
        <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center', color: '#ff9800' }}>
          {questions[currentQuestionIndex].question}
        </Text>
        <TextInput
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Your Answer"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#fff',
            fontSize: 16,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#4caf50',
            padding: 14,
            borderRadius: 8,
            marginTop: 10,
            elevation: 3,
          }}
          onPress={handleSubmitAnswer}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Submit Answer</Text>
        </TouchableOpacity>
      </View>
{message !== '' && (
  <View style={{ padding: 10 }}>
    <Text style={{ fontSize: 16, color: '#d32f2f', textAlign: 'center' }}>{message}</Text>
  </View>
)}
      {/* Dice Roll Info */}
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: '#3e2723' }}>
          Dice Roll: {diceValue !== null ? `🎲 ${diceValue}` : 'Roll after correct answer'}
        </Text>
        <Text style={{ fontSize: 14, marginTop: 5, textAlign: 'center', color: '#3e2723' }}>
          (Goal: Reach 36! Ladders 🪜: {Object.keys(ladders).join(', ')} | Snakes 🐍: {Object.keys(snakes).join(', ')})
        </Text>
      </View>
    </View>
  </ScrollView>
);
  



const AnimatedG = Animated.createAnimatedComponent(G);
const [fractionFeedback, setFractionFeedback] = useState(null); // 'correct' | 'incorrect' | null

const layoutFractions = (() => {
  const q = allFractionQuestions[fractionIndex];

  // Create animated scale refs for each slice
  const scaleValues = useRef(
    Array.from({ length: q.denominator }, () => new Animated.Value(1))
  ).current;

  const handleSliceTap = (index) => {
    Vibration.vibrate(10);

    // Animate bounce effect
    Animated.sequence([
      Animated.timing(scaleValues[index], {
        toValue: 1.15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValues[index], {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle slice selection
    setSelectedSlices((prev) =>
      prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]
    );
  };

  if (q.type === 'identify') {
    const radius = 80;
    const cx = 100;
    const cy = 100;

    const createSlice = (index, total) => {
      const angle = (2 * Math.PI) / total;
      const x1 = cx + radius * Math.sin(index * angle);
      const y1 = cy - radius * Math.cos(index * angle);
      const x2 = cx + radius * Math.sin((index + 1) * angle);
      const y2 = cy - radius * Math.cos((index + 1) * angle);
      const largeArcFlag = angle > Math.PI ? 1 : 0;

      return `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
    };

    return (
      <View style={{ marginTop: 40, alignItems: 'center', backgroundColor: '#F0F8FF', flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#4B0082' }}>
          Choose {q.numerator} slice{q.numerator > 1 ? 's' : ''} of {q.denominator}
        </Text>

        <Svg width={220} height={220}>
          {Array.from({ length: q.denominator }).map((_, i) => {
            const isSelected = selectedSlices.includes(i);
            return (
              <AnimatedG
                key={i}
                onPress={() => handleSliceTap(i)}
                style={{ transform: [{ scale: scaleValues[i] }] }}
              >
                <Path
                  d={createSlice(i, q.denominator)}
                  fill={isSelected ? '#FFA500' : '#E0E0E0'}
                  stroke="#555"
                  strokeWidth={2}
                  opacity={isSelected ? 1 : 0.8}
                />
              </AnimatedG>
            );
          })}
        </Svg>

        <TouchableOpacity
          onPress={() => {
            Vibration.vibrate(20);
            handleFractionSubmit();
          }}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#FF6347',
            paddingVertical: 14,
            paddingHorizontal: 40,
            borderRadius: 30,
            marginTop: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Submit</Text>
        </TouchableOpacity>
{fractionFeedback && (
  <Text
    style={{
      marginTop: 15,
      fontSize: 18,
      fontWeight: 'bold',
      color: fractionFeedback === 'correct' ? '#2E8B57' : '#DC143C',
    }}
  >
    {fractionFeedback === 'correct' ? 'Correct! Great job!' : 'Incorrect'}
  </Text>
)}
        {gameOver && (
          <Text style={{ marginTop: 15, fontSize: 18, color: '#B22222', fontWeight: 'bold' }}>
            Game Over
          </Text>
        )}
      </View>
    );
  }

  // Arithmetic question fallback
  return (
    <View style={{ marginTop: ggg40, alignItems: 'center', backgroundColor: '#F0F8FF', flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: '600', color: '#1E90FF', marginBottom: 20 }}>
        {q.frac1.n}/{q.frac1.d}{' '}
        {q.type === 'add' ? '+' : q.type === 'subtract' ? '−' : q.type === 'multiply' ? '×' : '÷'}{' '}
        {q.frac2.n}/{q.frac2.d}
      </Text>
      <TextInput
        value={userFractionAnswer}
        onChangeText={setUserFractionAnswer}
        placeholder="Type your answer e.g., 3/4"
        style={{
          width: 180,
          height: 45,
          borderColor: '#1E90FF',
          borderWidth: 2,
          borderRadius: 10,
          paddingHorizontal: 10,
          fontSize: 18,
          backgroundColor: '#fff',
          marginBottom: 20,
          textAlign: 'center',
          color: '#000',
          elevation: 2,
        }}
      />
      <TouchableOpacity
        onPress={() => {
          Vibration.vibrate(20);
          handleFractionSubmit();
        }}
        activeOpacity={0.85}
        style={{
          backgroundColor: '#FF6347',
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 30,
          marginTop: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Submit</Text>
      </TouchableOpacity>
{fractionFeedback && (
  <Text
    style={{
      marginTop: 15,
      fontSize: 18,
      fontWeight: 'bold',
      color: fractionFeedback === 'correct' ? '#2E8B57' : '#DC143C',
    }}
  >
    {fractionFeedback === 'correct' ? 'Correct! Great job!' : 'Incorrect'}
  </Text>
)}
      {gameOver && (
        <Text style={{ marginTop: 15, fontSize: 18, color: '#B22222', fontWeight: 'bold' }}>
          Game Over
        </Text>
      )}
    </View>
  );
})();

const wordScrambleGameLayout = (
  <View style={{ flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center' }}>
    {selectedDifficulty === null ? (
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50' }}>Select Difficulty</Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#8bc34a',
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 25,
            marginTop: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
          onPress={() => { setSelectedDifficulty('easy'); startNewRound(); }}
        >
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#ff9800',
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 25,
            marginTop: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
          onPress={() => { setSelectedDifficulty('medium'); startNewRound(); }}
        >
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#f44336',
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 25,
            marginTop: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
          onPress={() => { setSelectedDifficulty('hard'); startNewRound(); }}
        >
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Hard</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 25,
          width: 300,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 8,
        }}>
          {/* Display the scrambled word */}
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#4CAF50' }}>
            Scrambled Word: {scrambledWord}
          </Text>

          {/* Display the clue (meaning of the word) */}
          <Text style={{ fontSize: 18, marginBottom: 20, fontStyle: 'italic', color: '#757575' }}>
            Clue: {currentMeaning}
          </Text>

          {/* User input for guessing */}
          <TextInput
            style={{
              borderWidth: 2,
              padding: 10,
              width: 200,
              marginTop: 10,
              textAlign: 'center',
              fontSize: 18,
              borderRadius: 10,
              borderColor: '#4CAF50',
            }}
            value={userGuess}
            onChangeText={setUserGuess}
            placeholder="Enter your guess"
            placeholderTextColor="#757575"
          />

          {/* Submit button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#8bc34a',
              paddingVertical: 15,
              paddingHorizontal: 50,
              borderRadius: 25,
              marginTop: 20,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
            onPress={handleGuess}
          >
            <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Submit Guess</Text>
          </TouchableOpacity>

          {/* Score and wrong attempts */}
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4CAF50' }}>Score: {score}</Text>
            <Text style={{ fontSize: 18, marginTop: 5, color: '#f44336' }}>
              Wrong Attempts: {wrongCount}/3
            </Text>
          </View>
        </View>
      </View>
    )}
  </View>
);

const grammarQuestGameLayout = (
  <View style={{ flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center' }}>
    {grammarDifficulty === null ? (
      // Difficulty Selection Screen
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3F51B5' }}>
          Grammar Quest: Select Difficulty
        </Text>

        {/* Easy Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#8bc34a',
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 25,
            marginTop: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
          onPress={() => {
            setGrammarDifficulty('easy');
            startGrammarNewRound('easy');  // Pass difficulty level
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Easy</Text>
        </TouchableOpacity>

        {/* Medium Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ff9800',
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 25,
            marginTop: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
          onPress={() => {
            setGrammarDifficulty('medium');
            startGrammarNewRound('medium');  // Pass difficulty level
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Medium</Text>
        </TouchableOpacity>

        {/* Hard Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#f44336',
            paddingVertical: 15,
            paddingHorizontal: 50,
            borderRadius: 25,
            marginTop: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
          onPress={() => {
            setGrammarDifficulty('hard');
            startGrammarNewRound('hard');  // Pass difficulty level
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Hard</Text>
        </TouchableOpacity>
      </View>
    ) : currentGrammarQuestion ? (
      // Main Question Area
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 25,
            width: 300,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 20,
              color: '#3F51B5',
              textAlign: 'center',
            }}
          >
            {currentGrammarQuestion.question}
          </Text>

          {/* Options List */}
          {currentGrammarQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: selectedGrammarOption === option ? '#c5e1a5' : '#e0e0e0',
                padding: 12,
                borderRadius: 10,
                marginTop: 10,
                width: '100%',
              }}
              onPress={() => setSelectedGrammarOption(option)}
            >
              <Text style={{ fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}

          {/* Submit Answer Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#8bc34a',
              paddingVertical: 15,
              paddingHorizontal: 50,
              borderRadius: 25,
              marginTop: 20,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
            onPress={handleGrammarAnswer}
          >
            <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Submit Answer</Text>
          </TouchableOpacity>

          {/* Score and Wrong Attempts */}
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4CAF50' }}>
              Score: {score}
            </Text>
            <Text style={{ fontSize: 16, color: '#f44336', marginTop: 5 }}>
              Wrong Attempts: {wrongCount}/3
            </Text>
          </View>
        </View>
      </View>
    ) : null}
  </View>
);

const scienceTriviaGameLayout = (
  <View style={{ flex: 1, backgroundColor: '#e8f5e9', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
    { triviaCurrentQuestion ? (
      // Question Display
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          width: '100%',
          maxWidth: 350,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1b5e20', marginBottom: 15 }}>
          {triviaCurrentQuestion.question}
        </Text>

        {triviaCurrentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setTriviaSelectedOption(option)}
            style={{
              backgroundColor: triviaSelectedOption === option ? '#a5d6a7' : '#eeeeee',
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>{option}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={{
            backgroundColor: '#66bb6a',
            paddingVertical: 12,
            borderRadius: 20,
            marginTop: 15,
            alignItems: 'center',
          }}
          onPress={handleTriviaAnswerSubmission}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Submit Answer</Text>
        </TouchableOpacity>

        {/* Score and Wrong Count */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#388e3c' }}>Score: {score}</Text>
          <Text style={{ fontSize: 16, color: '#f44336', marginTop: 5 }}>
            Wrong Attempts: {wrongCount}/3
          </Text>
        </View>
      </View>
    ) : (
      // Loading fallback
      <Text style={{ fontSize: 18, color: '#555' }}>Loading Trivia Questions...</Text>
    )}
  </View>
);

const periodicTableGameLayout = (
  <View style={{ flex: 1, backgroundColor: '#e3f2fd', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
    {gameOver ? (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1565c0', marginBottom: 20 }}>
          Game Over!
        </Text>
        <Text style={{ fontSize: 20, color: '#1e88e5' }}>Final Score: {score}</Text>
      </View>
    ) : elementCurrentQuestion ? (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          width: '100%',
          maxWidth: 350,
          elevation: 5,
          alignItems: 'center',
        }}
      >
        <View style={{
          backgroundColor: '#bbdefb',
          padding: 30,
          borderRadius: 20,
          marginBottom: 20,
          width: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#0d47a1' }}>
            {elementCurrentQuestion.symbol}
          </Text>
        </View>

        <TextInput
          placeholder="Enter element name"
          value={elementUserInput}
          onChangeText={setElementUserInput}
          style={{
            borderWidth: 1,
            borderColor: '#90caf9',
            borderRadius: 10,
            padding: 10,
            width: '100%',
            marginBottom: 15,
            fontSize: 16,
            backgroundColor: '#f1f8ff'
          }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#42a5f5',
            paddingVertical: 12,
            borderRadius: 20,
            alignItems: 'center',
            width: '100%',
          }}
          onPress={handleElementAnswerSubmission}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Submit Answer</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#1565c0' }}>Score: {score}</Text>
          <Text style={{ fontSize: 16, color: '#e53935', marginTop: 5 }}>
            Wrong Attempts: {wrongCount}/3
          </Text>
        </View>
      </View>
    ) : (
      <Text style={{ fontSize: 18, color: '#555' }}>Loading Element Questions...</Text>
    )}
  </View>
);

const bugtongQuizLayout = (
  <View style={{ flex: 1, backgroundColor: '#e8f5e9', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
  {gameOver ? (
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#388e3c' }}>Tapos na ang laro!</Text>
  ) : (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1b5e20', marginBottom: 15 }}>
        Bugtong #{bugtongIndex + 1}
      </Text>
      <Text style={{ fontSize: 16, color: '#4e342e', marginBottom: 15 }}>
        {bugtongQuestions[bugtongIndex].question}
      </Text>

      <TextInput
        value={bugtongUserAnswer}
        onChangeText={setBugtongUserAnswer}
        placeholder="Isulat ang sagot sa bugtong..."
        style={{
          backgroundColor: '#f1f8e9',
          padding: 10,
          borderRadius: 10,
          fontSize: 16,
          borderWidth: 1,
          borderColor: '#c8e6c9',
          marginBottom: 15,
        }}
      />

      <TouchableOpacity
        onPress={handleBugtongAnswerSubmission}
        style={{
          backgroundColor: '#66bb6a',
          paddingVertical: 12,
          borderRadius: 20,
          alignItems: 'center',
          marginBottom: 15,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Isumite ang Sagot</Text>
      </TouchableOpacity>
{showBugtongAnswer && (
  <Text style={{ color: 'red', marginTop: 10 }}>
    Tamang Sagot: {bugtongQuestions[bugtongIndex].answer}
  </Text>
)}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#388e3c' }}>Score: {score}</Text>
        <Text style={{ fontSize: 16, color: '#f44336', marginTop: 5 }}>
          Maling Sagot: {wrongCount}/3
        </Text>
      </View>
    </View>
  )}
</View>
);

const kahuluganMatchGameLayout = (
  <View style={{ flex: 1, backgroundColor: '#fff3e0', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
    {gameOver ? (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ef6c00', marginBottom: 20 }}>
          Game Over!
        </Text>
        <Text style={{ fontSize: 20, color: '#fb8c00' }}>Final Score: {score}</Text>
      </View>
    ) : kahuluganQuestions[kahuluganIndex] ? (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          width: '100%',
          maxWidth: 400,
          elevation: 5,
          alignItems: 'center',
        }}
      >
        {/* Matalinghagang Salita */}
        <View
          style={{
            backgroundColor: '#ffe0b2',
            padding: 25,
            borderRadius: 20,
            marginBottom: 20,
            minWidth: 150,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#e65100', textAlign: 'center' }}>
            {kahuluganQuestions[kahuluganIndex].word}
          </Text>
        </View>

        {/* Options */}
        <View style={{ width: '100%' }}>
          {kahuluganQuestions[kahuluganIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedKahuluganOption(option)}
              style={{
                backgroundColor: selectedKahuluganOption === option ? '#fb8c00' : '#fff8e1',
                borderColor: '#ffcc80',
                borderWidth: 1,
                padding: 12,
                marginVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 16, color: selectedKahuluganOption === option ? '#fff' : '#bf360c' }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Show correct answer if wrong */}
        {showKahuluganAnswer && (
          <Text style={{ marginTop: 10, color: '#d84315', fontWeight: '500' }}>
            Tamang Sagot: {kahuluganQuestions[kahuluganIndex].answer}
          </Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#f57c00',
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 25,
            marginTop: 20,
          }}
          onPress={handleKahuluganAnswerSubmission}
          disabled={!selectedKahuluganOption}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Isumite</Text>
        </TouchableOpacity>

        {/* Score Info */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#e65100' }}>Score: {score}</Text>
          <Text style={{ fontSize: 16, color: '#e53935', marginTop: 5 }}>
            Wrong Attempts: {wrongCount}/3
          </Text>
        </View>
      </View>
    ) : (
      <Text style={{ fontSize: 18, color: '#555' }}>Loading Kahulugan Questions...</Text>
    )}
  </View>
);

const whoAmIHeroGameLayout = (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    {!gameOver ? (
      <>
        <Animated.View
          style={{
          opacity: fadeAnim,
            width: 300,
            height: 400,
            position: 'absolute',
            backgroundColor: '#e3f2fd',
            borderRadius: 16,
            padding: 20,
            backfaceVisibility: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotateY: frontInterpolate }],
            zIndex: showHeroAnswer ? 0 : 1
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
            {heroQuestions[heroIndex].clue}
          </Text>

          {/* Hero Options */}
          {heroQuestions[heroIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: selectedHeroAnswer === option ? '#90caf9' : '#e0e0e0',
                padding: 10,
                borderRadius: 10,
                marginVertical: 5,
                width: '100%',
                alignItems: 'center'
              }}
              onPress={() => setSelectedHeroAnswer(option)}
              disabled={showHeroAnswer}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={{
              marginTop: 15,
              backgroundColor: '#42a5f5',
              padding: 10,
              borderRadius: 10
            }}
            onPress={handleHeroAnswerSubmission}
            disabled={!selectedHeroAnswer || showHeroAnswer}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            width: 300,
            height: 400,
            position: 'absolute',
            backgroundColor: '#fff8e1',
            borderRadius: 16,
            padding: 20,
            backfaceVisibility: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotateY: backInterpolate }]
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            {heroQuestions[heroIndex].answer}
          </Text>
          <Image
  source={{ uri: heroQuestions[heroIndex].image }}
  style={{ width: 180, height: 220, borderRadius: 10 }}
  resizeMode="cover"
/>
        </Animated.View>
      </>
    ) : (
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Game Over! Final Score: {score}
      </Text>
    )}
  </View>
);

const factOrMythLayout = (
  <View style={{ flex: 1, backgroundColor: '#f3e5f5', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    {!gameOver ? (
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        width: '100%',
        maxWidth: 340
      }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
          Fact or Myth?
        </Text>

        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          {factOrMythQuestions[factIndex].statement}
        </Text>

        <TouchableOpacity
          onPress={() => setSelectedFactAnswer('Fact')}
          style={{
            backgroundColor: selectedFactAnswer === 'Fact' ? '#ba68c8' : '#ce93d8',
            padding: 12,
            borderRadius: 12,
            marginBottom: 10,
            alignItems: 'center'
          }}
          disabled={showFactFeedback}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedFactAnswer('Myth')}
          style={{
            backgroundColor: selectedFactAnswer === 'Myth' ? '#ba68c8' : '#ce93d8',
            padding: 12,
            borderRadius: 12,
            marginBottom: 10,
            alignItems: 'center'
          }}
          disabled={showFactFeedback}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Myth</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFactOrMythSubmission}
          disabled={!selectedFactAnswer || showFactFeedback}
          style={{
            backgroundColor: '#8e24aa',
            padding: 12,
            borderRadius: 12,
            marginTop: 15,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>

        {showFactFeedback && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{factResult}</Text>
            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 5 }}>
              {factOrMythQuestions[factIndex].explanation}
            </Text>
          </View>
        )}
      </View>
    ) : (
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6a1b9a' }}>
        Game Over! Final Score: {score}
      </Text>
    )}
  </View>
);

const virtueMatchLayout = (
  <View style={{ flex: 1, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    {!gameOver ? (
      <View style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        width: '100%',
        maxWidth: 360
      }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#388e3c' }}>
          {virtueSituations[virtueIndex].situation}
        </Text>

        {["Katapatan", "Paggalang", "Responsibilidad", "Pagpapakumbaba"].map((virtue, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedVirtue(virtue)}
            style={{
              backgroundColor: selectedVirtue === virtue ? '#81c784' : '#c8e6c9',
              padding: 12,
              borderRadius: 12,
              marginBottom: 10,
              alignItems: 'center'
            }}
            disabled={showVirtueFeedback}
          >
            <Text style={{ color: '#1b5e20', fontWeight: 'bold' }}>{virtue}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleVirtueMatchSubmission}
          disabled={!selectedVirtue || showVirtueFeedback}
          style={{
            backgroundColor: '#4caf50',
            padding: 12,
            borderRadius: 12,
            marginTop: 15,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Isumite</Text>
        </TouchableOpacity>

        {showVirtueFeedback && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{virtueResult}</Text>
            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 5 }}>
              {virtueSituations[virtueIndex].explanation}
            </Text>
          </View>
        )}
      </View>
    ) : (
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1b5e20' }}>
        Tapos na! Kabuuang Iskor: {score}
      </Text>
    )}
  </View>
);
const rolePlayScenariosLayout = (
  <View style={{ flex: 1, backgroundColor: '#e1f5fe', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    {!gameOver ? (
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        width: '100%',
        maxWidth: 350
      }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
          Role Play Scenarios
        </Text>

        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          {rolePlayScenarios[rolePlayIndex].scenario}
        </Text>

        {rolePlayScenarios[rolePlayIndex].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedRolePlayAnswer(option)}
            style={{
              backgroundColor: selectedRolePlayAnswer === option ? '#64b5f6' : '#81d4fa',
              padding: 12,
              borderRadius: 12,
              marginBottom: 12,
              alignItems: 'center',
              width: '100%',
            }}
            disabled={showRolePlayFeedback}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{option}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleRolePlaySubmission}
          disabled={!selectedRolePlayAnswer || showRolePlayFeedback}
          style={{
            backgroundColor: '#0288d1',
            padding: 12,
            borderRadius: 12,
            marginTop: 15,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>

        {showRolePlayFeedback && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
              {rolePlayResult}
            </Text>
            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 5 }}>
              {rolePlayScenarios[rolePlayIndex].explanation}
            </Text>
          </View>
        )}
      </View>
    ) : (
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0277bd' }}>
        Game Over! Final Score: {score}
      </Text>
    )}
  </View>
);

const toolIdentificationLayout = (
  <View style={{ flex: 1, backgroundColor: '#fffbe6', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    {!gameOver ? (
      <Animated.View style={{ opacity: fadeAnim, width: 300, maxWidth: '100%' }}>
        

        <View style={{ width: '100%', height: 300, marginBottom: 10 }}>
          {!showToolAnswer ? (
            <Animated.View style={[{
              backgroundColor: '#fff3e0',
              borderRadius: 16,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backfaceVisibility: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 6,
              elevation: 3
            }, toolFrontAnimatedStyle]}>
              <Text style={{ fontSize: 18, textAlign: 'center', color: '#e65100' }}>
                {toolQuestions[toolIndex].question}
              </Text>
            </Animated.View>
          ) : (
            <Animated.View style={[{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: '#ffe0b2',
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              backfaceVisibility: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 6,
              elevation: 3
            }, toolBackAnimatedStyle]}>
              <Image source={toolQuestions[toolIndex].image} style={{ width: 120, height: 120, marginBottom: 10 }} resizeMode="contain" />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#bf360c' }}>
                {toolQuestions[toolIndex].answer}
              </Text>
              <Text style={{ marginTop: 10, fontSize: 14, color: '#5d4037' }}>{toolResult}</Text>
            </Animated.View>
          )}
        </View>

        {!showToolAnswer && (
          toolQuestions.slice(toolIndex, toolIndex + 4).map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTool(item.answer)}
              style={{
                backgroundColor: selectedTool === item.answer ? '#ffcc80' : '#ffe9c3',
                padding: 10,
                borderRadius: 10,
                marginTop: 8,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ffb74d'
              }}
            >
              <Text style={{ color: '#e65100', fontWeight: 'bold' }}>{item.answer}</Text>
            </TouchableOpacity>
          ))
        )}

        {!showToolAnswer && (
          <TouchableOpacity
            onPress={handleToolMatchSubmission}
            disabled={!selectedTool}
            style={{
              backgroundColor: '#fb8c00',
              padding: 12,
              borderRadius: 10,
              marginTop: 15,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    ) : (
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#e65100', textAlign: 'center' }}>
        Tapos na! Kabuuang Iskor: {score}
      </Text>
    )}
  </View>
);

const safetySymbolGameLayout = (
  <View style={{ flex: 1, backgroundColor: '#e3f2fd', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
    {gameOver ? (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0d47a1', marginBottom: 10 }}>
          Safety Quiz Complete!
        </Text>
        <Text style={{ fontSize: 22, color: '#1976d2' }}>Final Score: {score}</Text>
      </View>
    ) : safetyCurrentQuestion ? (
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 24,
          padding: 24,
          width: '100%',
          maxWidth: 420,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {safetyCurrentQuestion.image ? (
            <Image
              source={{ uri: safetyCurrentQuestion.image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#42a5f5',
                marginBottom: 12,
              }}
              resizeMode="contain"
            />
          ) : (
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#1565c0',
                textAlign: 'center',
              }}
            >
              {safetyCurrentQuestion.meaning}
            </Text>
          )}
        </View>

        {showSafetyFeedback ? (
  <View style={{ marginTop: 10, alignItems: 'center' }}>
    <Text style={{ 
  fontSize: 18, 
  fontWeight: 'bold', 
  color: isAnswerCorrect ? '#2e7d32' : '#c94f4f', 
  textAlign: 'center',
  marginTop: 10
}}>
  {isAnswerCorrect ? (
    'Correct! Great job!'
  ) : (
    <>
      Incorrect. The correct answer is:{' '}
      <Text style={{ color: '#1565c0', fontWeight: 'bold', marginTop: 20 }}>
        {safetyCurrentQuestion.answer}
      </Text>
    </>
  )}
</Text>
  </View>
) : (
  safetyCurrentQuestion.choices.map((choice, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleSafetySymbolAnswer(choice)}
      style={{
        backgroundColor: '#e3f2fd',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginVertical: 6,
        borderWidth: 2,
        borderColor: '#90caf9',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#0d47a1', fontSize: 16, fontWeight: '600' }}>{choice}</Text>
    </TouchableOpacity>
  ))
)}

        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#1e88e5' }}>Score: {score}</Text>
          <Text style={{ fontSize: 16, color: '#e53935', marginTop: 5 }}>
            Wrong Attempts: {wrongCount}/3
          </Text>
        </View>
      </View>
    ) : (
      <Text style={{ fontSize: 18, color: '#546e7a' }}>Loading Safety Questions...</Text>
    )}
  </View>
);

const artPuzzleGameLayout = (
  <View style={{ flex: 1, backgroundColor: '#fff8e1', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
    {gameOver ? (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ef6c00' }}>Art Puzzle Complete!</Text>
        <Text style={{ fontSize: 22, color: '#ff9800' }}>Final Score: {score}</Text>
      </View>
    ) : (
      <View style={{
        backgroundColor: '#fff3e0',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 18, color: '#e65100', marginBottom: 12, fontWeight: '600' }}>
          Drag the correct answer for the clue:
        </Text>
        <Text style={{ fontSize: 20, color: '#bf360c', marginBottom: 20, textAlign: 'center' }}>
          {artCurrentQuestion.clue}
        </Text>

        <DropZone
          onDrop={handleDropAnswer}
          expectedAnswer={artCurrentQuestion.answer}
        />

        {/* Shuffling the choices */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          {shuffledChoices.map((choice, index) => (
            <DraggableWord
              key={index}
              word={choice}
              onDrop={handleDropAnswer}
            />
          ))}
        </View>

        {/* Feedback for correct/incorrect answer */}
        {showArtFeedback && (
          <Text style={{
            marginTop: 16,
            fontSize: 16,
            fontWeight: 'bold',
            color: artFeedback.startsWith('Correct') ? '#2e7d32' : '#c62828',
            textAlign: 'center'
          }}>
            {artFeedback}
          </Text>
        )}

        {/* Score and wrong attempts */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#e65100' }}>Score: {score}</Text>
          <Text style={{ fontSize: 16, color: '#d84315' }}>Wrong Attempts: {wrongCount}/3</Text>
        </View>
      </View>
    )}
  </View>
);

const musicNoteMatchLayout = (
  <View style={{
    flex: 1,
    backgroundColor: '#e3f2fd',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    {gameOver ? (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1976d2' }}>Music Note Match Complete!</Text>
        <Text style={{ fontSize: 22, color: '#0288d1' }}>Final Score: {score}</Text>
      </View>
    ) : (
      <View style={{
        backgroundColor: '#bbdefb',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 18, color: '#0d47a1', marginBottom: 12, fontWeight: '600' }}>
          Drag the correct note for the clue:
        </Text>
        <Text style={{ fontSize: 20, color: '#1565c0', marginBottom: 20, textAlign: 'center' }}>
          {currentMusicQuestion.clue}
        </Text>

        {/* FIXED DROP ZONE */}
        <MusicDropZone />

        {/* CHOICES */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          {shuffledMusicChoices.map((choice, index) => (
            <DraggableMusicNote key={index} note={choice} />
          ))}
        </View>

        {/* FEEDBACK */}
        {musicFeedbackVisible && (
          <Text style={{
            marginTop: 16,
            fontSize: 16,
            fontWeight: 'bold',
            color: musicFeedbackMessage.startsWith('Correct') ? '#388e3c' : '#c62828',
            textAlign: 'center'
          }}>
            {musicFeedbackMessage}
          </Text>
        )}

        {/* SCORE & WRONG COUNT */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#0d47a1' }}>Score: {score}</Text>
          <Text style={{ fontSize: 16, color: '#d32f2f' }}>Wrong Attempts: {wrongCount}/3</Text>
        </View>
      </View>
    )}
  </View>
);
  const renderGameLayout = (id) => {
    switch (id) {
      case 1: return snakeAndLaddersLayout;
      case 2: return layoutFractions;
      case 3: return wordScrambleGameLayout;
      case 4: return grammarQuestGameLayout;
      case 5: return scienceTriviaGameLayout;
      case 6: return periodicTableGameLayout;
      case 7: return bugtongQuizLayout;
      case 8: return kahuluganMatchGameLayout;
      case 9: return whoAmIHeroGameLayout;
      case 10: return factOrMythLayout;
      case 11: return virtueMatchLayout;
      case 12: return rolePlayScenariosLayout;
      case 13: return toolIdentificationLayout;
      case 14: return safetySymbolGameLayout;
      case 15: return artPuzzleGameLayout;
      case 16: return musicNoteMatchLayout;
      // Add more cases if needed
      default: return <Text>No game found for ID {id}</Text>;
    }
  };

  if (gameOver) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'red' }}>Game Over!</Text>
        <Text style={{ fontSize: 20, marginTop: 10 }}>Final Score: {score}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#4caf50', padding: 10, marginTop: 20, borderRadius: 5 }}
          onPress={() => {
            setScore(0);
            setWrongCount(0);
            setCurrentQuestionIndex(0);
            setGameOver(false);
          }}
        >
          <Text style={{ color: 'white' }}>Restart Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#2196f3', padding: 10, marginTop: 10, borderRadius: 5 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white' }}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text style={{
      fontSize: 28,
      fontWeight: 'bold',
      color: '#4caf50',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
    }}>
      {gameTitle}
    </Text>
    <TouchableOpacity
      style={{ backgroundColor: '#e57373', padding: 8, borderRadius: 5 }}
      onPress={() => navigation.goBack()}
    >
      <Text style={{ color: 'white' }}>Back</Text>
    </TouchableOpacity>
  </View>

  <Text style={{
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 5,
    color: '#757575'
  }}>
    {gameDescription}
  </Text>

  {/* Add Total Points Display */}
  <Text style={{
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4CAF50', // You can change the color as needed
  }}>
    Total Points: {totalScore}
  </Text>

  <Text style={{
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#ff9800'
  }}>
    Points: {score}
  </Text>

  <Text style={{
    fontSize: 20,
    color: '#f44336',
    fontWeight: 'bold'
  }}>
    Wrong Answers: {wrongCount} / 3
  </Text>

  {renderGameLayout(gameId)}
</SafeAreaView>
  );
};
// Drawer wrapper to provide scrollRefs  
const DrawerWrapper = () => {  
  const scrollRefs = useRef({});  
  return (  
    <Drawer.Navigator  
      screenOptions={{ headerShown: false }}  
      drawerContent={(props) => (  
        <CustomDrawerContent {...props} scrollRefs={scrollRefs} />  
      )}>  
      <Drawer.Screen name="Main">  
        {(props) => <HomeScreen {...props} scrollRefs={scrollRefs} />}  
      </Drawer.Screen>  
      <Drawer.Screen name="Redeem" component={RedeemScreen} />  
        
    </Drawer.Navigator>  
  );  
};  
  
// App container with all screens  
export default function App() {  
  return (
  <ScoreProvider>  
    <NavigationContainer>  
      <Stack.Navigator  
        screenOptions={{ headerShown: false }}  
        initialRouteName="Entry">  
        <Stack.Screen name="Entry" component={EntryScreen} />  
        <Stack.Screen name="Login" component={LoginScreen} />  
        <Stack.Screen name="Signup" component={SignupScreen} />  
        <Stack.Screen name="Donate" component={DonateScreen} />  
        <Stack.Screen name="Events" component={EventsScreen} />  
        <Stack.Screen name="DrawerHome" component={DrawerWrapper} />  
        <Stack.Screen name="ViewAllSubjects" component={ViewAllSubjectsScreen} /> 
        <Stack.Screen name="SupportDetail" component={SupportDetailScreen} /> 
        <Stack.Screen name="FAQ" component={FaqScreen} />
        <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="ModuleOverview" component={ModuleOverviewScreen} />
      </Stack.Navigator>  
    </NavigationContainer>  
    </ScoreProvider>
  );  
}  
  
// StyleSheet for entire app  
const styles = StyleSheet.create({  
introSection: {
  width: width,
  minHeight: height,
  backgroundColor: '#ffffff',
  justifyContent: 'center',
  padding: 20,
},
appSubtitle: {
fontFamily: 'Poppins_400Regular',
fontSize: 20,
textAlign: 'left',
marginBottom: 50,
marginTop: 30,
},

donateSection: {
  backgroundColor: '#d1d1d1',
  width: width,
  minHeight: height,
  paddingVertical: 40,
  paddingHorizontal: 20,
  alignItems: 'flex-start',
},

donateTitleWrapper: {
  backgroundColor: '#fff',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 25,
  marginBottom: 20,
  alignSelf: 'center',
  elevation: 2,
},

donateTitleText: {
  fontFamily: 'SquadaOne_400Regular',
  fontSize: 30,
  textAlign: 'center',
  textShadowColor: '3C3535',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 3,
},

donateImagesContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginVertical: 20,
},

donateImage: {
  width: 100,
  height: 100,
  resizeMode: 'contain',
  margin: 20,
},

donateButton: {
  backgroundColor: '#03a9f4',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 25,
  alignSelf: 'center',
  marginTop: -40,
},

eventsSection: {
  backgroundColor: '#ffffff',
  width: width,
  minHeight: height,
  paddingVertical: 40,
  paddingHorizontal: 20,
  alignItems: 'center',
  
},

eventsCard: {
  backgroundColor: '#f2f5f7',
  padding: 20,
  borderRadius: 5,
  marginVertical: 20,
  width: '90%',
  alignItems: 'center',
  marginTop: 90,
  
},

eventsButton: {
  backgroundColor: '#4caf50',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 25,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},

scrollDownWrapper: {
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingVertical: 5,
  paddingHorizontal: 12,
  marginTop: '95%',
  borderWidth: 1,
  borderColor: '#ccc',
},

scrollDownText: {
  fontSize: 12,
  fontFamily: 'Poppins_400Regular',
  textAlign: 'center',
},
rowLayout: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  width: '100%',
},

textContainer: {
  width: '50%',
  paddingRight: 10,
},

sideImage: {
  width: '50%',
  height: 600,
  resizeMode: 'cover',
  marginTop: -150,
},
  formContainer: {  
    flexGrow: 1,  
    padding: 20,  
    backgroundColor: '#fff',  
  },  
  header: {  
    fontSize: 26,  
    fontWeight: 'bold',  
    color: '#1a237e',  
    textAlign: 'center',  
    marginBottom: 20,  
  },  
  container: {  
    flex: 1, 
    width: '60%',
    height: '50%',
    borderRadius: 10, 
    alignSelf: 'center',
    justifyContent: 'center',  
    padding: 20,  
    backgroundColor: '#B7C6E0',  
  },  
  title: {  
    fontSize: 30,
    fontFamily: 'Poppins_400Regular',  
    fontWeight: 'bold',  
    marginBottom: 30,  
    color: '#000000',  
    textAlign: 'center',  
  },  
  input: {  
    height: 60,  
    borderRadius: 8,  
    paddingHorizontal: 15,  
    marginBottom: 15,  
    backgroundColor: '#F6FDFF',  
  },  
  button: {  
    backgroundColor: '#3f51b5',  
    paddingVertical: 20,  
    borderRadius: 8,  
    marginTop: 10,  
  },  
  buttonText: {  
    color: '#fff',  
    textAlign: 'center',  
    fontWeight: 'bold',  
  },  
  link: {  
    color: '#3f51b5',  
    marginTop: 15,  
    textAlign: 'center',  
    textDecorationLine: 'underline',  
  },  
  paragraph: {  
    fontSize: 16,  
    color: '#333',  
    marginBottom: 10,  
    textAlign: 'center',  
  },  
  navbar: {  
  flexDirection: 'row',  
  alignItems: 'center',  
  justifyContent: 'space-between',  
  backgroundColor: '#3f51b5',  
  paddingHorizontal: 15,  
  paddingBottom: 15,  
  paddingTop: Platform.OS === 'android' ? 40 : 15, // Add top padding for Android  
},  
  navTitle: {  
    color: '#fff',  
    fontWeight: 'bold',  
    fontSize: 20,  
  },  
  navIcon: {  
    color: '#fff',  
    fontSize: 24,  
  },  
  sectionScreen: {  
    height: Dimensions.get('window').height,  
    padding: 20,  
    justifyContent: 'center',  
    backgroundColor: '#eef5ff',  
    borderBottomWidth: 1,  
    borderColor: '#ccc',  
  },  
  sectionHeader: {  
    fontSize: 28,  
    fontWeight: 'bold',  
    color: '#1a237e',  
    marginBottom: 10,  
    textAlign: 'center',  
  },  
  sectionText: {  
    fontSize: 18, 
    fontFamily: 'Poppins_400Regular', 
    color: '#444',  
    textAlign: 'center',
    marginTop: 20,  
    paddingHorizontal: 10,  
  },  
  footer: {  
    marginTop: 30,  
    borderTopWidth: 1,  
    borderColor: '#ccc',  
    paddingTop: 20,  
  },  
  footerText: {  
    textAlign: 'center',  
    color: '#888',  
  },  
  modalContainer: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    paddingHorizontal: 20,  
  },  
  modalContent: {  
    backgroundColor: '#fff',  
    padding: 20,  
    borderRadius: 10,  
    width: '90%',  
    maxWidth: 400,  
    elevation: 5,  
  },  
  codeRow: {  
    flexDirection: 'row',  
    justifyContent: 'space-between',  
    marginVertical: 20,  
  },  
  codeBox: {  
    width: width * 0.1 > 50 ? 50 : width * 0.1,  
    height: width * 0.1 > 60 ? 60 : width * 0.12,  
    borderWidth: 1,  
    borderColor: '#3f51b5',  
    marginHorizontal: 4,  
    textAlign: 'center',  
    fontSize: 20,  
    borderRadius: 8,  
  },  
  carouselButtons: {  
  flexDirection: 'row',  
  justifyContent: 'space-between',  
  marginTop: 10,  
  paddingHorizontal: 20,  
},  
carouselButton: {  
  backgroundColor: '#3949ab',  
  paddingVertical: 10,  
  paddingHorizontal: 20,  
  borderRadius: 8,  
},  
carouselButtonText: {  
  color: '#fff',  
  fontSize: 16,  
  fontWeight: 'bold',  
},  
cardImage: {  
  width: 80,  
  height: 80,  
  marginBottom: 10,  
},  
cardTitle: {  
  fontSize: 16,  
  fontWeight: 'bold',  
},  
card: {  
  width: 160,  
  height: 180,  
  marginHorizontal: 10,  
  borderRadius: 12,  
  backgroundColor: '#f2f2f2',  
  alignItems: 'center',  
  justifyContent: 'center',  
  elevation: 3,  
  shadowColor: '#000',  
  shadowOffset: { width: 0, height: 2 },  
  shadowOpacity: 0.2,  
  shadowRadius: 4,  
},  
searchContainer: {  
    marginTop: 10, // Adjust based on your layout  
    padding: 10,  
    backgroundColor: 'white',  
    flexDirection: 'row', marginBottom: 10  
  },  
  searchInput: {  
    height: 40,  
    borderColor: '#ccc',  
    borderWidth: 1,  
    borderRadius: 8,  
    paddingLeft: 10,  
  },  
  itemContainer: {  
    padding: 15,  
    borderBottomWidth: 1,  
    borderBottomColor: '#ddd',  
  },  
  supportCard: {
  height: height * 0.4,  
  marginHorizontal: 10,  
  borderRadius: 15,  
  backgroundColor: '#e3f2fd',  
  alignItems: 'center',  
  justifyContent: 'center',  
  paddingVertical: 15,  
  overflow: 'visible', 
  marginTop: 130,
  paddingTop: 60,
  elevation: 4,  
  shadowColor: '#000',  
  shadowOffset: { width: 0, height: 2 },  
  shadowOpacity: 0.2,  
  shadowRadius: 4,  
},  
supportCardImage: {  
  width: '70%',  
  height: '70%', 
  position : 'absolute',
  top: -60,
  resizeMode: 'contain',
  borderRadius: 40,  
  marginTop: 30,
  marginBottom: -40,  
  zIndex: 2,
},  
supportTextContainer: {  
  alignItems: 'center',  
  paddingHorizontal: 10,  
  marginBottom: 10,
  marginTop: 40,   
},  
supportCardName: {  
  fontSize: 20, 
  fontFamily: 'Poppins_400Regular', 
  fontWeight: 'bold',  
  color: '#1a237e',  
  marginBottom: 4, 
  marginTop: 30, 
},  
supportCardSubject: {  
  fontSize: 14,  
  fontFamily: 'Poppins_400Regular', 
  color: '#3f51b5',  
},  
supportViewMoreButton: {  
fontFamily: 'Poppins_400Regular', 
  backgroundColor: '#3949ab',  
  paddingVertical: 8,  
  paddingHorizontal: 16,  
  borderRadius: 8,  
  marginTop: 10,  
},  
supportViewMoreText: {  
  color: '#fff',  
  fontSize: 14,  
  fontWeight: 'bold',  
},  
supportSwipeInstruction: {  
  fontSize: 14,  
  color: '#666',  
  marginTop: 10,  
  textAlign: 'center',  
  fontStyle: 'italic',  
},
imageBackground: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  algebraTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  difficultyButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  difficultySelected: {
    backgroundColor: '#FFC107',
  },
  difficultyText: {
    color: 'white',
    fontWeight: 'bold',
  },
  gate: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  gateText: {
    fontSize: 18,
    color: '#00E0FF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  algebraInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  unlockButton: {
    backgroundColor: '#00C853',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  unlockText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedback: {
    fontSize: 16,
    color: '#FFD54F',
    textAlign: 'center',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#536DFE',
    padding: 12,
    borderRadius: 10,
  },
  nextText: {
    color: 'white',
    textAlign: 'center',
  },
  score: {
    marginTop: 30,
    fontSize: 16,
    color: '#B2FF59',
    textAlign: 'center',
    },
    pizzaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 200,
    height: 200,
  },
  pizzaSlice: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  pizzaText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fractionText: {
    fontSize: 18,
    marginTop: 10,
  },
  fractionInput: {
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    width: 150,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    width: 100,
  },

});  