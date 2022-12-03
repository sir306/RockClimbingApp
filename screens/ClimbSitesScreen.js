import { Text, View, ImageBackground } from 'react-native';
import React from 'react';
import Menu from '../components/Menu';
import ClimbSiteList from '../components/ClimbSiteList';

const ClimbSitesScreen = () => {
  // background image
  const backgroundImage = require('../assets/background.jpg');

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
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
