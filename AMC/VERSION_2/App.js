import React, { useState,useRef, useEffect } from 'react';  
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
  useWindowDimensions 
} from 'react-native';  
import { NavigationContainer } from '@react-navigation/native';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';  
import {  
  createDrawerNavigator,  
  DrawerContentScrollView,  
  DrawerItem,  
} from '@react-navigation/drawer';  

import scienceImage from './assets/images/subjects/science.png';
const Stack = createNativeStackNavigator();  
const Drawer = createDrawerNavigator();  
const { width } = Dimensions.get('window');  
  
const EntryScreen = ({ navigation }) => (  
  <ScrollView contentContainerStyle={styles.entryScrollContainer}>  
    <Text style={styles.appTitle}>EduQualiTech</Text>  
    <Text style={styles.appSubtitle}>Free and accessible educational materials</Text>  
  
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>  
      <Text style={styles.buttonText}>Get Started</Text>  
    </TouchableOpacity>  
  
    <View style={styles.section}>  
      <Text style={styles.sectionTitle}>DONATE BOOKS FOR KIDS</Text>  
      <Text style={styles.sectionText}>  
        Provide access to education for underprivileged children by donating books.  
      </Text>  
      <Text style={styles.sectionSubtext}>How Your Donation Helps</Text>  
      <Text style={styles.sectionText}>  
        - Access to Education{"\n"}- Fostering a Love for Reading  
      </Text>  
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Donate')}>  
        <Text style={styles.buttonText}>DONATE</Text>  
      </TouchableOpacity>  
    </View>  
  
    <View style={styles.section}>  
      <Text style={styles.sectionTitle}>EVENTS & OUTREACH</Text>  
      <Text style={styles.sectionText}>  
        Join us in bringing education and donated books to underserved communities.  
      </Text>  
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Events')}>  
        <Text style={styles.buttonText}>LEARN MORE</Text>  
      </TouchableOpacity>  
    </View>  
  </ScrollView>  
);  
  
const LoginScreen = ({ navigation }) => {  
  return (  
    <View style={styles.container}>  
      <Text style={styles.title}>Log In</Text>  
      <TextInput placeholder="Email" style={styles.input} />  
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />  
      <TouchableOpacity  
        style={styles.button}  
        onPress={() => navigation.navigate('DrawerHome')}>  
        <Text style={styles.buttonText}>Log-In</Text>  
      </TouchableOpacity>  
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>  
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>  
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
  
      <TouchableOpacity style={styles.button} onPress={handleSignup}>  
        <Text style={styles.buttonText}>SIGN UP</Text>  
      </TouchableOpacity>  
  
      <VerificationModal  
        visible={showModal}  
        onClose={() => setShowModal(false)}  
        onSubmit={verifyCode}  
        code={code}  
        setCode={setCode}  
        inputs={inputs}  
      />  
    </View>  
  );  
};  
const DonateScreen = ({ navigation }) => (  
  <ScrollView contentContainerStyle={styles.formContainer}>  
    <TouchableOpacity onPress={() => navigation.navigate('Entry')}>  
      <Text style={styles.link}>BACK</Text>  
    </TouchableOpacity>  
    <Text style={styles.header}>DONATE BOOKS FOR KIDS</Text>  
    <Text style={styles.sectionText}>  
      We accept donations of gently used books...{"\n\n"}Drop-off Location:{"\n"}  
      EduQualiTech Donation Center, #23 Mabini St, San Pedro, Laguna{"\n"}Mon–Fri, 9AM–5PM  
    </Text>  
  </ScrollView>  
);  
  
