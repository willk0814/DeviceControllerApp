import React, { useState, useReducer, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

import DeviceCard from '../components/DeviceCard';
import DeviceControls from '../components/DeviceControls'

const manager = new BleManager();

// Reducer to add only the devices which have not been added yet
// Indeed, when the bleManager searches for devices, each time it detects a ble device, it returns the ble device even if this one has already been returned
// const reducer = (
//     state: Device[],
//     action: { type: 'ADD_DEVICE'; payload: Device } | { type: 'CLEAR' },
// ): Device[] => {
//     switch (action.type) {
//         case 'ADD_DEVICE':
//             const { payload: device } = action;

//             // check if the detected device is not already added to the list
//             if (device && !state.find((dev) => dev.id === device.id)) {
//                 return [...state, device];
//             }
//             return state;
//         case 'CLEAR':
//             return [];
//         default:
//             return state;
//     }
// };

export default function ConnectionContainer({ scanForDevices, scannedDevices, connectToDevice, clearDevices, isLoading, connected, disconnectDevice }) {
    // // reducer to store and display detected ble devices
    // const [scannedDevices, dispatch] = useReducer(reducer, []);

    // // state to give the user a feedback about the manager scanning devices
    // const [isLoading, setIsLoading] = useState(false);

    // // SV to hold desired Device
    // const [connectedDevice, setConnectedDevice] = useState('')

    // const [connected, setConnected] = useState(false)

    // const scanDevices = () => {
    //     // display the Activityindicator
    //     setIsLoading(true);

    //     console.log('Scanning for Devices')

    //     // scan devices
    //     manager.startDeviceScan(null, null, (error, scannedDevice) => {
    //         if (error) {
    //             console.warn(error);
    //         }

    //         // if a device is detected add the device to the list by dispatching the action into the reducer
    //         if (scannedDevice) {
    //             dispatch({ type: 'ADD_DEVICE', payload: scannedDevice });
    //         }
    //     });

    //     // stop scanning devices after 5 seconds
    //     setTimeout(() => {
    //         manager.stopDeviceScan();
    //         setIsLoading(false);
    //     }, 5000);
    // };

    // const connectDevice = (deviceID) => {
    //     // stop the device scan while we attempt to connect
    //     manager.stopDeviceScan()

    //     manager.connectToDevice(deviceID)

    //     setConnectedDevice(deviceID)
    //     setConnected(true)
    // }

    // const disconnectDevice = () => {
    //     manager.cancelDeviceConnection(connectedDevice)
    // }

    const ListHeaderComponent = () => (
        <View style={styles.rowContainer}>
            <Button
                title='Clear Devices'
                onPress={clearDevices} />
            {
                isLoading ? (
                    <ActivityIndicator color={'teal'} size={25} />
                ) : (
                        <Button title="Scan devices" onPress={scanForDevices} />
                    )
            }
        </View>
    );


    return (
        <View style={styles.pageContainer}>
            <FlatList
                keyExtractor={(item) => item.id}
                style={styles.content}
                data={scannedDevices}
                renderItem={({ item }) => <DeviceCard device={item} handleConnect={connectToDevice} />}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={styles.content}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {

    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 15
    }
})
