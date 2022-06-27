import React, { useEffect, useState, useReducer } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import { BleManager, Device, Service, Characteristic, Descriptor } from 'react-native-ble-plx'
import base64 from 'react-native-base64'

// Page imports
import DeviceControls from '../components/DeviceControls'
import ConnectionContainer from '../components/ConnectionContainer'
import ConnectionPopUp from '../components/ConnectionPopUp'

import DataContainer from '../components/DataContainer'
import ControlsContainer from '../components/ControlsContainer'
import OutputContainer from '../components/OutputContainer'

const ble = new BleManager();

// Declared UUIDS for services and Characteristics:
// Communication Service UUID
const COMM_SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb';
const CMD_CHAR_UUID = '00006789-0000-1000-8000-00805f9b34fb';
const DATA_CHAR_1_UUID = '00002345-0000-1000-8000-00805f9b34fb';
const DATA_CHAR_2_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';

// The goal of this component is to house the majority of state vars that way they can be distributed as we need

// Reducer to check each scanned device before adding it to the list - ble scan may return the same device more than once
const reducer = (
    state: Device[],
    action: { type: 'ADD_DEVICE'; payload: Device } | { type: 'CLEAR' },
): Device[] => {
    switch (action.type) {
        case 'ADD_DEVICE':
            const { payload: device } = action;

            // check if the detected device is not already added to the list
            if (device && !state.find((dev) => dev.id === device.id)) {
                return [...state, device];
            }
            return state;
        case 'CLEAR':
            return [];
        default:
            return state;
    }
};

