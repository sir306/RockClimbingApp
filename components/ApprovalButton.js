import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const ApprovalButton = () => {
  // Styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');

  return (
    <View>
      <Text>ApprovalButton</Text>
      <TouchableOpacity style={buttonStyle.buttonInput} onPress={() => {}}>
        <Text style={buttonStyle.buttonText}>Register A New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ApprovalButton;
