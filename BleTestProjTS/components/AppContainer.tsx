import React, { useEffect, useState, useReducer } from 'react'
import { View, Text, StyleSheet, SafeAreaViewComponent } from 'react-native'
import { BleManager, Device, Service, Characteristic, Descriptor } from 'react-native-ble-plx'
import base64 from 'react-native-base64'

// Page imports
import DeviceControls from '../components/DeviceControls'
import ConnectionContainer from '../components/ConnectionContainer'

const ble = new BleManager();

// Declared UUIDS for services and Characteristics:
// Communication Service UUID
const COMM_SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb';

// Command Characteristic 
const CMD_CHAR_UUID = '00006789-0000-1000-8000-00805f9b34fb';

// Data Characteristic 1
const DATA_CHAR_1_UUID = '00002345-0000-1000-8000-00805f9b34fb';

// Data Characteristic 2
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

export default function AppContainer() {
    // Scanned devices to be modified by reducer
    const [scannedDevices, dispatch] = useReducer(reducer, [])

    // Device Connection SV's
    const [connected, setConnected] = useState(false)
    const [connectedDevice, setConnectedDevice] = useState()
    const [connectedDeviceObj, setConnectedDeviceObj] = useState<Device>()
    const [connectedDeviceName, setConnectedDeviceName] = useState('')

    // SV's connected Device Services and Characteristics
    const [services, setServices] = useState<Service[]>([])
    const [descriptors, setDescriptors] = useState<Descriptor[]>([])
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([])

    const [servicesMap, setServicesMap] = useState({})

    // Progress SV's
    const [isLoading, setIsLoading] = useState(false)

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

    const disconnectDevice = () => {
        ble.cancelDeviceConnection(connectedDevice)

        setConnected(false)
        setConnectedDevice('')
        setServices([])

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

    // console.log('Characteristics')
    // console.log(characteristics)





    const testBleState = async () => {
        console.log('BLE state: ', await ble.state())
        console.log('Connected? ', await ble.isDeviceConnected(connectedDevice))
    }


    const connectDevice = async (device) => {
        console.log(`Connectiong device with Name, ID: ${device.name}, ${device.id}`)

        ble.connectToDevice(device.id).then(async device => {
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

    // function to send a number 0 - 8 to the SMURF in order to execute the corresponding characteristic
    const sendOperationCode = async (operationCode: string) => {
        console.log(`Sending operation Code: ${operationCode}`)
        await connectedDeviceObj.writeCharacteristicWithResponseForService(
            COMM_SERVICE_UUID,
            CMD_CHAR_UUID,
            base64.encode(operationCode)
        )
        // if the operation is a test that yields data, then retrieve the data after the correct amount of time
        // if (operationCode == "1") {
        //     setTimeout(() => {
        //         readData(1)
        //     }, 8000)
        // } else if (operationCode == "2") {
        //     setTimeout(() => {
        //         readData(2)
        //     }, 16000)
        // }
    }

    // function to read the returned data from the SMURF 
    const readData = async (testType) => {

        console.log(`Retrieving data from Operation:  ${testType}`)
        let data = undefined
        let data_1 = undefined

        if (testType == "8") {
            console.log('Reached')
            await connectedDeviceObj.readCharacteristicForService(COMM_SERVICE_UUID, DATA_CHAR_1_UUID).then(async () => {

            })
            console.log('Printing data for small flex test')
            console.log(data)
        } else if (testType == "9") {
            data = await connectedDeviceObj.readCharacteristicForService(COMM_SERVICE_UUID, DATA_CHAR_1_UUID)


            data_1 = connectedDeviceObj.readCharacteristicForService(COMM_SERVICE_UUID, DATA_CHAR_2_UUID)

            console.log('Printing data for small large test')
            console.log(data)
            console.log(data_1)
        }
        console.log(data)
    }


    const readSmallData = async () => {
        const data = await connectedDeviceObj.readCharacteristicForService(
            COMM_SERVICE_UUID,
            DATA_CHAR_1_UUID)

        console.log(base64.decode(data.value))
    }

    useEffect(() => {
        return () => {
            ble.destroy();
        }
    }, [])

    return (
        <View style={styles.pageContainer}>
            <ConnectionContainer
                scanForDevices={scanDevices}
                scannedDevices={scannedDevices}
                connectToDevice={connectDevice}
                clearDevices={clearScannedDevices}
                isLoading={isLoading}
                connected={connected}
                disconnectDevice={disconnectDevice} />
            <DeviceControls
                connected={connected}
                disconnect={disconnectDevice}
                connectedDeviceName={connectedDeviceName}
                printServices={printServices}
                printState={testBleState}
                sendCommand={sendOperationCode}
                readData={readSmallData} />
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flexDirection: 'row',
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
})