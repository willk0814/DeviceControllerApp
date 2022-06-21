import React, { useReducer } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ConnectionContainer from './components/ConnectionContainer'
import DeviceControls from './components/DeviceControls'
import AppContainer from './components/AppContainer'



const App = () => {
  return (
    <View style={styles.pageContainer}>
      <AppContainer />
    </View>

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
