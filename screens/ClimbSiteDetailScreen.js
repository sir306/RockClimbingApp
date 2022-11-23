import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';
import React, { useEffect, useState } from 'react';

const ClimbSiteDetailScreen = ({ route }) => {
  // states
  const [climbTypes, setClimbTypes] = useState('');
  const [gradeRange, setGradeRange] = useState('');

  // navigation
  const navigation = useNavigation();

  // get data
  const data = route.params;
  // get site data
  const siteData = data.site.data;
  // get site id
  const id = data.site.id;

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');

  // background image
  const backgroundImage = require('../assets/background.jpg');

  // use effects
  // get site climb types and grade range
  useEffect(() => {
    let climbTypeString = '';
    let i = 1;
    let siteTypeLen = siteData.climbTypes.length;
    siteData.climbTypes.forEach((climbType) => {
      if (i != siteTypeLen) {
        climbTypeString += climbType + ', ';
        i++;
      } else {
        climbTypeString += climbType;
      }
    });
    let climbRange = getGradeRange();
    setGradeRange(climbRange);
    setClimbTypes(climbTypeString);
  }, []);

  // functions
  // get the grade range
  const getGradeRange = () => {
    let climbGradeRange = '';
    switch (siteData.gradeRange.length) {
      case 0:
        break;
      case 1:
        climbGradeRange = siteData.gradeRange[0];
        break;
      case 2:
        climbGradeRange =
          siteData.gradeRange[0] + ' - ' + siteData.gradeRange[1];
        break;
      default:
        break;
    }
    return climbGradeRange;
  };

  // handle climbs click and navigate to the climb list screen
  const handleClimbsClick = (id) => {
    navigation.navigate('ClimbsScreen', { id });
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />

        <Text style={fontStyle.detailTitle}>Climb Site Name</Text>
        <Text style={fontStyle.details}>{siteData.siteName}</Text>
        <Text style={fontStyle.detailTitle}>Grade Range</Text>
        <Text style={fontStyle.details}>{gradeRange}</Text>
        <Text style={fontStyle.detailTitle}>Climb Types</Text>
        <Text style={fontStyle.details}>{climbTypes}</Text>
        <Text style={fontStyle.detailTitle}>Location</Text>
        <Text selectable={true} style={fontStyle.details}>
          {siteData.location.latitude}, {siteData.location.longitude}
        </Text>
        <View style={containerStyle.innerContainer}>
          <View style={containerStyle.buttonContainer}>
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => handleClimbsClick(id)}
            >
              <Text style={buttonStyle.buttonText}>Climbs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ClimbSiteDetailScreen;
