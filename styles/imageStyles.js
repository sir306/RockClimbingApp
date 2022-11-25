import { Dimensions, StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  imageClimb: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '100%',
    marginHorizontal: '5%',
    marginVertical: '0%',
    paddingHorizontal: '5%',
  },
  uploadImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
    resizeMode: 'contain',
    marginHorizontal: '0%',
    marginVertical: '0%',
    paddingHorizontal: '1%',
  },
});