const EventsScreen = ({ navigation }) => (  
  <ScrollView contentContainerStyle={styles.formContainer}>  
    <TouchableOpacity onPress={() => navigation.navigate('Entry')}>  
      <Text style={styles.link}>BACK</Text>  
    </TouchableOpacity>  
    <Text style={styles.header}>EVENTS & OUTREACH</Text>  
    <Text style={styles.sectionText}>  
      Be part of our mission!{"\n\n"}Event Schedule:{"\n"}  
      - April 20 – Brgy. San Isidro{"\n"}- April 27 – Brgy. Malaya{"\n"}- May 4 – Bagong Pag-asa  
    </Text>  
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
  
// Main Home screen with scrollable sections  
const HomeScreen = ({ navigation, scrollRefs }) => {  
const subjects = [  
  { title: 'Math', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/c8ac682ef6f5f4cb6ae81b8309c49941' },  
  { title: 'Science', image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/99c206c6da676bd508fd47b3f54f1865' },  
  { title: 'English', image: 'https://img.icons8.com/color/100/book.png' },  
  { title: 'History', image: 'https://img.icons8.com/color/100/scroll.png' },  
  { title: 'ICT', image: 'https://img.icons8.com/color/100/computer.png' },  
];

const supportTeam = [
  { name: 'Mary Joy T.', subject: 'English', image: 'https://link-to-image-1' },
  { name: 'Dumbledore', subject: 'Science', image: 'https://link-to-image-2' },
  { name: 'Jennifer', subject: 'Math', image: 'https://link-to-image-3' },
  { name: 'Jennifer', subject: 'Math', image: 'https://link-to-image-3' },
  { name: 'Jennifer', subject: 'Math', image: 'https://link-to-image-3' },
];  

const [currentIndex, setCurrentIndex] = useState(0);  
const carouselRef = useRef();  
const [searchText, setSearchText] = useState('');  
const [viewAll, setViewAll] = useState(false);  
  
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const { width } = useWindowDimensions();
const isDesktop = width >= 768;
const CARDS_PER_VIEW = isDesktop ? 3 : 1;
const SPACING = 16;
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
            <Text style={styles.sectionHeader}>{title}</Text>  
            {title === 'Home' && (  
              <Text style={styles.sectionText}>  
                MAKE LEARNING A BREEZE!{'\n\n'}EXPLORE OUR LIST OF LEARNING  
                MATERIALS JUST FOR YOU.  
              </Text>  
            )}  
            {title === 'Materials' && (  
  <View>  
    <Text style={styles.sectionText}>Browse our subjects:</Text>  
    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginTop: 10 }}>  
  <TextInput  
    placeholder="Search subject"  
    value={searchText}  
    onChangeText={setSearchText}  
    style={{  
      flex: 1,  
      borderWidth: 1,  
      borderColor: '#ccc',  
      borderRadius: 8,  
      padding: 8,  
      marginRight: 10,  
    }}  
  />  
  <TouchableOpacity onPress={() => navigation.navigate('ViewAllSubjects', { subjects })}>  
  <Text style={{ color: '#007bff', fontWeight: 'bold' }}>View All</Text>  
</TouchableOpacity>  
</View>  
    <ScrollView  
  ref={carouselRef}  
  horizontal  
  showsHorizontalScrollIndicator={false}  
  contentContainerStyle={{  
    paddingHorizontal: 10,  
    alignItems: 'center',  
  }}  
>  
  {subjects.map((subject, idx) => (  
    <TouchableOpacity  
      key={idx}  
      style={styles.card}  
      onPress={() => console.log('Pressed:', subject.title)}  
      activeOpacity={0.7}  
    >  
      <Image  
        source={{ uri: subject.image }}  
        style={styles.cardImage}  
        resizeMode="contain"  
      />  
      <Text style={styles.cardTitle}>{subject.title}</Text>  
    </TouchableOpacity>  
  ))}  
</ScrollView>  
  
    <View style={styles.carouselButtons}>  
      <TouchableOpacity  
        style={styles.carouselButton}  
        onPress={() => scrollToIndex(Math.max(currentIndex - 1, 0))}  
      >  
        <Text style={styles.carouselButtonText}>Previous</Text>  
      </TouchableOpacity>  
  
      <TouchableOpacity  
        style={styles.carouselButton}  
        onPress={() => scrollToIndex(Math.min(currentIndex + 1, subjects.length - 1))}  
      >  
        <Text style={styles.carouselButtonText}>Next</Text>  
      </TouchableOpacity>  
    </View>  
  </View>  
)}  
{title === 'Support' && (
  <View>
    <Text style={styles.sectionText}>Meet our Support Team:</Text>
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
              <Image
                source={{ uri: person.image }}
                style={styles.supportCardImage}
                resizeMode="contain"
              />
              <View style={styles.supportTextContainer}>
              <Text style={styles.supportCardName}>{person.name}</Text>
              <Text style={styles.supportCardSubject}>{person.subject}</Text>
              </View>
              <TouchableOpacity style={styles.supportViewMoreButton}>
                <Text style={styles.supportViewMoreText}>View More</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </Animated.ScrollView>
  </View>
)}
            {title === 'Help & FAQ' && (  
              <View style={styles.footer}>  
                <Text style={styles.footerText}>  
                  © 2025 EduQualiTech. All rights reserved.  
                </Text>  
              </View>  
            )}  
          </View>  
        ))}  
      </ScrollView>  
    </SafeAreaView>  
  );  
};  
const ViewAllSubjectsScreen = ({ navigation, route }) => {  
  const { subjects } = route.params;  
  
  const [searchText, setSearchText] = useState('');  
  
  const filteredSubjects = subjects.filter(subject =>  
    subject.title.toLowerCase().includes(searchText.toLowerCase())  
  );  
  
  return (  
    <SafeAreaView style={{ flex: 1, padding: 10 }}>  
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>  
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
        
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>  
        {filteredSubjects.map((subject, index) => (  
          <TouchableOpacity  
            key={index}  
            style={{  
              width: '46%',  
              margin: '2%',  
              backgroundColor: '#f0f0f0',  
              borderRadius: 10,  
              padding: 10,  
              alignItems: 'center',  
              elevation: 2,  
            }}  
            onPress={() => console.log('Pressed:', subject.title)}  
          >  
            <Image  
              source={{ uri: subject.image }}  
              style={{ width: 120, height: 100, borderRadius: 8 }}  
            />  
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>{subject.title}</Text>  
          </TouchableOpacity>  
        ))}  
      </ScrollView>  
    </SafeAreaView>  
  );  
};  
const RedeemScreen = ({ navigation }) => (  
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
    <ScrollView contentContainerStyle={styles.formContainer}>  
      <Text style={styles.header}>REDEEM REWARDS</Text>  
      <Text style={styles.sectionText}>  
        You can redeem your points here for exciting rewards!{"\n\n"}- Free books{"\n"}- Discount coupons{"\n"}- School supplies  
      </Text>  
    </ScrollView>  
  </SafeAreaView>  
);  
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
      </Stack.Navigator>  
    </NavigationContainer>  
  );  
}  
  
