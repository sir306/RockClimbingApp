import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // styles
  const buttonStyle = require('../styles/buttonStyles');
  const inputStyle = require('../styles/inputStyles');
  const containerStyle = require('../styles/containerStyles');
  const imageStyle = require('../styles/imageStyles');
  const fontStyle = require('../styles/fontStyles');

  // navigation
  const navigation = useNavigation();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('ClimbSites');
      }
    });
  }, []);

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  // handle sign in func
  const handleSignIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((useCredentials) => {
        const user = useCredentials.user;
        console.log('User signed in with:', user.email);
        navigation.navigate('ClimbSites');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={require('../assets/loginRegister.jpg')}
        resizeMode='cover'
        style={imageStyle.imageBackground}
      >
        <Text style={fontStyle.title}>Login or register a new account</Text>
        <View style={containerStyle.innerContainer}>
          <View style={inputStyle.inputContainer}>
            <TextInput
              style={inputStyle.textInput}
              placeholder='Enter Your Email..'
              placeholderTextColor={'white'}
              value={email}
              onChangeText={(text) => setEmail(text.trimEnd())}
            />
            <TextInput
              style={inputStyle.textInput}
              placeholder='Enter Your Password..'
              placeholderTextColor={'white'}
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text.trimEnd())}
            />
          </View>
          <View style={containerStyle.buttonContainer}>
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => handleSignIn()}
            >
              <Text style={buttonStyle.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => handleSignUp()}
            >
              <Text style={buttonStyle.buttonText}>Register New Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
