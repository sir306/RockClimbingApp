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
import * as Progress from 'react-native-progress';

const LoginScreen = () => {
  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // styles
  const buttonStyle = require('../styles/buttonStyles');
  const inputStyle = require('../styles/inputStyles');
  const containerStyle = require('../styles/containerStyles');
  const imageStyle = require('../styles/imageStyles');
  const fontStyle = require('../styles/fontStyles');

  // navigation
  const navigation = useNavigation();

  // cause rerender on navigate
  useEffect(() => {
    const unscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
    });
    return unscribe;
  }, [navigation]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Climb Sites');
      }
    });
  }, []);

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  // handle sign in func
  const handleSignIn = () => {
    setDisabled(true);
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((useCredentials) => {
        const user = useCredentials.user;
        console.log('User signed in with:', user.email);
        setDisabled(false);
        setLoading(false);
        navigation.navigate('Climb Sites');
      })

      .catch((error) => {
        alert(error.message);
        setDisabled(false);
        setLoading(false);
      });
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={require('../assets/loginRegister.jpg')}
        resizeMode='cover'
        style={imageStyle.imageBackground}
      >
        <Text style={fontStyle.title}>Login</Text>
        <View style={containerStyle.innerContainer}>
          {loading ? (
            <>
              <View style={containerStyle.loadingContainer}>
                <Text style={fontStyle.detailTitle}>Logging In..</Text>
                <Progress.CircleSnail
                  size={100}
                  thickness={8}
                  spinDuration={2000}
                  color={['green', 'blue', 'red', 'purple']}
                />
              </View>
            </>
          ) : (
            <>
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
                  disabled={disabled}
                  style={buttonStyle.buttonInput}
                  onPress={() => handleSignIn()}
                >
                  <Text style={buttonStyle.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={disabled}
                  style={buttonStyle.buttonInput}
                  onPress={() => handleSignUp()}
                >
                  <Text style={buttonStyle.buttonText}>
                    Register A New Account
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
