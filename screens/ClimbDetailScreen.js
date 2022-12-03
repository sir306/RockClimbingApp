import { View, Text, ImageBackground, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu';
import { CheckBox } from '@rneui/themed';
import { auth, db, userAdmin } from '../backend/firebase';
import ApprovalButton from '../components/ApprovalButton';
import * as Progress from 'react-native-progress';
import RejectButton from '../components/RejectButton';

const ClimbDetailScreen = ({ route }) => {
  //states
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [image, setImage] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [currentClimbedClimbers, setCurrentClimbedClimbers] = useState([]);
  const [climbData, setClimbData] = useState(null);

  // get data
  const data = route.params;

  // get climb id
  const id = data.climb.id;

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const fontStyle = require('../styles/fontStyles');

  // background image
  const backgroundImage = require('../assets/background.jpg');
  // no image upload
  const noImage = require('../assets/noImage.jpg');

  // useEffects
  // get climb data
  useEffect(() => {
    const climbDoc = db.collection('climbs').doc(id);
    climbDoc.get().then((data) => {
      setClimbData(data.data());
    });
    return () => {};
  }, []);

  //see if the user has climbed climb
  useEffect(() => {
    if (climbData) {
      setCurrentClimbedClimbers(climbData.climbedClimbers);
      climbData.climbedClimbers.forEach((climber) => {
        if (climber == auth.currentUser.uid) {
          setToggleCheckBox(true);
        }
      });
    }
  }, [climbData]);

  // get image from stored imgUrl
  useEffect(() => {
    if (climbData) {
      setImage(climbData.imgUrl);
    }
  }, [climbData]);

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

    var climbDocRef = db.collection('climbs').doc(id);
    await climbDocRef.update({
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
            {climbData == null ? (
              <View style={containerStyle.loadingContainer}>
                <Text style={fontStyle.detailTitle}>Loading..</Text>
                <Progress.CircleSnail
                  size={100}
                  thickness={8}
                  spinDuration={2000}
                  color={['green', 'blue', 'red', 'purple']}
                />
              </View>
            ) : (
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
                  <ImageBackground
                    source={noImage}
                    style={imageStyle.imageClimb}
                  >
                    <Text style={fontStyle.noImageText}>No image found</Text>
                  </ImageBackground>
                )}

                <Text style={fontStyle.detailTitle}>Climb Grade</Text>
                <Text style={fontStyle.details}>{climbData.grade}</Text>
                <Text style={fontStyle.detailTitle}>Climb Type</Text>
                <Text style={fontStyle.details}>
                  {climbData.trad && climbData.bolts > 0
                    ? 'Mixed Climb'
                    : climbData.trad
                    ? 'Traditional Climb'
                    : 'Sports Climb'}
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
                {!climbData.approved && userAdmin(auth.currentUser.uid) ? (
                  <>
                    <ApprovalButton
                      climbSite={false}
                      climbSiteId={climbData.climbSiteId}
                      data={{
                        climbId: id,
                        grade: climbData.grade,
                        bolts: climbData.bolts,
                        trad: climbData.trad,
                      }}
                    />
                    <RejectButton
                      climbSite={false}
                      climbSiteId={climbData.climbSiteId}
                      data={{
                        climbId: id,
                        climbSiteName: climbData.climbSiteName,
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};
export default ClimbDetailScreen;
