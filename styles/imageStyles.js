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
    height: Dimensions.get('window').height / 2,
    marginHorizontal: '5%',
    marginVertical: '0%',
    paddingHorizontal: '5%',
  },
  uploadImage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '100%',
    height: Dimensions.get('window').height / 2,
    marginHorizontal: '0%',
    marginVertical: '0%',
    paddingHorizontal: '0%',
    resizeMode: 'contain',
  },
});
