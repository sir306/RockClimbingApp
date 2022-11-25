import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const ClimbsList = (props) => {
  //climb site id
  const id = props.id;

  // states
  const [climbs, setClimbs] = useState([]);

  // navigation
  const navigation = useNavigation();

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const generalStyle = require('../styles/generalStyles');

  // get database of climbs from the climbsite id
  useEffect(() => {
    async function fetchData() {
      const climbsCol = db.collection('climbs');
      const snapshot = await climbsCol.where('climbSiteId', '==', id).get();
      if (snapshot.empty) {
        console.log('No matching documents.');
      } else {
        const climbDocs = [];
        snapshot.forEach((doc) => {
          climbDocs.push({ id: doc.id, data: doc.data() });
        });
        setClimbs(climbDocs);
      }
    }
    fetchData();
  }, []);

  // handle climbsite click
  const handleClimbSiteClick = (id) => {
    climbs.forEach((climb) => {
      if (climb.id == id) {
        navigation.navigate('ClimbDetailScreen', { climb });
      }
    });
  };

  // handle add new climb click
  const handleAddClimbClick = () => {
    navigation.navigate('AddClimbScreen');
  };

  return (
    <View style={containerStyle.flatlistContainer}>
      <FlatList
        style={generalStyle.flatListStyle}
        data={climbs}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={buttonStyle.buttonInput}
            onPress={() => handleClimbSiteClick(item.id)}
          >
            <Text style={buttonStyle.buttonText}>{item.data.climbName}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={buttonStyle.buttonInput}
            onPress={() => handleAddClimbClick()}
          >
            <Text style={buttonStyle.buttonText}>Add New Climb</Text>
          </TouchableOpacity>
        }
      ></FlatList>
    </View>
  );
};

export default ClimbsList;
