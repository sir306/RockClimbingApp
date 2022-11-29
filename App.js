import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ClimbSitesScreen from './screens/ClimbSitesScreen';
import ClimbsScreen from './screens/ClimbsScreen';
import ClimbDetailScreen from './screens/ClimbDetailScreen';
import ClimbSiteDetailScreen from './screens/ClimbSiteDetailScreen';
import AddClimbScreen from './screens/AddClimbScreen';
import AddClimbSiteScreen from './screens/AddClimbSiteScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Climb Sites' component={ClimbSitesScreen} />
        <Stack.Screen name='Climbs' component={ClimbsScreen} />
        <Stack.Screen name='Climb Detail' component={ClimbDetailScreen} />
        <Stack.Screen
          name='Climb Site Detail'
          component={ClimbSiteDetailScreen}
        />
        <Stack.Screen name='Add Climb' component={AddClimbScreen} />
        <Stack.Screen name='Add Climb Site' component={AddClimbSiteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
