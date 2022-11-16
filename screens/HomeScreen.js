import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../backend/firebase";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

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
    <View>
      <Text>HomeScreen</Text>
      <TouchableOpacity
        style={styles.buttonInput}
        onPress={() => handleLogout()}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

// stylesheet
const styles = StyleSheet.create({});

export default HomeScreen;
