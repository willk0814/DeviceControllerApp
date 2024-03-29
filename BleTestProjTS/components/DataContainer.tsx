import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import { Dropdown } from 'react-native-element-dropdown'

export default function DataContainer({ isConnected, handleDisplayConnectionPopUp, deviceName, handleTestType, handlePlantID, plantID, currentTestType }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [testOptions, setTestOptions] = useState([
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' },
        { label: 'E', value: 'E' },
        { label: 'F', value: 'F' },
        { label: 'PUSHER', value: 'Pusher' }
    ])


    const renderTestTypeOption = (item) => {
        return (
            <View>
                <Text style={styles.testTypeText}>{item.label}</Text>
            </View>
        )
    }

    return (
        <View style={styles.pageContainer}>

            <View style={styles.rowStyle}>
                <View style={styles.verticalContainer}>

                    <View style={styles.rowStyle}>
                        <Text style={styles.dataLabels}>Connected Device:</Text>
                        {isConnected ? (
                            <TouchableOpacity
                                onPress={handleDisplayConnectionPopUp}
                                style={[styles.buttonStyle, { backgroundColor: '#0362fc' }]}>
                                <Text style={styles.dataLabels}>{deviceName}</Text>
                            </TouchableOpacity>
                        ) : (
                                <TouchableOpacity
                                    onPress={handleDisplayConnectionPopUp}
                                    style={styles.buttonStyle}>
                                    <Text style={styles.dataLabels}>Show Controls</Text>
                                </TouchableOpacity>
                            )}
                    </View>

                    <View style={styles.rowStyle}>
                        <Text style={styles.dataLabels}>Plant ID:</Text>
                        <TextInput
                            style={styles.plantInputStyle}
                            placeholder='PLANT ID'
                            placeholderTextColor='#2E2F2F'
                            onChangeText={value => handlePlantID(value)}
                            value={plantID} />
                    </View>
                </View>

                <View style={styles.horizontalContainer}>
                    <Text style={styles.dataLabels}>Test Type:</Text>

                    <Dropdown
                        style={styles.pickerStyle}
                        data={testOptions}
                        placeholder="Select Test Type"
                        placeholderStyle={
                            [{ fontWeight: '400' },
                            { fontSize: 25 }]
                        }
                        labelStyle={
                            [{ fontWeight: '400' },
                            { fontSize: 30 }]
                        }
                        labelField="label"
                        valueField="value"
                        label={value}
                        value={currentTestType}
                        onChange={(item) => handleTestType(item.value)}
                        renderItem={(item) => renderTestTypeOption(item)}
                    />

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        paddingTop: 25,
        minHeight: '5%'
    },
    titleStyle: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#cddddd'
    },
    rowStyle: {
        flexDirection: 'row',
        paddingBottom: 25,
        minHeight: 60
    },
    dataLabels: {
        color: '#cddddd',
        fontSize: 25,
        paddingHorizontal: 12.5,
    },
    plantInputStyle: {
        backgroundColor: '#cddddd',
        marginLeft: 25,
        width: 150,
        fontSize: 25
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        borderRadius: 10,
        width: 230
    },
    verticalContainer: {
        flexDirection: 'column'
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
    },
    pickerStyle: {
        backgroundColor: 'white',
        // borderBottomColor: 'gray',
        // borderBottomWidth: 0.5,
        // backgroundColor: '#2E2F2F',
        marginLeft: 0,
        width: 200
    },
    testTypeText: {
        fontSize: 25,
        fontWeight: '400',
        color: '#2E2F2F',
        marginLeft: 10
    }
})
