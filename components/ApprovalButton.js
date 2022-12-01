import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, Ref, useRef } from 'react';
import { db, auth, firebase, userAdmin } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const ApprovalButton = (params) => {
  // states
  const [disabled, setDisabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  // consts
  const isClimbSite = params.climbSite;
  const climbSiteId = params.climbSiteId;
  const data = params.data ? params.data : null;
  const buttonRef = useRef();
  // Styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const fontStyle = require('../styles/fontStyles');

  // functions
  // approve function from click
  const approve = async () => {
    setUploading(true);
    // get the climb site doc
    const climbSiteDoc = db.collection('climbSites').doc(climbSiteId);
    if (isClimbSite) {
      approveClimbSite();
    } else {
      // this is a climb check data not null if so disable button
      if (data == null) {
        Alert.alert(
          'No Data Provided',
          'The Climb can not be approved due to no data being passed'
        );
        setUploading(false);
        setDisabled(true);
      } else {
        let noMatchType = true; // bool for checking climbTypes
        let updateGradeRange = false; // bool for checking gradeRange
        let hasBolts = data.bolts > 0;
        let tradClimb = data.trad;
        let climbGrade = data.grade;
        // loop through to find a match
        // if noMatch is set to false then a match has been found and no need to
        // proceed
        // loop and check climb types
        const climbSiteDocData = (await climbSiteDoc.get()).data();
        climbSiteDocData.climbTypes.forEach((type) => {
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
        console.log('after loop');
        let gradeRange = climbSiteDocData.gradeRange;
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
        console.log('after switch');
        console.log(climbSiteDocData);
        // if noMatch is still true  or updateGradeRange is true then update is required
        if (noMatchType || updateGradeRange) {
          let climbTypeData = climbSiteDocData.climbTypes;
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
          console.log('before climbsite update');
          // update climbsites then update climb approved
          db.collection('climbSites')
            .doc(climbSiteId)
            .update({ climbTypes: climbTypeData, gradeRange: gradeRange })
            .catch((error) => {
              Alert.alert('Server Error', JSON.stringify(error));
              setUploading(false);
            })
            .then(() => {
              console.log('before climb approval');
              approveClimb();
            });
        } else {
          approveClimb();
        }
      }
    }
  };

  // approve climb site
  const approveClimbSite = () => {
    const climbSiteDoc = db.collection('climbSites').doc(climbSiteId);
    climbSiteDoc
      .update({ approved: true })
      .then(() => {
        let text = isClimbSite ? 'Climb Site' : 'Climb';
        Alert.alert(
          'Successfully Approved',
          'The ' + { text } + ' is now approved'
        );
        setUploading(false);
      })
      .catch((error) => {
        Alert.alert('Server Error', JSON.stringify(error));
        setUploading(false);
      });
  };

  // approve climb
  const approveClimb = () => {
    // get the climb doc
    const climbDoc = db.collection('climbs').doc(data.climbId);
    // approve climb
    climbDoc
      .update({ approved: true })
      .then(() => {
        Alert.alert(
          'Climb Succesfully Approved',
          'Climb has been successfully approved!'
        );
        setUploading(false);
      })
      .catch((error) => {
        Alert.alert('Server Error', JSON.stringify(error));
        setUploading(false);
      });
  };

  return (
    <View style={containerStyle.buttonContainer}>
      <TouchableOpacity
        disabled={disabled || uploading}
        style={disabled ? buttonStyle.disabled : buttonStyle.buttonInput}
        onPress={() => {
          approve();
        }}
      >
        <Text style={buttonStyle.buttonText}>
          Approve {isClimbSite ? 'Climb Site' : 'Climb'}?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ApprovalButton;
