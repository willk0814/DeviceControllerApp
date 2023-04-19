import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { RFPercentage } from "react-native-responsive-fontsize";

import { Dropdown } from 'react-native-element-dropdown'

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

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
        { label: 'Pusher', value: 'Pusher' }
    ])
    const [qrData, setQRdata] = useState('')


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
                        <Text style={[styles.dataLabels, { maxWidth: "40%"}]}>Connected Device: </Text>
                        {isConnected ? (
                            <TouchableOpacity
                                onPress={handleDisplayConnectionPopUp}
                                style={[styles.buttonStyle, { backgroundColor: '#0362fc' }]}>
                                <Text style={[styles.dataLabels, { fontSize: RFPercentage(1.8) }]}>{deviceName}</Text>
                            </TouchableOpacity>
                        ) : (
                                <TouchableOpacity
                                    onPress={handleDisplayConnectionPopUp}
                                    style={styles.buttonStyle}>
                                    <Text style={[styles.dataLabels, { maxWidth: "100%"}]}>Show Controls</Text>
                                </TouchableOpacity>
                            )}
                    </View>

                    <View style={styles.rowStyle}>
                        <Text style={[styles.dataLabels, { maxWidth: "40%"}]}>Plant ID:</Text>
                        <TextInput
                            style={styles.plantInputStyle}
                            placeholder='PLANT ID'
                            placeholderTextColor='#2E2F2F'
                            onChangeText={value => handlePlantID(value)}
                            value={plantID} />
                    </View>

                    <View style={styles.rowStyle}>
                        <Text style={[styles.dataLabels, { maxWidth: "40%"}]}>QR Scanner:   </Text>
                        <TouchableOpacity
                            style={styles.buttonStyle}>
                            <Text style={[styles.dataLabels, { maxWidth: "100%"}]}>Scan QR Code</Text>
                        </TouchableOpacity>
                    </View>

                    <QRCodeScanner
                        onRead={({data}) => alert(data)}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        reactivate={true}
                        reactivateTimeout={3000}
                        showMarker={true}
                    />

                </View>

                <View style={styles.horizontalContainer}>
                    <Text style={styles.dataLabels}>Test Type: </Text>

                    <Dropdown
                        style={styles.pickerStyle}
                        data={testOptions}
                        placeholder="Select Test Type"
                        placeholderStyle={
                            [{ fontWeight: '400' },
                            { fontSize: RFPercentage(1.7) }] // 25
                        }
                        /*labelStyle={
                            [{ fontWeight: '400' },
                            { fontSize: 30 }]
                        }*/
                        labelField="label"
                        valueField="value"
                        //label={value}
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
        flex: 0, // 1
        paddingTop: 25,
        minHeight: '5%',
        //paddingRight: "25%"
    },
    titleStyle: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#cddddd'
    },
    rowStyle: {
        flexDirection: 'row',
        paddingBottom: 25,
        paddingLeft: 0,
        paddingRight: 0,
        //paddingHorizontal: "0%",
        minHeight: 60,
        maxWidth: "95%"
    },
    dataLabels: {
        color: '#cddddd',
        fontSize: RFPercentage(2.1), // 25
        paddingHorizontal: 0, // 12.5
        //maxWidth: "35%"
    },
    plantInputStyle: {
        backgroundColor: '#cddddd',
        marginLeft: 25,
        width: "55%", // 150
        fontSize: RFPercentage(2.1) // 25
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        borderRadius: 10,
        width: "55%", // 230
        alignItems: 'center',
    },
    verticalContainer: {
        flexDirection: 'column',
        maxWidth: "70%"
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 0, // 20
        //fontSize: RFPercentage(2.1)
    },
    pickerStyle: {
        backgroundColor: 'white',
        // borderBottomColor: 'gray',
        // borderBottomWidth: 0.5,
        // backgroundColor: '#2E2F2F',
        //fontSize: RFPercentage(2.8),
        marginLeft: 0,
        width: "35%" // 200
    },
    testTypeText: {
        fontSize: RFPercentage(2.5), // 25
        fontWeight: '400',
        color: '#2E2F2F',
        marginLeft: 5
    }
})
