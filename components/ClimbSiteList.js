import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const ClimbSiteList = () => {
  // states
  const [climbSites, setClimbSites] = useState([]);
  // navigation
  const navigation = useNavigation();

  // background image
  const backgroundImage = require('../assets/homeBackground.jpg');

  // styles
  const imageStyle = require('../styles/imageStyles');
  const containerStyle = require('../styles/containerStyles');
  const buttonStyle = require('../styles/buttonStyles');

  // get database of climb sites
  useEffect(() => {
    async function fetchData() {
      const climbSiteCol = db.collection('climbSites');
      climbSiteCol.onSnapshot((querySnapshot) => {
        const climbSitesDocs = [];
        querySnapshot.forEach((doc) => {
          const { siteName } = doc.data();
          climbSitesDocs.push({ id: doc.id, siteName });
        });
        setClimbSites(climbSitesDocs);
      });
    }
    fetchData();
  }, []);

  return (
    <View style={containerStyle.flatlistContainer}>
      <FlatList
        style={{ width: '100%', padding: 0, margin: 0 }}
        data={climbSites}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={buttonStyle.buttonInput}>
            <Text style={buttonStyle.buttonText}>
              {item.siteName} {item.id}
            </Text>
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
