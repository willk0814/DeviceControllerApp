import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

export default function DataContainer({ isConnected, handleDisplayConnectionPopUp, deviceName }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [testOptions, setTestOptions] = useState([
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' },
        { label: 'E', value: 'E' },
        { label: 'F', value: 'F' },
    ])

    return (
        <View style={styles.pageContainer}>

            <View style={styles.rowStyle}>
                <View style={styles.verticalContainer}>

                    <View style={styles.rowStyle}>
                        <Text style={styles.dataLabels}>Connected Device:</Text>
                        {isConnected ? (
                            <TouchableOpacity
                                onPress={handleDisplayConnectionPopUp}
                                style={styles.buttonStyle}>
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
                            placeholderTextColor='#2E2F2F' />
                    </View>
                </View>

                <View style={styles.horizontalContainer}>
                    <Text style={styles.dataLabels}>Test Type:</Text>
                    <DropDownPicker
                        open={open}
                        items={testOptions}
                        value={value}
                        setOpen={setOpen}
                        setValue={setValue}
                        style={styles.testSelector}
                        textStyle={styles.pickerTextStyle}
                        containerStyle={styles.labelStyle}
                        autoScroll={true}
                        maxHeight={100}
                        zIndex={1} />
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        paddingTop: 25,
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
    testSelector: {
        width: 200,
        flexDirection: 'column',
    },
    pickerTextStyle: {
        fontSize: 25
    },
    labelStyle: {
        width: 200,
    },
    verticalContainer: {
        flexDirection: 'column'
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20
    },
    pageBreak: {
        width: '95%',
        height: 50
    }
})
