import { Text, View, ImageBackground } from 'react-native';
import React from 'react';
import Menu from '../components/Menu';
import ClimbsList from '../components/ClimbsList';

const ClimbsScreen = ({ route }) => {
  const { id, name } = route.params;
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
        <Text style={fontStyle.title}>Climbs for {name}</Text>
        <ClimbsList id={id} name={name} />
      </ImageBackground>
    </View>
  );
};

export default ClimbsScreen;
