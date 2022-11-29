import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, newUser } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  // states
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  // styles
  const buttonStyle = require('../styles/buttonStyles');
  const inputStyle = require('../styles/inputStyles');
  const containerStyle = require('../styles/containerStyles');
  const imageStyle = require('../styles/imageStyles');
  const fontStyle = require('../styles/fontStyles');

  // navigation
  const navigation = useNavigation();

  // Handle Sign up
  const handleSignUp = () => {
    if (password1 != password2) {
      return Alert.alert(
        'Passwords Do Not Match',
        'The passwords you have entered do not match please try again'
      );
    } else {
      auth
        .createUserWithEmailAndPassword(email, password1)
        .then((useCredentials) => {
          const user = useCredentials.user;
          console.log('User register with:', user.email);
          newUser(user.uid);
          navigation.navigate('Login');
        })
        .catch((error) => {
          alert(error.message);
          console.log(error);
        });
    }
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={require('../assets/loginRegister.jpg')}
        resizeMode='cover'
        style={imageStyle.imageBackground}
      >
        <Text style={fontStyle.title}>Register a new account</Text>
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
              value={password1}
              onChangeText={(text) => setPassword1(text.trimEnd())}
            />
            <TextInput
              style={inputStyle.textInput}
              placeholder='Confirm Your Password..'
              placeholderTextColor={'white'}
              secureTextEntry
              value={password2}
              onChangeText={(text) => setPassword2(text.trimEnd())}
            />
          </View>
          <View style={containerStyle.buttonContainer}>
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => handleSignUp()}
            >
              <Text style={buttonStyle.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default RegisterScreen;
