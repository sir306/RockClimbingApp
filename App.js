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

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='ClimbSites' component={ClimbSitesScreen} />
        <Stack.Screen name='ClimbsScreen' component={ClimbsScreen} />
        <Stack.Screen name='ClimbDetailScreen' component={ClimbDetailScreen} />
        <Stack.Screen
          name='ClimbSiteDetailScreen'
          component={ClimbSiteDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
