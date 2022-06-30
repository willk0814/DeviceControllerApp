import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import DeviceCard from '../components/DeviceCard'
import { Device } from 'react-native-ble-plx'

export default function ConnectionPopUp({ scannedDevices, scanDevices, selectDevice, desiredDevice, clearScannedDevices, handleConnect, handleDisconnect, handleHideConnectionPopUp, isConnected, connectedDevice }) {
    return (
        <View>
            <View style={styles.pageContainer}>
                <View style={styles.rowStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={scanDevices}
                        disabled={isConnected}>
                        <Text style={styles.buttonText}>Scan for Devices</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.redButton]}
                        onPress={clearScannedDevices}
                        disabled={isConnected}>
                        <Text style={styles.buttonText}>Clear Scan</Text>
                    </TouchableOpacity>
                </View>

                {isConnected ? (
                    <Text style={styles.deviceText}>{connectedDevice}</Text>
                ) : (
                        <FlatList
                            keyExtractor={(item) => item.id}
                            data={scannedDevices}
                            style={styles.listStyle}
                            renderItem={({ item }) =>
                                <DeviceCard
                                    device={item}
                                    handleSelect={selectDevice}
                                    desiredDevice={desiredDevice} />} />

                    )}


                <View style={styles.rowStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={handleConnect}
                        disabled={isConnected}>
                        <Text style={styles.buttonText}>Connect</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.redButton]}
                        onPress={handleDisconnect}
                        disabled={!isConnected}>
                        <Text style={styles.buttonText}>Disconnect</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.buttonStyle, { width: 500 }]}
                    onPress={handleHideConnectionPopUp}>
                    <Text style={styles.buttonText}>Hide Pop Up</Text>
                </TouchableOpacity>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center'
    },
    rowStyle: {
        flexDirection: 'row'
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        borderRadius: 10,
        margin: 5,
        width: 250,
        paddingHorizontal: 25
    },
    redButton: {
        backgroundColor: 'red'
    },
    buttonText: {
        color: '#cddddd',
        fontSize: 25,
        textAlign: 'center'
    },
    listStyle: {
        maxHeight: 300,
        overflow: 'scroll',
        flexGrow: 0
    },
    deviceText: {
        color: '#cddddd',
        fontSize: 20
    }
})
