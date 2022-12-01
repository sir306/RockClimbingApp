import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';
import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ApprovalButton from '../components/ApprovalButton';
import { db, auth, firebase, userAdmin } from '../backend/firebase';

const ClimbSiteDetailScreen = ({ route }) => {
  // states
  const [climbTypes, setClimbTypes] = useState('');
  const [gradeRange, setGradeRange] = useState('');
  const [siteData, setSiteData] = useState(null);

  // navigation
  const navigation = useNavigation();

  // get site id
  const id = route.params.id;

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');
  const mapStyle = require('../styles/mapStyles');

  // background image
  const backgroundImage = require('../assets/background.jpg');

  // use effects
  // navigation from redirect cause rerender on navigat
  useEffect(() => {
    const unscribe = navigation.addListener('focus', () => {
      setSiteData(null);
    });
    return unscribe;
  }, [navigation]);

  // get climbsite data
  useEffect(() => {
    const climbSiteDoc = db.collection('climbSites').doc(id);
    climbSiteDoc.get().then((data) => {
      setSiteData(data.data());
    });

    return () => {};
  }, [siteData]);

  // get site climb types and grade range
  useEffect(() => {
    if (siteData != null) {
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
    }
  }, [siteData]);

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
  const handleClimbsClick = (id, name) => {
    navigation.navigate('Climbs', { id: id, name: name });
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />
        {siteData != null ? (
          <ScrollView style={containerStyle.scrollStyle}>
            <View style={containerStyle.innerContainer}>
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
              <MapView
                style={mapStyle.mapStyle}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                region={{
                  latitude: siteData.location.latitude,
                  longitude: siteData.location.longitude,
                  latitudeDelta: 0.4,
                  longitudeDelta: 0.5,
                }}
              >
                <Marker
                  key={1}
                  coordinate={{
                    latitude: siteData.location.latitude,
                    longitude: siteData.location.longitude,
                  }}
                />
              </MapView>
              <View style={containerStyle.buttonContainer}>
                <TouchableOpacity
                  style={buttonStyle.buttonInput}
                  onPress={() => handleClimbsClick(id, siteData.siteName)}
                >
                  <Text style={buttonStyle.buttonText}>Climbs</Text>
                </TouchableOpacity>
                {siteData.approved && userAdmin(auth.currentUser.uid) ? (
                  <></>
                ) : (
                  <ApprovalButton climbSite={true} climbSiteId={id} />
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={fontStyle.title}>Loading Site Data..</Text>
        )}
      </ImageBackground>
    </View>
  );
};

export default ClimbSiteDetailScreen;
