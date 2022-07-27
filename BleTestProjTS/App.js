import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TestingScreen from './Screens/TestingScreen'
import HomeScreen from './Screens/HomeScreen'
import LogsScreen from './Screens/LogsScreen'

const Stack = createNativeStackNavigator();


const App = () => {

  // Researcher ID SVs
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
