import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';
import ClimbsList from '../components/ClimbsList';

const ClimbsScreen = ({ route }) => {
  const { id, name } = route.params;
  // background image
  const backgroundImage = require('../assets/background.jpg');

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />
        <Text>Climbs for id {id}</Text>
        <ClimbsList id={id} name={name} />
      </ImageBackground>
    </View>
  );
};

export default ClimbsScreen;
