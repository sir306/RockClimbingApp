import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../backend/firebase";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  // states
  const [climbSites, setClimbSites] = useState([]);
  // navigation
  const navigation = useNavigation();

  // background image
  const backgroundImage = require("../assets/homeBackground.jpg");

  // styles
  const imageStyle = require("../styles/imageStyles");
  const containerStyle = require("../styles/containerStyles");
  const buttonStyle = require("../styles/buttonStyles");

  // get database of climb sites
  useEffect(() => {
    db.collection("climbSites")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((snapshot) => {
          setClimbSites(snapshot.data);
          console.log(climbSites);
        });
      });
  }, []);

  // home function
  const handleHome = () => {
    navigation.navigate("Home");
  };

  // logout function
  const handleLogout = () => {
    auth
      .signOut()
      .then(function () {
        // Sign-out successful.
        navigation.navigate("Login");
      })
      .catch(function (error) {
        alert(error.message);
      });
  };
  return (
    <View style={containerStyle.container}>
      <ImageBackground
        source={backgroundImage}
        style={imageStyle.imageBackground}
      >
        <View style={containerStyle.menuContainer}>
          <TouchableOpacity
            style={buttonStyle.logoutInput}
            onPress={() => handleLogout()}
          >
            <Text style={buttonStyle.buttonText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={buttonStyle.menuInput}
            onPress={() => handleHome()}
          >
            <Text style={buttonStyle.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
        <Text>HomeScreen</Text>
      </ImageBackground>
    </View>
  );
};

// stylesheet
const styles = StyleSheet.create({});

export default HomeScreen;
