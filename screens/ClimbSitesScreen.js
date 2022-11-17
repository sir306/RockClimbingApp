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
import ClimbSiteList from '../components/ClimbSiteList';

const ClimbSitesScreen = () => {
  // states

  // navigation
  const navigation = useNavigation();

  // background image
  const backgroundImage = require('../assets/homeBackground.jpg');

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />
        <Text style={fontStyle.title}>Climb Sites</Text>
        <ClimbSiteList />
      </ImageBackground>
    </View>
  );
};

export default ClimbSitesScreen;
