import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const ClimbSiteList = () => {
  // states
  const [climbSites, setClimbSites] = useState([]);
  // navigation
  const navigation = useNavigation();

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');
  const generalStyle = require('../styles/generalStyles');

  // get database of climb sites
  useEffect(() => {
    async function fetchData() {
      const climbSiteCol = db.collection('climbSites');
      climbSiteCol.onSnapshot((querySnapshot) => {
        const climbSitesDocs = [];
        querySnapshot.forEach((doc) => {
          climbSitesDocs.push({ id: doc.id, data: doc.data() });
        });
        setClimbSites(climbSitesDocs);
      });
    }
    fetchData();
  }, []);

  // handle climbsite click
  const handleClimbSiteClick = (id) => {
    climbSites.forEach((site) => {
      if (site.id == id) {
        navigation.navigate('ClimbSiteDetailScreen', { site });
      }
    });
  };

  return (
    <View style={containerStyle.flatlistContainer}>
      <FlatList
        style={generalStyle.flatListStyle}
        data={climbSites}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={buttonStyle.buttonInput}
            onPress={() => handleClimbSiteClick(item.id)}
          >
            <Text style={buttonStyle.buttonText}>{item.data.siteName}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={buttonStyle.buttonInput}>
            <Text style={buttonStyle.buttonText}>Add New Climb Site</Text>
          </TouchableOpacity>
        }
      ></FlatList>
    </View>
  );
};

export default ClimbSiteList;
