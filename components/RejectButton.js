import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db, firebase } from '../backend/firebase';

const RejectButton = (params) => {
  // states
  const [disabled, setDisabled] = useState(false);
  // consts
  const isClimbSite = params.climbSite;
  const climbSiteId = params.climbSiteId;
  const data = params.data ? params.data : null;
  // Styles
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');

  // navigation
  const navigation = useNavigation();

  //functions
  // reject function for click
  const reject = () => {
    // is a climb site - delete climb site and all climbs of site
    if (isClimbSite) {
      Alert.alert(
        'Confirm Reject of Climb Site',
        'Are you sure you wish to reject this climb site? Rejecting a climb site is permanent and deletes the climb site and all climbs associated with it.',
        [
          {
            text: 'Yes',
            onPress: async () => {
              setDisabled(true);
              await deleteClimbSite();
              navigation.navigate('Climb Sites');
            },
          },
          { text: 'Cancel' },
        ]
      );
    }
    // is a climb just delete climb
    else {
      Alert.alert(
        'Confirm Reject of Climb',
        'Are you sure you wish to reject this climb? Rejecting a climb is permanent and deletes the climb and the image associated with it.',
        [
          {
            text: 'Yes',
            onPress: async () => {
              setDisabled(true);
              await deleteClimb();
              navigation.navigate('Climbs', {
                id: climbSiteId,
                name: data.climbSiteName,
              });
            },
          },
          { text: 'Cancel' },
        ]
      );
    }
  };

  // delete climb and image
  const deleteClimb = async () => {
    const climbDoc = db.collection('climbs').doc(data.climbId);
    let imageUrl = (await climbDoc.get()).data().imgUrl;
    let imageRef = firebase.storage().refFromURL(imageUrl);
    imageRef.delete().catch((error) => {
      Alert.alert('Image Delete Failed', error);
    });
    climbDoc.delete().catch((error) => {
      Alert.alert('Climb Delete Failed', error);
    });
  };

  // delete climb site and climbs
  const deleteClimbSite = async () => {
    const climbSiteDoc = db.collection('climbSites').doc(climbSiteId);
    const climbsCol = db
      .collection('climbs')
      .where('climbSiteId', '==', climbSiteId);
    // get all climbs associated with the site and delete from storage and firebase
    climbsCol
      .get()
      .then((querySnapshot) => {
        Promise.all(
          querySnapshot.docs.map((doc) => {
            // get image url from the doc and delete
            let imageUrl = doc.data().imgUrl;
            let imageRef = firebase.storage().refFromURL(imageUrl);
            imageRef.delete().catch((error) => {
              setDisabled(false);
              Alert.alert('Image Delete Failed', error);
            });
            // delete the doc
            doc.ref.delete().catch((error) => {
              setDisabled(false);
              Alert.alert('Climb Delete Failed', error);
            });
          })
        );
      })
      .catch((error) => {
        Alert.alert('Delete Error', error);
        setDisabled(false);
      });
    // finally delete the climb site
    climbSiteDoc.delete().catch((error) => {
      setDisabled(false);
      Alert.alert('Climb Site Delete Failed', error);
    });
  };
  return (
    <View style={containerStyle.buttonContainer}>
      <TouchableOpacity
        disabled={disabled}
        style={disabled ? buttonStyle.disabled : buttonStyle.rejectInput}
        onPress={() => {
          reject();
        }}
      >
        <Text style={buttonStyle.buttonText}>
          Reject {isClimbSite ? 'Climb Site' : 'Climb'}?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RejectButton;
