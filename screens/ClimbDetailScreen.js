import { View, Text, ImageBackground, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu';
import { CheckBox } from '@rneui/themed';
import { auth, db, firebase } from '../backend/firebase';

const ClimbDetailScreen = ({ route }) => {
  //states
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [image, setImage] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [currentClimbedClimbers, setCurrentClimbedClimbers] = useState([]);

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
    setCurrentClimbedClimbers(climbData.climbedClimbers);
    climbData.climbedClimbers.forEach((climber) => {
      if (climber == auth.currentUser.uid) {
        setToggleCheckBox(true);
      }
    });
  }, []);

  // get image from firebase storage
  useEffect(() => {
    const imageRef = firebase
      .storage()
      .ref('/climbPhotos/' + '0a3c629a-207a-4662-aed9-857d4948ea0f.jpeg');
    imageRef
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
  }, []);

  // change the climbed status data on firebase
  const updateClimbed = async (climbed) => {
    setToggleCheckBox(climbed);
    setDisabled(true);
    let newClimbedClimbers = currentClimbedClimbers;
    if (climbed) {
      newClimbedClimbers.push(auth.currentUser.uid);
    } else {
      newClimbedClimbers = currentClimbedClimbers.filter(
        (climber) => climber !== auth.currentUser.uid
      );
    }
    setCurrentClimbedClimbers(newClimbedClimbers);

    console.log(id);
    var climbDocRef = db.collection('climbs').doc(id);
    climbDocRef.update({
      climbedClimbers: newClimbedClimbers,
    });
    setDisabled(false);
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />
        <ScrollView style={containerStyle.scrollStyle}>
          <View style={containerStyle.innerContainer}>
            <View style={containerStyle.scrollInnerContainer}>
              <Text style={fontStyle.detailTitle}>Climb Site Name</Text>
              <Text style={fontStyle.details}>{climbData.climbSiteName}</Text>
              <Text style={fontStyle.detailTitle}>Climb Name</Text>
              <Text style={fontStyle.details}>{climbData.climbName}</Text>
              <Text style={fontStyle.detailTitle}>Climb Image</Text>
              {image ? (
                <ImageBackground
                  source={{
                    uri: image,
                  }}
                  style={imageStyle.imageClimb}
                ></ImageBackground>
              ) : (
                <ImageBackground source={noImage} style={imageStyle.imageClimb}>
                  <Text style={fontStyle.noImageText}>No image found</Text>
                </ImageBackground>
              )}

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
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  marginLeft: '5%',
                  marginRight: '5%',
                  marginVertical: '0%',
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
                textStyle={fontStyle.checkBox}
                center
                disabled={disabled}
                title={!toggleCheckBox ? 'Not Yet' : 'Conquered'}
                checked={toggleCheckBox}
                onPress={() => updateClimbed(!toggleCheckBox)}
              />
              <Text style={fontStyle.detailTitle}>Comments</Text>
              <Text style={fontStyle.details}>
                {climbData.comments
                  ? climbData.comments
                  : 'No comments where uploaded with this climb'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ClimbDetailScreen;