// StyleSheet for entire app  
const styles = StyleSheet.create({  
entryScrollContainer: {  
    padding: 20,  
    backgroundColor: '#eef5ff',  
  },  
  appTitle: {  
    fontSize: 36,  
    fontWeight: 'bold',  
    color: '#1a237e',  
    textAlign: 'center',  
    marginVertical: 10,  
  },  
  appSubtitle: {  
    fontSize: 16,  
    color: '#3f51b5',  
    textAlign: 'center',  
    marginBottom: 20,  
  },  
  section: {  
    marginVertical: 20,  
    padding: 10,  
  },  
  sectionTitle: {  
    fontSize: 22,  
    fontWeight: 'bold',  
    color: '#1a237e',  
    marginBottom: 10,  
  },  
  sectionText: {  
    fontSize: 16,  
    color: '#444',  
  },  
  sectionSubtext: {  
    fontWeight: 'bold',  
    marginTop: 10,  
    marginBottom: 5,  
    color: '#333',  
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
    justifyContent: 'center',  
    padding: 20,  
    backgroundColor: '#f4f6fc',  
  },  
  title: {  
    fontSize: 28,  
    fontWeight: 'bold',  
    marginBottom: 20,  
    color: '#1a237e',  
    textAlign: 'center',  
  },  
  input: {  
    height: 50,  
    borderColor: '#3f51b5',  
    borderWidth: 1,  
    borderRadius: 8,  
    paddingHorizontal: 15,  
    marginBottom: 15,  
    backgroundColor: '#fff',  
  },  
  button: {  
    backgroundColor: '#3f51b5',  
    paddingVertical: 15,  
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
    color: '#444',  
    textAlign: 'center',  
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
  height: 250,  
  marginHorizontal: 10,  
  borderRadius: 15,  
  backgroundColor: '#e3f2fd',  
  alignItems: 'center',  
  justifyContent: 'flex-start',  
  paddingVertical: 15,  
  elevation: 4,  
  shadowColor: '#000',  
  shadowOffset: { width: 0, height: 2 },  
  shadowOpacity: 0.2,  
  shadowRadius: 4,  
},  
supportCardImage: {  
  width: 80,  
  height: 80,  
  borderRadius: 40,  
  marginBottom: 10,  
},  
supportTextContainer: {  
  alignItems: 'center',  
  paddingHorizontal: 10,  
  marginBottom: 10,  
},  
supportCardName: {  
  fontSize: 16,  
  fontWeight: 'bold',  
  color: '#1a237e',  
  marginBottom: 4,  
},  
supportCardSubject: {  
  fontSize: 14,  
  color: '#3f51b5',  
},  
supportViewMoreButton: {  
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
});  