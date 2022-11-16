import { StyleSheet } from "react-native";

module.exports = StyleSheet.create({
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
  buttonContainer: {
    width: "100%",
  },
  logoutContainer: {
    width: "20%",
    alignSelf: "flex-end",
    paddingBottom: 10,
    paddingTop: 10,
    marginRight: "5%",
  },
});
