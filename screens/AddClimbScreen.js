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
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, firebase, userAdmin } from '../backend/firebase';
import { CheckBox } from '@rneui/themed';
import * as Progress from 'react-native-progress';

const AddClimbScreen = ({ route }) => {
  // props
  const climbSiteId = route.params.id;
  const climbSiteName = route.params.siteName;

  // states
  const [image, setImage] = useState(null);
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

  // navigation
  const navigation = useNavigation();

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');
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

  // upload image to firebase storage
  const submitPhoto = async () => {
    // reset transfer back to 0
    setTransfering(0);
    // get user id
    let id = auth.currentUser.uid;
    // Create file metadata including the user id
    var metadata = {
      customMetadata: {
        userUpload: id,
      },
    };
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      let imageName = image.substring(image.lastIndexOf('/') + 1);
      var imageRef = firebase.storage().ref('climbPhotos').child(imageName);
      var task = imageRef.put(blob, metadata);

      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setTransfering(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.log('error occured!!', +error.message);
          Alert.alert('Server Error', JSON.stringify(error.message));
          setUploading(false);
          setImage(null);
        },
        () => {
          imageRef.getDownloadURL().then((url) => {
            setImage(null);
            createClimbDataPack(url);
          });
        }
      );
    } catch (error) {
      console.log('error occured');
      console.log(error);
      console.log(JSON.stringify(error));
      Alert.alert('Server Error', JSON.stringify(error));
    }
  };

  // upload the climb image uploaded and data ready to go
  const uploadClimb = (data) => {
    db.collection('climbs')
      .add(data)
      .then((docRef) => {
        // if user is not admin then they cant update climb site so done
        if (!userAdmin(auth.currentUser.uid)) {
          Alert.alert(
            'Climb Succesfully Uploaded',
            data.climbName + ' has been successfully uploaded. Pending Approval From Admin, the climb will be visible once approved.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.navigate('Climbs', {
                    id: climbSiteId,
                    name: climbSiteName,
                  });
                },
              },
            ]
          );
          setUploading(false);
        } else {
          // user is admin update climbsite data
          updateClimbSites();
        }
      })
      .catch((error) => {
        Alert.alert('Server Error', JSON.stringify(error));
        setUploading(false);
      });
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
      await submitPhoto();
    }
  };

  // check and update climb site if grade range and climbTypes needs
  // updating
  const updateClimbSites = async () => {
    const climbSiteDoc = await db
      .collection('climbSites')
      .doc(climbSiteId)
      .get();
    let noMatchType = true; // bool for checking climbTypes
    let updateGradeRange = false; // bool for checking gradeRange
    // loop through to find a match
    // if noMatch is set to false then a match has been found and no need to
    // proceed

    // loop and check climb types
    climbSiteDoc.data().climbTypes.forEach((type) => {
      // mixed climb
      if (hasBolts && tradClimb && noMatchType) {
        if (type == 'Mixed') {
          noMatchType = false;
        }
      }
      // trad climb
      else if (tradClimb && !hasBolts && noMatchType) {
        if (type == 'Traditional') {
          noMatchType = false;
        }
      }
      // sports climb
      else if (hasBolts && !tradClimb && noMatchType) {
        if (type == 'Sports') {
          noMatchType = false;
        }
      }
    });
    let gradeRange = climbSiteDoc.data().gradeRange;
    // switch check range
    switch (gradeRange.length) {
      case 0:
        // if gradeRange length is 0 then no climbs with range so update
        gradeRange.push(climbGrade);
        updateGradeRange = true;
        break;
      case 1:
        // only one so check to see if less or greater than value
        // if less than new value push new value
        if (gradeRange[0] < climbGrade) {
          gradeRange.push(climbGrade);
          updateGradeRange = true;
        }
        // if gradeRange is greater then climbGrade goes first
        if (gradeRange[0] > climbGrade) {
          var newArray = [climbGrade, gradeRange[0]];
          gradeRange = newArray;
          updateGradeRange = true;
        }
        break;
      case 2:
        // has two values so need to check if gradeRange[0] is bigger than the new value
        // or check that gradeRange[1] is smaller than the new value
        // check first value is bigger than new value
        if (gradeRange[0] > climbGrade) {
          var newArray = [climbGrade, gradeRange[1]];
          gradeRange = newArray;
          updateGradeRange = true;
        }
        // check last value if smaller than new value
        if (gradeRange[1] < climbGrade) {
          var newArray = [gradeRange[0], climbGrade];
          gradeRange = newArray;
          updateGradeRange = true;
        }
        break;
      default:
        break;
    }

    // if noMatch is still true  or updateGradeRange is true then update is required
    if (noMatchType || updateGradeRange) {
      let climbTypeData = climbSiteDoc.data().climbTypes;
      // mixed climb
      if (hasBolts && tradClimb && noMatchType) {
        climbTypeData.push('Mixed');
      }
      // trad climb
      else if (tradClimb && !hasBolts && noMatchType) {
        climbTypeData.push('Traditional');
      }
      // sports climb
      else if (hasBolts && !tradClimb && noMatchType) {
        climbTypeData.push('Sports');
      }
      db.collection('climbSites')
        .doc(climbSiteId)
        .update({ climbTypes: climbTypeData, gradeRange: gradeRange })
        .then(() => {
          Alert.alert(
            'Climb Succesfully Uploaded',
            climbName + ' has been successfully uploaded!',
            [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.navigate('Climbs', {
                    id: climbSiteId,
                    name: climbSiteName,
                  });
                },
              },
            ]
          );
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setUploading(false);
        });
    } else {
      Alert.alert(
        'Climb Succesfully Uploaded',
        climbName + ' has been successfully uploaded!',
        [
          {
            text: 'Ok',
            onPress: () => {
              navigation.navigate('Climbs', {
                id: climbSiteId,
                name: climbSiteName,
              });
            },
          },
        ]
      );
      setUploading(false);
    }
  };

  // create data package for firebase db upload
  const createClimbDataPack = (url) => {
    let approved = false;
    // check user is admin
    if (userAdmin(auth.currentUser.uid)) {
      approved = true;
    }

    const data = {
      approved: approved,
      approxHeight: climbHeight,
      bolts: numOfBolts,
      climbName: climbName.trimEnd(),
      climbSiteId: climbSiteId,
      climbSiteName: climbSiteName,
      climbedClimbers: [],
      comments: comments,
      grade: climbGrade,
      trad: tradClimb,
      imgUrl: url,
    };

    // check has climbed
    if (hasClimbed) {
      data.climbedClimbers.push(auth.currentUser.uid);
    }
    // upload completed climb data
    uploadClimb(data);
  };

  // validate all user data returns true if all correct or false if not
  const validateData = async () => {
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
          {!uploading ? (
            <>
              <Text style={fontStyle.detailTitle}>Add New Climb</Text>

              <View style={containerStyle.innerContainer}>
                <View style={containerStyle.buttonContainer}>
                  {image && (
                    <>
                      <Text style={fontStyle.detailTitle}>Climb Photo</Text>
                      <Image
                        source={{ uri: image }}
                        style={imageStyle.uploadImage}
                      />
                    </>
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
                  <Text style={fontStyle.detailTitle}>Climb Name</Text>
                  <TextInput
                    style={inputStyle.textInput}
                    autoCapitalize='words'
                    placeholder='Enter Climb Name..'
                    placeholderTextColor={'white'}
                    value={climbName}
                    onChangeText={(text) => setClimbName(text)}
                  />
                  <Text style={fontStyle.detailTitle}>Climb Grade</Text>
                  <TextInput
                    style={inputStyle.textInput}
                    placeholder='Enter Climb Grade..'
                    keyboardType='numeric'
                    placeholderTextColor={'white'}
                    value={climbGrade}
                    onChangeText={(text) => setClimbGrade(Number(text))}
                  />
                  <Text style={fontStyle.detailTitle}>Climb Height</Text>
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
                    <>
                      <Text style={fontStyle.detailTitle}>
                        Number of Bolt Placements
                      </Text>
                      <TextInput
                        style={inputStyle.textInput}
                        placeholder='Number Of Bolts..'
                        keyboardType='numeric'
                        placeholderTextColor={'white'}
                        value={numOfBolts}
                        onChangeText={(text) => setNumOfBolts(Number(text))}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <Text style={fontStyle.detailTitle}>Climb Comments</Text>
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
            </>
          ) : (
            <View style={containerStyle.loadingContainer}>
              <Text style={fontStyle.detailTitle}>
                Uploading Climb Please Wait..
              </Text>
              {transfering != 100 ? (
                <>
                  <Text></Text>
                  <Text style={fontStyle.details}>
                    Uploading Image Please Wait..
                  </Text>
                  <Progress.Circle
                    style={{ margin: 10 }}
                    size={100}
                    showsText={true}
                    color={'white'}
                    thickness={8}
                    progress={transfering / 100}
                  />
                </>
              ) : (
                <>
                  <Text></Text>
                  <Text style={fontStyle.details}>
                    Image Uploaded, Uploading Climb Please Wait..
                  </Text>
                </>
              )}

              <Progress.CircleSnail
                size={100}
                thickness={8}
                spinDuration={2000}
                color={['green', 'blue', 'red', 'purple']}
              />
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AddClimbScreen;
