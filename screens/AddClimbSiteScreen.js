import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';
import React, { useEffect, useState } from 'react';
import { db, auth, firebase, userAdmin } from '../backend/firebase';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Progress from 'react-native-progress';

const AddClimbSiteScreen = () => {
  // states
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [climbSiteName, setClimbSiteName] = useState('');
  const [uploading, setUploading] = useState(false);

  // variables
  // form error
  let errMsg = 'Form Error:';

  // navigation
  const navigation = useNavigation();

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');
  const generalStyle = require('../styles/generalStyles');
  const inputStyle = require('../styles/inputStyles');
  const mapStyle = require('../styles/mapStyles');

  // background image
  const backgroundImage = require('../assets/background.jpg');

  // use effects
  // get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(
          'Permission to access location was denied, Setting starting location to ChristChurch New Zealand'
        );
        // set location to christchurch new zealand as permission denied
        setLocation({
          lat: -43.532101010800616,
          long: 172.63060362161082,
        });
        return;
      }
      try {
        let hasServiceEnabled = await Location.hasServicesEnabledAsync();

        if (hasServiceEnabled) {
          let location = await Location.getCurrentPositionAsync({});
          let latlong = {
            lat: location.coords.latitude,
            long: location.coords.longitude,
          };
          setLocation(latlong);
        } else {
          Alert.alert(
            'Location Not Enabled',
            'Please enable your location to find your location, Setting starting location to ChristChurch New Zealand. If you wish to set the marker on your position, then enable your location.'
          );
          setLocation({
            lat: -43.532101010800616,
            long: 172.63060362161082,
          });
        }
      } catch (error) {
        Alert.alert('Location Error', error);
      }
    })();
  }, [hasServiceEnabled]);

  // set loading text for location or set text to the error message
  let text = 'Waiting For Location..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // handle longPress for marker drop
  const handleLongPress = (e) => {
    // check not disabled as submitting
    if (!disabled) {
      setLocation({
        lat: e.nativeEvent.coordinate.latitude,
        long: e.nativeEvent.coordinate.longitude,
      });
    }
  };

  // handle onDragEnd for marker move
  const handleOnDragEnd = (e) => {
    if (!disabled) {
      setLocation({
        lat: e.nativeEvent.coordinate.latitude,
        long: e.nativeEvent.coordinate.longitude,
      });
    }
  };

  // validate data doesnt already exist
  const validateDataInDB = async () => {
    let noMatchingDoc = true;
    errMsg = 'Form Error:';
    let checked = false;
    const climbSiteCol = await db
      .collection('climbSites')
      .where('siteName', '==', climbSiteName.trimEnd())
      .limit(1)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length != 0) {
          noMatchingDoc = false;
          errMsg += ' A climb site with this name already exists. ';
        }
        return (checked = true);
      });
    // check complete
    if (checked) {
      // send data
      sendData(noMatchingDoc);
    }
  };

  // handle form submit
  const handleSubmit = async () => {
    setDisabled(true);
    if (location == null) {
      Alert.alert(
        'No Location Set',
        'You have not set a location, a location must be set for a climb site to be uploaded.'
      );
    } else if (climbSiteName == '') {
      Alert.alert(
        'No Climb Site Name Set',
        'You have not set a Climb Site Name, a Climb Site Name must be set for a climb site to be uploaded.'
      );
    } else {
      await validateDataInDB();
    }
    setDisabled(false);
  };

  // send Data
  const sendData = async (noMatchingDoc) => {
    if (!noMatchingDoc) {
      Alert.alert('Climb Site Already Exists', errMsg);
    } else {
      const climbSiteCol = db.collection('climbSites');
      let approved = await userAdmin(auth.currentUser.uid);
      const data = {
        approved: approved,
        climbTypes: [],
        gradeRange: [],
        location: new firebase.firestore.GeoPoint(location.lat, location.long),
        siteName: climbSiteName.trimEnd(),
      };
      climbSiteCol
        .add(data)
        .then((docRef) => {
          //// navigate back to climb site list
          Alert.alert(
            'Successful Upload',
            'Climb site: ' +
              climbSiteName +
              ', has been successfully uploaded.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.navigate('Climb Sites');
                },
              },
            ]
          );
        })
        .catch((error) => {
          console.log('error occured uploading');
          console.log(JSON.stringify(error));
          Alert.alert('Server Error', JSON.stringify(error));
        });
    }
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />
        <ScrollView style={containerStyle.scrollStyle}>
          <Text style={fontStyle.detailTitle}>Add New Climb Site</Text>
          <View style={containerStyle.innerContainer}>
            <View style={containerStyle.buttonContainer}>
              <Text style={fontStyle.detailTitle}>Climb Site Name</Text>
              <TextInput
                style={inputStyle.textInput}
                autoCapitalize='words'
                placeholder='Enter Climb Site Name..'
                placeholderTextColor={'white'}
                value={climbSiteName}
                onChangeText={(textInput) => setClimbSiteName(textInput)}
              />
              <Text style={fontStyle.detailTitle}>Climb Location</Text>
              <Text style={fontStyle.hintText}>{text}</Text>
              {!location ? (
                <>
                  <View style={containerStyle.loadingContainer}>
                    <Text style={fontStyle.detailTitle}>{text}</Text>
                    <Progress.CircleSnail
                      size={100}
                      thickness={8}
                      spinDuration={2000}
                      color={['green', 'blue', 'red', 'purple']}
                    />
                  </View>
                </>
              ) : (
                <>
                  <MapView
                    style={mapStyle.mapStyle}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    region={{
                      latitude: location.lat,
                      longitude: location.long,
                      latitudeDelta: 0.4,
                      longitudeDelta: 0.5,
                    }}
                    onLongPress={(e) => handleLongPress(e)}
                  >
                    <Marker
                      key={1}
                      draggable={true}
                      coordinate={{
                        latitude: location.lat,
                        longitude: location.long,
                      }}
                      onDragEnd={(e) => handleOnDragEnd(e)}
                    />
                  </MapView>
                  <Text style={fontStyle.hintText}>
                    Hint: If the marker is not on the location of the climb
                    area, you can move it by holding it down and dragging it or
                    you can click and hold on the position on the map to place
                    the marker where you want it.
                  </Text>
                </>
              )}

              <TouchableOpacity
                disabled={disabled}
                style={buttonStyle.buttonInput}
                onPress={() => handleSubmit()}
              >
                <Text style={buttonStyle.buttonText}>
                  Submit New Climb Site
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AddClimbSiteScreen;
