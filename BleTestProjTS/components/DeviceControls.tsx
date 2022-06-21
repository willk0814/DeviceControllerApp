import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Device } from 'react-native-ble-plx'

export default function DeviceControls({ connected, disconnect, connectedDevice, printServices, printState, sendCommand }) {
    return (
        <View style={styles.deviceControlsContainer}>
            <View style={styles.headerView}>
                <Text style={styles.titleStyle}>Device Controls</Text>
            </View>

            <View style={styles.controlView}>
                <Text style={styles.titleStyle}>{connectedDevice}</Text>
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

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand("2")}>
                    <Text style={styles.buttonText}>Operation 2</Text>
                </TouchableOpacity>


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

                <TouchableOpacity
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
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand("8")}>
                    <Text style={styles.buttonText}>Operation 8</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => sendCommand("9")}>
                    <Text style={styles.buttonText}>Operation 9</Text>
                </TouchableOpacity>


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
        paddingTop: 10
    },
    controlView: {
        flex: 7
    },
    titleStyle: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 30,
        paddingTop: 15
    },
    buttonStyle: {
        backgroundColor: '#fff',
        width: 300,
        margin: 10
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 25
    }
})
