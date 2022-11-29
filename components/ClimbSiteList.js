import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, auth, userAdmin } from '../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const ClimbSiteList = () => {
  // states
  const [climbSites, setClimbSites] = useState([]);
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
      setClimbSites([]);
      setLoadData(true);
    });
    return unscribe;
  }, [navigation]);

  // get database of climb sites
  useEffect(() => {
    async function fetchData() {
      const climbSiteCol = db.collection('climbSites');
      let approved = await userAdmin(auth.currentUser.uid);

      var unsubscribe = climbSiteCol.onSnapshot((querySnapshot) => {
        const climbSitesDocs = [];
        querySnapshot.forEach((doc) => {
          if (approved) {
            climbSitesDocs.push({ id: doc.id, data: doc.data() });
          } else {
            if (doc.data().approved) {
              climbSitesDocs.push({ id: doc.id, data: doc.data() });
            }
          }
        });
        setClimbSites(climbSitesDocs);
        setLoadData(false);
        unsubscribe();
      });
    }
    if (loadData) {
      fetchData();
    }
  }, [loadData, climbSites]);

  // handle climbsite click
  const handleClimbSiteClick = (id) => {
    climbSites.forEach((site) => {
      if (site.id == id) {
        navigation.navigate('Climb Site Detail', { site });
      }
    });
  };

  const handleAddClimbSiteClick = () => {
    navigation.navigate('Add Climb Site');
  };
  return (
    <View style={containerStyle.flatlistContainer}>
      <FlatList
        style={generalStyle.flatListStyle}
        data={climbSites}
        numColumns={1}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.data.approved ? (
            <TouchableOpacity
              style={buttonStyle.buttonInput}
              onPress={() => handleClimbSiteClick(item.id)}
            >
              <Text style={buttonStyle.buttonText}>{item.data.siteName}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={buttonStyle.buttonInputApprovalPending}
              onPress={() => handleClimbSiteClick(item.id)}
            >
              <Text style={buttonStyle.buttonText}>{item.data.siteName}</Text>
            </TouchableOpacity>
          )
        }
        ListFooterComponent={
          <TouchableOpacity
            style={buttonStyle.buttonInput}
            onPress={() => handleAddClimbSiteClick()}
          >
            <Text style={buttonStyle.buttonText}>Add New Climb Site</Text>
          </TouchableOpacity>
        }
      ></FlatList>
    </View>
  );
};

export default ClimbSiteList;
