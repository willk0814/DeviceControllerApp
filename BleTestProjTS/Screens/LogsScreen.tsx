import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';

import AvailableSession from '../components/AvailableSession'

export default function LogsScreen() {

    const [dataDict, setDataDict] = useState({})
    const [availableEntries, setAvailableEntries] = useState(false)

    const handleSearchForRecords = async () => {
        if (await AsyncStorage.getItem('sessions') != null) {
            setAvailableEntries(true)
        } else {
            setAvailableEntries(false)
            return 0
        }
        let tmpAvailableSessions = null
        try {
            tmpAvailableSessions = JSON.parse(await AsyncStorage.getItem('sessions')).split('$$$')
        } catch (err) {
            console.log(err)
        }
        let tmpDict = {}

        for (let i = 0; i < tmpAvailableSessions.length; i++) {
            let tmpSessionData = JSON.parse(await AsyncStorage.getItem(tmpAvailableSessions[i]))
            let tmpSessionSize = tmpSessionData.size
            tmpSessionData = tmpSessionData.data
            let tmpYData = []
            for (let i = 0; i < tmpSessionData.length; i++) {
                tmpYData[i] = tmpSessionData[i]
            }
            console.log(tmpYData, tmpSessionSize)
            tmpDict[tmpAvailableSessions[i]] = [tmpYData, tmpSessionSize]
        }
        setDataDict(tmpDict)
    }

    const clearRecords = async () => {
        await AsyncStorage.removeItem('sessions')
        setAvailableEntries(false)
        setDataDict({})
    }

    return (
        <View style={styles.pageContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Welcome to the Logs Screen</Text>
                <View style={styles.rowContainer}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={handleSearchForRecords}>
                        <Text style={styles.buttonText}>Search for Logs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={clearRecords} >
                        <Text style={styles.buttonText}>Clear Records</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {availableEntries ? (
                <ScrollView
                    style={styles.listView}
                    horizontal={false}
                    showsVerticalScrollIndicator={true}>

                    {Object.entries(dataDict).map(([key, value]) => <AvailableSession keyVal={key} testData={value[0]} testSize={value[1]} />)}

                </ScrollView>
            ) : (
                    <View style={styles.listView}>
                        <Text style={[{ color: '#cddddd' }, { fontSize: 20 }]}>Looks like you have no stored Logs, run some tests and save them here</Text>
                    </View>
                )}


        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#2E2F2F'
    },
    titleContainer: {
        marginVertical: 15,
        alignItems: 'center',
        textAlign: 'flex-start'

    },
    titleStyle: {
        fontSize: 35,
        color: '#cddddd',
        marginBottom: 10
    },
    rowContainer: {
        flexDirection: 'row'
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 5
    },
    buttonText: {
        color: '#cddddd',
        fontSize: 25
    },
    listView: {
    }
})