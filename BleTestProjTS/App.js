import React, { useReducer } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ConnectionContainer from './components/ConnectionContainer'
import DeviceControls from './components/DeviceControls'
import TestingScreen from './Screens/TestingScreen'
import HomeScreen from './Screens/HomeScreen'

const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Testing" component={TestingScreen} />
      </Stack.Navigator>
    </NavigationContainer>


  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

export default App;
