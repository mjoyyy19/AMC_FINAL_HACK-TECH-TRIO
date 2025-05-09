import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View, Text, TextInput, Button, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';

const Stack = createNativeStackNavigator();

// Entry Screen
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
        Provide access to education for underprivileged children by donating books. Your contribution will help bridge the knowledge gap and inspire a love for learning.
      </Text>
      <Text style={styles.sectionSubtext}>How Your Donation Helps</Text>
      <Text style={styles.sectionText}>
        - Access to Education: Books will be distributed to children who lack access to educational resources.{"\n"}
        - Fostering a Love for Reading: Your donation will help children develop essential reading skills and a lifelong passion for learning.
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

// Login Screen
const LoginScreen = ({ navigation }) => (
  <View style={styles.formContainer}>
    <Text style={styles.header}>LOG-IN</Text>
    <TextInput placeholder="Name" style={styles.input} placeholderTextColor="#666" />
    <TextInput placeholder="Pass" secureTextEntry style={styles.input} placeholderTextColor="#666" />
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Log-In</Text>
    </TouchableOpacity>
    <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
      Don't have account? Sign-Up
    </Text>
  </View>
);

// Signup Screen with Verification
const SignupScreen = ({ navigation }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };

  const verifyCode = () => {
    const enteredCode = code.join('');
    if (enteredCode.length === 6) {
      Alert.alert('Success', 'Verified! You can now log in.', [
        { text: 'OK', onPress: () => {
          setShowVerification(false);
          navigation.navigate('Login');
        }}
      ]);
    } else {
      Alert.alert('Error', 'Please enter a 6-digit code.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.header}>SIGN-UP</Text>
      <TextInput placeholder="Name" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Age" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Gender" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Contact No." style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Year" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#666" />
      <TextInput placeholder="Pass" secureTextEntry style={styles.input} placeholderTextColor="#666" />
      <TouchableOpacity style={styles.button} onPress={() => setShowVerification(true)}>
        <Text style={styles.buttonText}>Sign-Up</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log-In
      </Text>

      {showVerification && (
        <View style={styles.verificationPopup}>
          <Text style={styles.header}>Enter 6-digit Code</Text>
          <View style={styles.codeRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={(text) => handleCodeChange(text, index)}
                value={digit}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={verifyCode}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// Donate Screen
const DonateScreen = ({ navigation }) => (
  <ScrollView contentContainerStyle={styles.formContainer}>
    <TouchableOpacity onPress={() => navigation.navigate('Entry')}>
      <Text style={styles.link}>BACK</Text>
    </TouchableOpacity>
    <Text style={styles.header}>DONATE BOOKS FOR KIDS</Text>
    <Text style={styles.sectionText}>
      Thank you for your interest in our Donation Books Program!{"\n\n"}
      We accept donations of gently used books for all ages—children's books, textbooks, novels, and educational materials.{"\n\n"}
      Your donations will go to:{"\n"}
      - Underprivileged people{"\n"}
      - Community learning centers{"\n"}
      - Literacy advocacy groups{"\n\n"}
      How to Donate:{"\n"}
      1. Check that your books are in good condition.{"\n"}
      2. Pack them securely.{"\n"}
      3. Drop them off or schedule a pickup.{"\n\n"}
      Drop-off Location:{"\n"}
      EduQualiTech Donation Center{"\n"}
      #23 Mabini Street, Brgy. Malinis, San Pedro, Laguna{"\n"}
      Mon–Fri, 9:00 AM – 5:00 PM{"\n\n"}
      Contact: (0912) 345-6789 or eduqualitech.donate@gmail.com
    </Text>
  </ScrollView>
);

// Events Screen
const EventsScreen = ({ navigation }) => (
  <ScrollView contentContainerStyle={styles.formContainer}>
    <TouchableOpacity onPress={() => navigation.navigate('Entry')}>
      <Text style={styles.link}>BACK</Text>
    </TouchableOpacity>
    <Text style={styles.header}>EVENTS & OUTREACH</Text>
    <Text style={styles.sectionText}>
      Volunteer With Us{"\n\n"}
      Be part of our mission! Help us deliver books and provide basic tutoring in reading, writing, and math.{"\n\n"}
      Event Schedule:{"\n"}
      - April 20 – Brgy. San Isidro, Rizal{"\n"}
      - April 27 – Brgy. Malaya, Quezon{"\n"}
      - May 4 – Brgy. Bagong Pag-asa, Laguna{"\n\n"}
      Drop-off Location:{"\n"}
      ELI IT Solutions HQ{"\n"}
      #23 Mabini Street, Brgy. Malinis, San Pedro, Laguna{"\n"}
      Mon–Fri | 9:00 AM – 5:00 PM
    </Text>
  </ScrollView>
);

// App Component with Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Entry">
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Donate" component={DonateScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 5,
  },
  sectionSubtext: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    color: '#3f51b5',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  verificationPopup: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#eef',
    borderRadius: 10,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 40,
    height: 45,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
  },
});