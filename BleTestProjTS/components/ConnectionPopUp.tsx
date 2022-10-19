import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ViewBase } from 'react-native'
import DeviceCard from '../components/DeviceCard'
import { Device } from 'react-native-ble-plx'
import { RFPercentage } from "react-native-responsive-fontsize";

export default function ConnectionPopUp({ scannedDevices, scanDevices, selectDevice, desiredDevice, clearScannedDevices, handleConnect, handleDisconnect, handleHideConnectionPopUp, isConnected, connectedDevice, smurfSelected, selectSMURF, selectPUSHER }) {
    return (
        <View>
            <View style={styles.pageContainer}>
                <View>
                    <Text style={styles.buttonText}>I am connecting a:</Text>
                    <View style={styles.rowStyle}>
                        <TouchableOpacity
                            // disabled={isConnected}
                            style={smurfSelected ? styles.buttonStyle : [styles.buttonStyle, styles.disabledButton]}
                            onPress={selectSMURF}>
                            <Text style={styles.buttonText}>SMURF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            // disabled={isConnected}
                            style={!smurfSelected ? styles.buttonStyle : [styles.buttonStyle, styles.disabledButton]}
                            onPress={selectPUSHER}>
                            <Text style={styles.buttonText}>Plant Pusher</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.pageBreak}>

                </View>
                <View style={styles.rowStyle}>
                    <TouchableOpacity
                        style={isConnected ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                        onPress={scanDevices}
                        disabled={isConnected}>
                        <Text style={styles.buttonText}>Scan for Devices</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={isConnected ? [styles.buttonStyle, styles.disabledButton] : [styles.buttonStyle, styles.redButton]}
                        onPress={clearScannedDevices}
                        disabled={isConnected}>
                        <Text style={styles.buttonText}>Clear Scan</Text>
                    </TouchableOpacity>
                </View>

                {isConnected ? (
                    <Text style={styles.buttonText}>{connectedDevice}</Text>
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
                        style={isConnected ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                        onPress={handleConnect}
                        disabled={isConnected}>
                        <Text style={styles.buttonText}>Connect</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={!isConnected ? [styles.buttonStyle, styles.disabledButton] : [styles.buttonStyle, styles.redButton]}
                        onPress={handleDisconnect}
                        disabled={!isConnected}>
                        <Text style={styles.buttonText}>Disconnect</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.buttonStyle, { width: "81.5%" }]} // 500
                    onPress={handleHideConnectionPopUp}>
                    <Text style={styles.buttonText}>Hide Pop Up</Text>
                </TouchableOpacity>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        maxWidth: "95%", // 85%,
        maxHeight: 500,
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 0, // 5
        alignItems: 'center'
    },
    rowStyle: {
        flexDirection: 'row',
        alignSelf: "center"
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        borderRadius: 10,
        margin: 5,
        width: "40%", // 250,
        paddingHorizontal: 0, // 25
    },
    redButton: {
        backgroundColor: 'red'
    },
    buttonText: {
        color: '#cddddd',
        fontSize: RFPercentage(1.8), // 25
        textAlign: 'center',
        
    },
    listStyle: {
        maxHeight: 300,
        overflow: 'scroll',
        flexGrow: 0
    },
    deviceText: {
        color: '#cddddd',
        fontSize: 20
    },
    disabledButton: {
        backgroundColor: 'grey'
    },
    pageBreak: {
        width: '81.5%', // 98%
        marginVertical: 5,
        backgroundColor: '#cddddd',
        height: 10,
        borderRadius: 10
    }
})
