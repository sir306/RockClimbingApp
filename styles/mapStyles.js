import { Dimensions, StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
  mapStyle: {
    width:
      Dimensions.get('window').width - Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').height / 3,
    marginHorizontal: 15,
    marginBottom: 15,
  },
});
