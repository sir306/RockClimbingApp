import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, firebase } from '../backend/firebase';

const AddClimbScreen = () => {
  // states
  const [image, setImage] = useState(null);
  const [filename, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transfering, setTransfering] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');
  const generalStyle = require('../styles/generalStyles');

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
    setUploading(true);
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
      console.log(ref.metadata.name);
    } catch (error) {
      console.log(error);
    }

    setUploading(false);
    setImage(null);
  };

  const uploadClimb = async () => {
    let imgUrl = await uploadImageToBucket();
    console.log(imgUrl);
  };

  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <Menu />
        <ScrollView style={containerStyle.scrollStyle}>
          <Text style={fontStyle.detailTitle}>AddClimbScreen</Text>
          <View style={containerStyle.innerContainer}>
            <View style={containerStyle.buttonContainer}>
              <TouchableOpacity
                style={buttonStyle.buttonInput}
                onPress={() => pickImage()}
              >
                <Text style={buttonStyle.buttonText}>
                  Pick image from camera roll
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={buttonStyle.buttonInput}
                onPress={() => submitPhoto()}
              >
                <Text style={buttonStyle.buttonText}>upload image</Text>
              </TouchableOpacity>
            </View>
          </View>
          {image && (
            <Image source={{ uri: image }} style={imageStyle.uploadImage} />
          )}
        </ScrollView>

        {/* <View style={containerStyle.innerContainer}>
          <View style={containerStyle.buttonContainer}>
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => pickImage()}
            >
              <Text style={buttonStyle.buttonText}>
                Pick image from camera roll
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => submitPhoto()}
            >
              <Text style={buttonStyle.buttonText}>upload image</Text>
            </TouchableOpacity>
          </View>
        </View>
        {image && (
          <Image source={{ uri: image }} style={imageStyle.uploadImage} />
        )} */}
      </ImageBackground>
    </View>
  );
};

export default AddClimbScreen;