const TestingScreen = () => {
    // Scanned devices to be modified by reducer
    const [scannedDevices, dispatch] = useReducer(reducer, [])

    // Device Connection SV's
    const [connected, setConnected] = useState(false)
    const [connectedDevice, setConnectedDevice] = useState()
    const [connectedDeviceObj, setConnectedDeviceObj] = useState<Device>()
    const [desiredDevice, setDesiredDevice] = useState<Device>()
    const [connectedDeviceName, setConnectedDeviceName] = useState('')

    // SV's connected Device Services and Characteristics
    const [services, setServices] = useState<Service[]>([])
    const [descriptors, setDescriptors] = useState<Descriptor[]>([])
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([])

    const [servicesMap, setServicesMap] = useState({})

    // Progress SV's
    const [isLoading, setIsLoading] = useState(false)
    const [displayConnectionPopUp, setDisplayConnectionPopUp] = useState(true)

    const scanDevices = () => {
        setIsLoading(true)
        console.log('Scanning for Devices')

        ble.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error) {
                console.warn(error);
            }
            // For each device that is connected dispatch it to reducer to see if it is already contained
            if (scannedDevice) {
                dispatch({ type: 'ADD_DEVICE', payload: scannedDevice })
            }
        })
        // stop scanning for devices after 5 seconds
        setTimeout(() => {
            ble.stopDeviceScan()
            setIsLoading(false);
        }, 5000);
    }

    const clearScannedDevices = () => {
        dispatch({ type: 'CLEAR' })
    }

    const printServices = () => {
        console.log('Services')
        console.log(services)

        console.log('Services Map')
        for (let ser of services) {
            let tmpUUID = ser.uuid
            // if (serviceMap[tmpUUID].characteristicsCount == 1) {
            console.log(`Service UUID: ${servicesMap[tmpUUID].uuid}`)
            console.log(`Is Primary? ${servicesMap[tmpUUID].isPrimary}`)
            console.log(`Characteristic Count: ${servicesMap[tmpUUID].characteristicsCount}`)
            console.log('--- Characteristic Map ---')
            // console.log(serviceMap[tmpUUID].characteristics)

            let characteristics = servicesMap[tmpUUID].characteristics
            for (let char in characteristics) {
                console.log(char, ': ', characteristics[char])
            }
        }
    }

    const connectDevice = async () => {
        console.log(`Connectiong device with Name, ID: ${desiredDevice.name}, ${desiredDevice.id}`)

        ble.connectToDevice(desiredDevice.id).then(async device => {
            setConnected(true)
            setConnectedDevice(device.id)
            setConnectedDeviceObj(device)
            setConnectedDeviceName(device.name)
            await device.discoverAllServicesAndCharacteristics()
            const services = await device.services()

            let tmpServiceMap = {}
            for (let service of services) {
                let characteristic_map = {}
                let characteristics = await service.characteristics()

                for (let characteristic of characteristics) {
                    characteristic_map[characteristic.uuid] = {
                        uuid: characteristic.uuid,
                        isReadable: characteristic.isReadable,
                        isWritableWithResponse: characteristic.isWritableWithResponse,
                        isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
                        isNotifiable: characteristic.isNotifiable,
                        isNotifying: characteristic.isNotifying,
                        value: characteristic.value
                    }

                    tmpServiceMap[service.uuid] = {
                        uuid: service.uuid,
                        isPrimary: service.isPrimary,
                        characteristicsCount: characteristics.length,
                        characteristics: characteristic_map
                    }
                }
            }
            setServicesMap(tmpServiceMap)
            setServices(services)

        })
    }

    const disconnectDevice = () => {
        ble.cancelDeviceConnection(connectedDevice)

        setConnected(false)
        setConnectedDevice('')
        setServices([])

    }

    // function to send a number 0 - 8 to the SMURF in order to execute the corresponding characteristic
    const sendOperationCode = async (operationCode: string) => {
        console.log(`Sending operation Code: ${operationCode}`)
        await connectedDeviceObj.writeCharacteristicWithResponseForService(
            COMM_SERVICE_UUID,
            CMD_CHAR_UUID,
            base64.encode(operationCode)
        )
    }

    const readSmallData = async () => {
        const data = await connectedDeviceObj.readCharacteristicForService(
            COMM_SERVICE_UUID,
            DATA_CHAR_1_UUID)

        console.log(base64.decode(data.value))
    }

    const readLargeData = async () => {
        const data_1 = await connectedDeviceObj.readCharacteristicForService(
            COMM_SERVICE_UUID, DATA_CHAR_1_UUID)
        const data_2 = await connectedDeviceObj.readCharacteristicForService(
            COMM_SERVICE_UUID, DATA_CHAR_2_UUID)

        console.log(base64.decode(data_1.value) + base64.decode(data_2.value))
    }

    const handleSelectDesiredDevice = (device: Device) => {
        setDesiredDevice(device)
    }

    const hideConnectionPopUp = () => {
        setDisplayConnectionPopUp(false)
    }

    const showConnectionPopUp = () => {
        setDisplayConnectionPopUp(true)
    }

    useEffect(() => {
        return () => {
            ble.destroy();
        }
    }, [])

    return (
        <View style={styles.pageContainer}>
            <Modal
                transparent={true}
                visible={displayConnectionPopUp}
                animationType='slide'>
                <View style={styles.popUpStyle}>
                    <ConnectionPopUp
                        scannedDevices={scannedDevices}
                        scanDevices={scanDevices}
                        selectDevice={handleSelectDesiredDevice}
                        desiredDevice={desiredDevice}
                        clearScannedDevices={clearScannedDevices}
                        handleConnect={connectDevice}
                        handleDisconnect={disconnectDevice}
                        handleHideConnectionPopUp={hideConnectionPopUp}
                        printServices={printServices} />
                </View>

            </Modal>
            <DataContainer
                isConnected={connected}
                handleDisplayConnectionPopUp={showConnectionPopUp}
                deviceName={connectedDeviceName} />
            <ControlsContainer
                isConnected={connected}
                sendOperationCode={sendOperationCode}
                handleRequestSmallData={readSmallData}
                handleRequestLargeData={readLargeData} />
            <OutputContainer />
        </View>
    )
}

export default TestingScreen

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E2F2F'
    },
    popUpStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})