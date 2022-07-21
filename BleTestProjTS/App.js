import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BleManager, Device, Service, Characteristic, Descriptor } from 'react-native-ble-plx'
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage';

import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

import TestingScreen from './Screens/TestingScreen'
import HomeScreen from './Screens/HomeScreen'
import LogsScreen from './Screens/LogsScreen'

const Stack = createNativeStackNavigator();
const ble = new BleManager();

// BLE UUIDs
// --- SMURF ---
const SMURF_COMM_SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb';
const CMD_CHAR_UUID = '00006789-0000-1000-8000-00805f9b34fb';
const SMURF_DATA_CHAR_1_UUID = '00002345-0000-1000-8000-00805f9b34fb';
const SMURF_DATA_CHAR_2_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';


const App = () => {
  const [researcherID, setResearcherID] = useState('')
  const [emptyResearcher, setEmptyResearcher] = useState(true)

  const setResearcher = (value) => {
    setResearcherID(value)
    setEmptyResearcher(false)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => <HomeScreen {...props}
            setResearcher={setResearcher}
            emptyResearcher={emptyResearcher} />}
        </Stack.Screen>
        <Stack.Screen name="Testing">
          {props => <TestingScreen {...props}
            researcherID={researcherID} />}
        </Stack.Screen>
        <Stack.Screen name="Logs" component={LogsScreen} />
      </Stack.Navigator>
    </NavigationContainer>


  );
};

export default App;
