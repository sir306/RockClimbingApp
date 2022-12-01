import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db, userAdmin } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const ClimbsList = (props) => {
  //climb site id
  const id = props.id;
  //climb site name
  const siteName = props.name;
  // states
  const [climbs, setClimbs] = useState([]);
  const [loadData, setLoadData] = useState(true);

  // navigation
  const navigation = useNavigation();

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const generalStyle = require('../styles/generalStyles');
  const fontStyle = require('../styles/fontStyles');

  // cause rerender on navigate
  useEffect(() => {
    const unscribe = navigation.addListener('focus', () => {
      setClimbs([]);
      setLoadData(true);
    });
    return unscribe;
  }, [navigation]);

  // get database of climbs from the climbsite id
  useEffect(() => {
    async function fetchData() {
      let approved = await userAdmin(auth.currentUser.uid);
      const climbsCol = db
        .collection('climbs')
        .orderBy('climbName')
        .where('climbSiteId', '==', id);
      var unsubscribe = climbsCol.onSnapshot((snapshot) => {
        const climbDocs = [];
        snapshot.forEach((doc) => {
          if (approved) {
            climbDocs.push({ id: doc.id, data: doc.data() });
          } else {
            if (doc.data().approved == true) {
              climbDocs.push({ id: doc.id, data: doc.data() });
            }
          }
        });
        setClimbs(climbDocs);
        unsubscribe();
        setLoadData(false);
      });
    }
    if (loadData) {
      fetchData();
    }
  }, [loadData, climbs]);

  // handle climbsite click
  const handleClimbSiteClick = (id) => {
    climbs.forEach((climb) => {
      if (climb.id == id) {
        navigation.navigate('Climb Detail', { climb });
      }
    });
  };

  // handle add new climb click
  const handleAddClimbClick = (id) => {
    navigation.navigate('Add Climb', { id, siteName });
  };

  return (
    <View style={containerStyle.flatlistContainer}>
      {!loadData ? (
        <FlatList
          style={generalStyle.flatListStyle}
          data={climbs}
          numColumns={1}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            item.data.approved ? (
              <TouchableOpacity
                style={buttonStyle.buttonInput}
                onPress={() => handleClimbSiteClick(item.id)}
              >
                <Text style={buttonStyle.buttonText}>
                  {item.data.climbName}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={buttonStyle.buttonInputApprovalPending}
                onPress={() => handleClimbSiteClick(item.id)}
              >
                <Text style={buttonStyle.buttonText}>
                  {item.data.climbName}
                </Text>
              </TouchableOpacity>
            )
          }
          ListFooterComponent={
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => handleAddClimbClick(id)}
            >
              <Text style={buttonStyle.buttonText}>Add New Climb</Text>
            </TouchableOpacity>
          }
        ></FlatList>
      ) : (
        <View style={containerStyle.loadingContainer}>
          <Text style={fontStyle.title}>Loading..</Text>
          <Progress.CircleSnail
            size={100}
            thickness={8}
            spinDuration={2000}
            color={['green', 'blue', 'red', 'purple']}
          />
        </View>
      )}
    </View>
  );
};

export default ClimbsList;
