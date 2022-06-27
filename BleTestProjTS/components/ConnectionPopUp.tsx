import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import DeviceCard from '../components/DeviceCard'

export default function ConnectionPopUp({ scannedDevices, scanDevices, selectDevice, desiredDevice, clearScannedDevices, handleConnect, handleDisconnect, handleHideConnectionPopUp, printServices }) {
    return (
        <View>
            <View style={styles.pageContainer}>
                <View style={styles.rowStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={scanDevices}>
                        <Text style={styles.buttonText}>Scan for Devices</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.redButton]}
                        onPress={clearScannedDevices}>
                        <Text style={styles.buttonText}>Clear Scan</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    keyExtractor={(item) => item.id}
                    data={scannedDevices}
                    style={styles.listStyle}
                    renderItem={({ item }) =>
                        <DeviceCard
                            device={item}
                            handleSelect={selectDevice}
                            desiredDevice={desiredDevice} />} />

                <View style={styles.rowStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={handleConnect}>
                        <Text style={styles.buttonText}>Connect</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.redButton]}
                        onPress={handleDisconnect}>
                        <Text style={styles.buttonText}>Disconnect</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={handleHideConnectionPopUp}>
                    <Text style={styles.buttonText}>Hide Pop Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={printServices}>
                    <Text style={styles.buttonText}>Print Services</Text>
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
        borderRadius: 6,
        elevation: 10,
        margin: 10,
        paddingHorizontal: 25
    },
    redButton: {
        backgroundColor: 'red'
    },
    buttonText: {
        color: '#cddddd',
        fontSize: 20,
        textAlign: 'center'
    },
    listStyle: {
        maxHeight: 300,
        overflow: 'scroll',
        flexGrow: 0
    }
})
