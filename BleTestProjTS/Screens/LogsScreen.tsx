import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

import AvailableSession from '../components/AvailableSession'

export default function LogsScreen() {

    const [dataDict, setDataDict] = useState({})
    const [availableEntries, setAvailableEntries] = useState(false)

    const exportExcel = async (value) => {
        let angleArr = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5]
        const infoArray = value.split("$")
        console.log(`Info array at the beginning of exporting ${infoArray}`)
        const dateArray = infoArray[1].split(" ")

        let tmp = JSON.parse(await AsyncStorage.getItem(value))
        let tmpData = tmp.data
        let tmpSize = tmp.size

        let torsionalStiffness = findStiffness(tmpData)

        let data = [{
            "Tester Name": infoArray[3],
            "Date": dateArray[0],
            "Plant ID - Replicate Number": infoArray[0],
            "Planting Date": "",
            "Test Type": infoArray[4],
            "Torsional Stiffness": torsionalStiffness.toString(),
            "Additional Notes": ""
        },
        {},
        {
            "Tester Name": "Angle (degrees)",
            "Date": "Force (N)",
            "Plant ID - Replicate Number": "Torque (N*m)"
        }];

        for (var i in tmpData) {
            let tmp_force = parseFloat(tmpData[i]) * 9.81
            let torque = tmp_force * Math.sin((Math.PI / 2) - (angleArr[i] * Math.PI / 180)) * 0.15
            let tmp = {
                "Tester Name": angleArr[i],
                "Date": tmp_force.toString(),
                "Plant ID - Replicate Number": torque.toString()
            }
            data.push(tmp);
        }

        let ws = XLSX.utils.json_to_sheet(data);
        let wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "PlantData")
        const wbout = XLSX.write(wb, {
            type: 'base64',
            bookType: "xlsx"
        });

        const fileName = infoArray[0] + '_' + dateArray[0].replaceAll('/', '_') + '_' + dateArray[1].replaceAll(':', '_') + '.xlsx'
        const uri = FileSystem.cacheDirectory + fileName.replace(' ', '_');
        console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
        await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64
        });

        await Sharing.shareAsync(uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: "Data for Spreadsheets",
            UTI: 'com.microsoft.excel.xlsx'
        });
    }

    const findStiffness = (data) => {
        console.log(`Finding Torsional stiffness for the following data: ${data}`)

        let stiffness = 0.0
        let count = 0
        let sum = 0

        for (let i = 0; i < data.length - 1; i++) {
            if (i != data.length - 1) {
                console.log(`Sum, count before adding: ${sum}, ${count}`)
                sum += ((data[i + 1] * 9.81) - (data[i] * 9.81))
                count += 1
                console.log(`Sum, count after adding: ${sum}, ${count}`)
            }
        }
        console.log(`Average Change in Torque: ${sum / count}`)
        console.log(`Sum and Count: ${sum} and ${count}`)
        let deltaTau = sum / count
        let deltaRadians = .0087266
        stiffness = deltaTau / deltaRadians
        console.log(`Delta Tau, Delta Radians, and Stiffness: ${deltaTau}, ${deltaRadians}, ${stiffness}`)

        return stiffness
    }


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

                    {Object.entries(dataDict).map(([key, value]) => <AvailableSession keyVal={key} testData={value[0]} testSize={value[1]} exportExcel={exportExcel} />)}

                </ScrollView>
            ) : (
                    <View style={styles.listView}>
                        <Text style={[{ color: '#cddddd' }, { fontSize: 20 }]}>No logs available for viewing; if you have stored logs search for them above</Text>
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