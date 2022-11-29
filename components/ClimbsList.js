import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db, userAdmin } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

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
      const climbsCol = db.collection('climbs');
      const snapshot = await climbsCol.where('climbSiteId', '==', id).get();
      let approved = await userAdmin(auth.currentUser.uid);
      if (snapshot.empty) {
        console.log('No matching documents.');
      } else {
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
        setLoadData(false);
      }
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
              <Text style={buttonStyle.buttonText}>{item.data.climbName}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={buttonStyle.buttonInputApprovalPending}
              onPress={() => handleClimbSiteClick(item.id)}
            >
              <Text style={buttonStyle.buttonText}>{item.data.climbName}</Text>
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
    </View>
  );
};

export default ClimbsList;
