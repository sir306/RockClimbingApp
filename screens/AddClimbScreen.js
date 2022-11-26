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
import * as ImagePicker from 'expo-image-picker';
import { db, auth, firebase } from '../backend/firebase';
import { CheckBox } from '@rneui/themed';

const AddClimbScreen = (props) => {
  // props
  const climbSiteId = props.route.params.id;

  // states
  const [image, setImage] = useState(null);
  const [filename, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transfering, setTransfering] = useState(0);
  const [climbName, setClimbName] = useState('');
  const [hasBolts, setHasBolts] = useState(false);
  const [climbGrade, setClimbGrade] = useState(0);
  const [climbHeight, setClimbHeight] = useState(0);
  const [tradClimb, setTradClimb] = useState(false);
  const [hasClimbed, setHasClimbed] = useState(false);
  const [numOfBolts, setNumOfBolts] = useState(0);
  const [comments, setComments] = useState('');

  // variables
  let errMsg = 'Form Error:';

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');
  const generalStyle = require('../styles/generalStyles');
  const inputStyle = require('../styles/inputStyles');

  // background image
  const backgroundImage = require('../assets/background.jpg');

  // image picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitPhoto = async () => {
    let id = await auth.currentUser.uid;
    // Create file metadata including the user id
    var metadata = {
      customMetadata: {
        userUpload: id,
      },
    };
    var ref;
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      let imageName = image.substring(image.lastIndexOf('/') + 1);
      setFileName(imageName);
      ref = await firebase
        .storage()
        .ref('climbPhotos')
        .child(filename)
        .put(blob, metadata);
      setImage(null);
      return true;
    } catch (error) {
      console.log('error occured');
      console.log(error);
      console.log(JSON.stringify(error));
      Alert.alert('Server Error', JSON.stringify(error));
      return false;
    }
  };

  const uploadClimb = async () => {
    let imgUrl = await uploadImageToBucket();
    console.log(imgUrl);
  };

  // form submit handle
  const handleSubmit = async () => {
    // set uploading to true
    setUploading(true);
    let dataValidated = await validateData();
    if (!dataValidated) {
      Alert.alert(
        'Climb Form Incomplete',
        'The Climb you have submitted is incomplete, please complete the form before submitting. ' +
          errMsg
      );
      setUploading(false);
      return;
    } else {
      let result = await submitPhoto();
      if (result) {
        console.log(filename);
      }
    }
    //

    ///

    setUploading(false);
  };

  // create data package for firebase db upload
  

  // validate all user data returns true if all correct or false if not
  const validateData = async () => {
    console.log(isNaN(numOfBolts));
    // reset error message list
    errMsg = 'Form Error:';
    // check image
    if (image == null) {
      errMsg = errMsg + ' No Image Set.';
      return false;
    }
    // check climb name
    if (climbName == '') {
      errMsg = errMsg + ' No Climb Name.';
      return false;
    }
    // check climb grade is a integer number and not nan
    if (!Number.isInteger(climbGrade) || isNaN(climbGrade)) {
      errMsg = errMsg + ' Climb Grade Must Be A Positive Whole Number.';
      return false;
    }
    // check climb grade is not equal to or less than 0
    if (climbGrade <= 0) {
      errMsg = errMsg + ' Climb Grade Must Be A Positive Whole Number.';
      return false;
    }
    // check climb height is a integer number and not nan
    if (!Number.isInteger(climbHeight) || isNaN(climbHeight)) {
      errMsg = errMsg + ' Climb Height Must Be A Positive Whole Number.';
      return false;
    }
    // check the climb height is greater than 0
    if (climbHeight <= 0) {
      errMsg = errMsg + ' Climb Height Must Be A Positive Whole Number.';
      return false;
    }
    // if has bolts checked then check num of bolts inputted is not nan
    if (hasBolts && isNaN(numOfBolts)) {
      errMsg =
        errMsg +
        ' If the climb has bolts, then the number of bolts must be greater than 0.';
      return false;
    }
    // if has bolts checked then check num of bolts inputted is greater than 0
    if (hasBolts && numOfBolts <= 0) {
      errMsg =
        errMsg +
        ' If climb has bolts, then the number of bolts must be greater than 0.';
      return false;
    } else {
      // data passed validation
      return true;
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
          <Text style={fontStyle.detailTitle}>Add New Climb</Text>
          <View style={containerStyle.innerContainer}>
            <View style={containerStyle.buttonContainer}>
              {image && (
                <Image source={{ uri: image }} style={imageStyle.uploadImage} />
              )}
              {image ? (
                <TouchableOpacity
                  style={buttonStyle.buttonInput}
                  onPress={() => pickImage()}
                >
                  <Text style={buttonStyle.buttonText}>
                    Change Image From Camera Roll
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={buttonStyle.buttonInput}
                  onPress={() => pickImage()}
                >
                  <Text style={buttonStyle.buttonText}>
                    Pick Image From Camera Roll
                  </Text>
                </TouchableOpacity>
              )}

              <TextInput
                style={inputStyle.textInput}
                autoCapitalize='words'
                placeholder='Enter Climb Name..'
                placeholderTextColor={'white'}
                value={climbName}
                onChangeText={(text) => setClimbName(text)}
              />
              <TextInput
                style={inputStyle.textInput}
                placeholder='Enter Climb Grade..'
                keyboardType='numeric'
                placeholderTextColor={'white'}
                value={climbGrade}
                onChangeText={(text) => setClimbGrade(Number(text))}
              />
              <TextInput
                style={inputStyle.textInput}
                placeholder='Enter Climb Height In Meters..'
                keyboardType='numeric'
                placeholderTextColor={'white'}
                value={climbHeight}
                onChangeText={(text) => setClimbHeight(Number(text))}
              />
              <CheckBox
                containerStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',

                  marginVertical: '0%',
                }}
                textStyle={fontStyle.checkBox}
                center
                title={'Traditional'}
                checked={tradClimb}
                checkedColor={'white'}
                onPress={() => setTradClimb(!tradClimb)}
              />
              <CheckBox
                containerStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',

                  marginVertical: '0%',
                }}
                textStyle={fontStyle.checkBox}
                center
                title={'Climbed Already?'}
                checked={hasClimbed}
                checkedColor={'white'}
                onPress={() => setHasClimbed(!hasClimbed)}
              />
              <CheckBox
                containerStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',

                  marginVertical: '0%',
                }}
                textStyle={fontStyle.checkBox}
                center
                title={'Climb has bolts?'}
                checked={hasBolts}
                checkedColor={'white'}
                onPress={() => setHasBolts(!hasBolts)}
              />
              {hasBolts ? (
                <TextInput
                  style={inputStyle.textInput}
                  placeholder='Number Of Bolts..'
                  keyboardType='numeric'
                  placeholderTextColor={'white'}
                  value={numOfBolts}
                  onChangeText={(text) => setNumOfBolts(Number(text))}
                />
              ) : (
                <></>
              )}
              <TextInput
                style={inputStyle.textInput}
                placeholder='Climb Comments?'
                placeholderTextColor={'white'}
                value={comments}
                onChangeText={(text) => setComments(text)}
              />
              <TouchableOpacity
                disabled={uploading}
                style={buttonStyle.buttonInput}
                onPress={() => handleSubmit()}
              >
                <Text style={buttonStyle.buttonText}>Submit New Climb</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AddClimbScreen;
