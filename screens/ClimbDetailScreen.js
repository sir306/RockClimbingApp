import { View, Text, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu';
import { CheckBox } from '@rneui/themed';
import { auth, db } from '../backend/firebase';

const ClimbDetailScreen = ({ route }) => {
  //states
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  // get data
  const data = route.params;
  // get climb data
  const climbData = data.climb.data;
  // get climb id
  const id = data.climb.id;

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');
  const generalStyle = require('../styles/generalStyles');

  // background image
  const backgroundImage = require('../assets/background.jpg');
  // no image upload
  const noImage = require('../assets/noImage.jpg');

  // useEffect to see if the user has climbed climb
  useEffect(() => {
    climbData.climbedClimbers.forEach((climber) => {
      if (climber == auth.currentUser.uid) {
        setToggleCheckBox(true);
      }
    });
  }, []);

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />
        <Text style={fontStyle.detailTitle}>Climb Site Name</Text>
        <Text style={fontStyle.details}>{climbData.climbSiteName}</Text>
        <Text style={fontStyle.detailTitle}>Climb Name</Text>
        <Text style={fontStyle.details}>{climbData.climbName}</Text>
        <ImageBackground
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/rockclimbingproject-bf50a.appspot.com/o/Screenshot_20221124-030422_Facebook.jpg?alt=media&token=c9b39f0e-71be-4f39-b664-670533edeb70',
          }}
          style={imageStyle.imageClimb}
        ></ImageBackground>
        <ImageBackground source={noImage} style={imageStyle.imageClimb}>
          <Text style={fontStyle.noImageText}>No image found</Text>
        </ImageBackground>
        <Text style={fontStyle.detailTitle}>Climb Grade</Text>
        <Text style={fontStyle.details}>{climbData.grade}</Text>
        <Text style={fontStyle.detailTitle}>Climb Type</Text>
        <Text style={fontStyle.details}>
          {climbData.trad ? 'Traditional Climb' : 'Sports Climb'}
        </Text>
        <Text style={fontStyle.detailTitle}>Number of bolts</Text>
        <Text style={fontStyle.details}>{climbData.bolts}</Text>
        <Text style={fontStyle.detailTitle}>Climbed</Text>
        <CheckBox
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0, .3)',
            marginLeft: '5%',
            marginRight: '5%',
            marginVertical: '0%',
            paddingTop: 8,
            paddingBottom: 8,
          }}
          textStyle={fontStyle.checkBox}
          center
          title={!toggleCheckBox ? 'Not Yet' : 'Conquered'}
          checked={toggleCheckBox}
          onPress={() => setToggleCheckBox(!toggleCheckBox)}
        />
      </ImageBackground>
    </View>
  );
};

export default ClimbDetailScreen;
