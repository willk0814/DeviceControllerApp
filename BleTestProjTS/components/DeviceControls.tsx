import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Device } from 'react-native-ble-plx'
import { read } from 'fs'

export default function DeviceControls({ connected, disconnect, connectedDeviceName, printServices, printState, sendCommand, readData }) {
    return (
        <View style={styles.deviceControlsContainer}>
            <View style={styles.headerView}>
                <Text style={styles.titleStyle}>Device Controls</Text>
            </View>

            <View style={styles.controlView}>

                {connected ? (
                    <Text style={styles.titleStyle}>Connected to: {connectedDeviceName}</Text>
                ) : (
                        <Text>Not connected</Text>
                    )}


                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={disconnect}>
                    <Text style={styles.buttonText}>Disconnect</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={printServices}>
                    <Text style={styles.buttonText}>Print Services</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={printState}>
                    <Text style={styles.buttonText}>Print State</Text>
                </TouchableOpacity>

                <View style={{ height: 25 }}>

                </View>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand("0")}>
                    <Text style={styles.buttonText}>Operation 0</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand("1")}>
                    <Text style={styles.buttonText}>Operation 1</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand("2")}>
                    <Text style={styles.buttonText}>Operation 2</Text>
                </TouchableOpacity> */}


                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand("3")}>
                    <Text style={styles.buttonText}>Operation 3</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand('4')}>
                    <Text style={styles.buttonText}>Operation 4</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand('5')}>
                    <Text style={styles.buttonText}>Operation 5</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand('6')}>
                    <Text style={styles.buttonText}>Operation 6</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand('7')}>
                    <Text style={styles.buttonText}>Operation 7</Text>
                </TouchableOpacity> */}


                <View style={styles.rowView}>
                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.rowButton]}
                        onPress={() => sendCommand("8")}>
                        <Text style={styles.buttonText}>Send 8</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.rowButton]}
                        onPress={readData}>
                        <Text style={styles.buttonText}>Retieve data</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.rowView}>
                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.rowButton]}
                        onPress={() => sendCommand("9")}>
                        <Text style={styles.buttonText}>Send 9</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.rowButton]}
                        onPress={() => readData("9")}>
                        <Text style={styles.buttonText}>Retieve data</Text>
                    </TouchableOpacity>
                </View>


            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    deviceControlsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerView: {
        flex: 1,
        paddingTop: 20
    },
    controlView: {
        flex: 10,
        paddingBottom: 20
    },
    titleStyle: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 30,
        paddingTop: 15
    },
    buttonStyle: {
        backgroundColor: '#fff',
        width: 400,
        margin: 10
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 25
    },
    rowView: {
        flexDirection: 'row'
    },
    rowButton: {
        width: 190
    }
})
