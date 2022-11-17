import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { auth } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
  // navigation
  const navigation = useNavigation();

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');

  // home function
  const handleHome = () => {
    navigation.navigate('Home');
  };

  // logout function
  const handleLogout = () => {
    auth
      .signOut()
      .then(function () {
        // Sign-out successful.
        navigation.navigate('Login');
      })
      .catch(function (error) {
        alert(error.message);
      });
  };
  return (
    <View style={containerStyle.menuContainer}>
      <TouchableOpacity
        style={buttonStyle.logoutInput}
        onPress={() => handleLogout()}
      >
        <Text style={buttonStyle.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={buttonStyle.menuInput}
        onPress={() => handleHome()}
      >
        <Text style={buttonStyle.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;
