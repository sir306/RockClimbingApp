import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  // Handle Sign up
  const handleSignUp = () =>
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((useCredentials) => {
        const user = useCredentials.user;
        console.log('User register with:', user.email);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });

  return (
    <View>
      <Text>RegisterScreen</Text>
    </View>
  );
};

export default RegisterScreen;
