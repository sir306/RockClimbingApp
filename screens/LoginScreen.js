import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../backend/firebase";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // navigation
  const navigation = useNavigation();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });
  }, []);

  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  // handle sign in func
  const handleSignIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((useCredentials) => {
        const user = useCredentials.user;
        console.log("User register with:", user.email);
        navigation.navigate("Home");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/loginRegister.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.title}>Please Login or</Text>
        <Text style={styles.title}>Register A New Account</Text>
        <View style={styles.innerContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Your Email.."
              placeholderTextColor={"white"}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter Your Password.."
              placeholderTextColor={"white"}
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonInput}
              onPress={() => handleSignUp()}
            >
              <Text style={styles.buttonText}>Register New Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonInput}
              onPress={() => handleSignIn()}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    margin: "0%",
    textAlign: "center",
  },
  innerContainer: {
    flex: 0.5,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    margin: "5%",
    textAlign: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
  },
  buttonInput: {
    width: "100%",
    borderWidth: 3,
    borderRadius: 10,
    padding: "5%",
    margin: "1%",
    backgroundColor: "rgba(20, 20, 255, 0.85)",
    borderColor: "rgba(253, 60, 28, 1)",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  inputContainer: {
    width: "100%",
    justifyContent: "space-between",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    borderWidth: 3,
    borderRadius: 10,
    padding: "5%",
    margin: "1%",
    backgroundColor: "rgba(20, 20, 255, 0.3)",
    borderColor: "rgba(253, 60, 28, 0.4)",
    color: "white",
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginScreen;
