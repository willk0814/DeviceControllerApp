import React, { useEffect, useState, useReducer } from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import { BleManager, Device, Service, Characteristic, Descriptor } from 'react-native-ble-plx'
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage';

import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

// Page imports
import ConnectionPopUp from '../components/ConnectionPopUp'
import DataContainer from '../components/DataContainer'
import ControlsContainer from '../components/ControlsContainer'
import OutputContainer from '../components/OutputContainer'

const ble = new BleManager();

// BLE UUIDs
// --- SMURF ---
const SMURF_COMM_SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb';
const CMD_CHAR_UUID = '00006789-0000-1000-8000-00805f9b34fb';
const SMURF_DATA_CHAR_1_UUID = '00002345-0000-1000-8000-00805f9b34fb';
const SMURF_DATA_CHAR_2_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';

// --- PUSHER ---
const PUSHER_COMM_SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb';
const PUSHER_DATA_CHAR_1_UUID = '00002345-0000-1000-8000-00805f9b34fb';
const PUSHER_DATA_CHAR_2_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';
const PUSHER_DATA_CHAR_3_UUID = '00002345-0000-1000-8000-00805f9b34fb';
const PUSHER_DATA_CHAR_4_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';
const PUSHER_DATA_CHAR_5_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';


// Reducer to check each scanned device before adding it to the list - ble scan may return the same device more than once
const reducer = (
    state: Device[],
    action: { type: 'ADD_DEVICE'; payload: Device } | { type: 'CLEAR' },
): Device[] => {
    switch (action.type) {
        case 'ADD_DEVICE':
            const { payload: device } = action;

            // check if the detected device is not already added to the list
            if (device.name != null && device && !state.find((dev) => dev.id === device.id)) {
                return [...state, device];
            }
            return state;
        case 'CLEAR':
            return [];
        default:
            return state;
    }
};

const TestingScreen = ({ researcherID }) => {
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
    const [smurfSelected, setSmurfSelected] = useState(true)

    // Progress SV's
    const [isLoading, setIsLoading] = useState(false)
    const [displayConnectionPopUp, setDisplayConnectionPopUp] = useState(true)

    // current Test SV's
    const [currentTestData, setCurrentTestData] = useState({
        size: 'small',
        data: [0.0, 0.0, 0.0, 0.0],
    })
    const [currentTestType, setCurrentTestType] = useState('')
    const [currentTestPlant, setCurrentTestPlant] = useState('')

    // SV's for Run and Button logic
    const [readyToRun, setReadyToRun] = useState(false)
    const [readyToMove, setReadyToMove] = useState(false)
    const [calibrated, setCalibrated] = useState(false)
    const [storedInitHeight, setStoredInitHeight] = useState(false)
    const [readyToAccept, setReadyToAccept] = useState(false)
    const [runningCommand, setRunningCommand] = useState(false)

    // SVs for Progress Bar logic
    const [isCalibrating, setIsCalibrating] = useState(false)
    const [calibrateStatus, setCalibrateStatus] = useState(0)

    const [isGettingHeight, setIsGettingHeight] = useState(false)
    const [gettingHeightStatus, setGettingHeightStatus] = useState()

    const [isMovingToHome, setIsMovingToHome] = useState(false)
    const [movingHomeStatus, setMovingHomeStatus] = useState(0)

    const [runningSmallTest, setRunningSmallTest] = useState(false)
    const [runningLargeTest, setRunningLargeTest] = useState(false)

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
        setCalibrated(false)

    }

    // function to send a number 0 - 8 to the SMURF in order to execute the corresponding characteristic
    const sendOperationCode = async (operationCode: string) => {
        console.log(`Sending operation Code: ${operationCode}`)
        await connectedDeviceObj.writeCharacteristicWithResponseForService(
            SMURF_COMM_SERVICE_UUID,
            CMD_CHAR_UUID,
            base64.encode(operationCode)
        )

        if (operationCode == "0") {
            setIsCalibrating(true)
            setRunningCommand(true)
            setTimeout(() => {
                setIsCalibrating(false)
                setCalibrated(true)
                setStoredInitHeight(false)
                setRunningCommand(false)
            }, 14000)
        } else if (operationCode == "1") {
            setIsGettingHeight(true)
            setRunningCommand(true)
            setTimeout(() => {
                setStoredInitHeight(true)
                setIsGettingHeight(false)
                setRunningCommand(false)
            }, 14000)
        } else if (operationCode == "2") {
            // A very hacky fix
            await connectedDeviceObj.writeCharacteristicWithResponseForService(
                SMURF_COMM_SERVICE_UUID,
                CMD_CHAR_UUID,
                base64.encode("2")
            )
            setStoredInitHeight(false)
            setIsMovingToHome(true)
            setRunningCommand(true)
            setTimeout(() => {
                setRunningCommand(false)
                setIsMovingToHome(false)
            }, 14000)
        } else if (operationCode == "8") {
            setReadyToRun(false)
            setRunningCommand(true)
            setRunningSmallTest(true)
            setReadyToMove(false)
            setTimeout(() => {
                readSmallData()
                setRunningCommand(false)
                setRunningSmallTest(false)
            }, 11000)
        } else if (operationCode == "9") {
            setReadyToRun(false)
            setRunningCommand(true)
            setRunningLargeTest(true)
            setReadyToMove(false)
            setTimeout(() => {
                setRunningCommand(false)
                setRunningLargeTest(false)
                readLargeData()
            }, 17000)
        }
    }

    // ##### IMPORTANT ##### - tests currently aren't working
    // The below to functions have a test written in that creates random input rather than pulling from the connected Device, toggle the comments to change the input source
    const readSmallData = async () => {
        // ### COMMENT THIS IN TO READ FROM DEVICE ###
        const data = await connectedDeviceObj.readCharacteristicForService(
            SMURF_COMM_SERVICE_UUID,
            SMURF_DATA_CHAR_1_UUID)

        let final_data = base64.decode(data.value).split(",")
        // #######

        // ### COMMENT THIS OUT ###
        // const final_data = generateTestString('small').split(',')
        // ######
        parseData(final_data, 'small')
        setReadyToAccept(true)
    }

    const readLargeData = async () => {
        // ### COMMENT THIS IN TO READ FROM DEVICE ###
        const data_1 = await connectedDeviceObj.readCharacteristicForService(
            SMURF_COMM_SERVICE_UUID, SMURF_DATA_CHAR_1_UUID)
        const data_2 = await connectedDeviceObj.readCharacteristicForService(
            SMURF_COMM_SERVICE_UUID, SMURF_DATA_CHAR_2_UUID)

        let tmp_data_1 = base64.decode(data_1.value).split(",")
        // console.log(`Data Char 1 len: ${tmp_data_1.length}`)
        if (tmp_data_1.length == 5) {
            tmp_data_1.pop()
        }
        // console.log(`Adjusted length: ${tmp_data_1.length}`)
        // console.log(`Data Char 1: ${tmp_data_1}`)
        let tmp_data_2 = base64.decode(data_2.value).split(",")
        // console.log(`Data Char 2: ${tmp_data_2}`)

        const final_data = tmp_data_1.concat(tmp_data_2)
        console.log(`Large Flex Test Data: ${final_data}`)

        // #######
        // ### COMMENT THIS OUT ###
        // const final_data = generateTestString('large').split(",")
        // ######
        parseData(final_data, 'large')
        setReadyToAccept(true)
    }

    const parseData = (arr, type: string) => {
        // arr.pop()
        let final_arr = arr.map(Number)
        console.log(`Parsed Data: ${final_arr}`)
        setCurrentTestData({ size: type, data: final_arr })
    }

    const generateTestString = (size) => {
        let tmpString = ''
        let randomVal = Math.floor(Math.random() * 3 + 1)

        if (size == 'large') {
            if (randomVal == 1) {
                tmpString = "2.25, 3.27, 5.16, 4.82, 7.12, 6.35, 9.15, 1.36"
            } else if (randomVal == 2) {
                tmpString = "4.25, 5.27, 7.16, 3.82, 1.12, 9.35, 0.15, 2.36"
            } else {
                tmpString = "1.25, 9.27, 1.16, 2.82, 6.12, 1.35, 12.15, 0.36"
            }
        } else if (size == 'small') {
            if (randomVal == 1) {
                tmpString = "2.25, 3.27, 5.16, 4.82"
            } else if (randomVal == 2) {
                tmpString = "4.25, 5.27, 7.16, 3.82"
            } else {
                tmpString = "1.25, 9.27, 1.16, 2.82"
            }
        }
        return tmpString
    }

    const retrievePusherData = async () => {
        // read data from all 5 characteristics
        const data_1 = await connectedDeviceObj.readCharacteristicForService(
            PUSHER_COMM_SERVICE_UUID, PUSHER_DATA_CHAR_1_UUID)
        const data_2 = await connectedDeviceObj.readCharacteristicForService(
            PUSHER_COMM_SERVICE_UUID, PUSHER_DATA_CHAR_2_UUID)
        const data_3 = await connectedDeviceObj.readCharacteristicForService(
            PUSHER_COMM_SERVICE_UUID, PUSHER_DATA_CHAR_3_UUID)
        const data_4 = await connectedDeviceObj.readCharacteristicForService(
            PUSHER_COMM_SERVICE_UUID, PUSHER_DATA_CHAR_4_UUID)
        const data_5 = await connectedDeviceObj.readCharacteristicForService(
            PUSHER_COMM_SERVICE_UUID, PUSHER_DATA_CHAR_5_UUID)


        let final_data = base64.decode(data_1.value) + base64.decode(data_2.value) + base64.decode(data_3.value) + base64.decode(data_4.value) + base64.decode(data_5.value)

        console.log(final_data.split(','))

    }

    // To be called on run, generate key for test that stores all meta data
    const generateKey = () => {
        let tmpKey = ''
        let date = generateTime()
        let plant = currentTestPlant
        let typeChar = currentTestType
        let device = connectedDeviceName
        let researcher = researcherID
        tmpKey = `${plant}$${date}$${device}$${researcher}$${typeChar}`
        return tmpKey

    }

    const generateTime = () => {
        // create the date value
        let date = new Date();
        let day = String(date.getDate()).padStart(2, '0');;
        let month = String(date.getMonth() + 1).padStart(2, '0');;
        let year = date.getFullYear();;
        let hours = String(date.getHours()).padStart(2, '0');;
        let min = String(date.getMinutes()).padStart(2, '0');;
        let sec = String(date.getSeconds()).padStart(2, '0');;
        let dateVal = `${month} / ${day} / ${year} ${hours}: ${min}: ${sec}`;
        return dateVal
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

    const setTestType = (value) => {
        setCurrentTestType(value)
        if (currentTestPlant != '') {
            setReadyToRun(true)
        }
    }

    const setPlantID = (value) => {
        setCurrentTestPlant(value)
        if (currentTestType != '') {
            setReadyToRun(true)
        }
    }


    const handleAccept = async () => {
        let key = generateKey()
        let currentSessions = null
        try {
            currentSessions = JSON.parse(await AsyncStorage.getItem('sessions'))
        } catch (err) {
            console.log(err)
        }

        if (currentSessions == null) {
            currentSessions = key
        } else {
            currentSessions += '$$$' + key
        }

        let tmpSessions = JSON.stringify(currentSessions)
        storeData('sessions', tmpSessions)
        storeData(key, JSON.stringify(currentTestData))
        exportExcel(key)
        setCurrentTestData({ size: 'small', data: [0, 0, 0, 0] })
        setReadyToAccept(false)
        setReadyToMove(true)
        setReadyToRun(true)
    }

    const storeData = async (storageKey, value) => {
        try {
            await AsyncStorage.setItem(storageKey, value)
        } catch (err) {
            console.log(err)
        }
    }


    const handleReject = () => {
        setCurrentTestData({ size: 'small', data: [0, 0, 0, 0] })
        setReadyToAccept(false)
        setReadyToMove(true)
        setReadyToRun(true)
    }

    const handleMovePlant = () => {
        sendOperationCode('2')
        setCurrentTestPlant('')
        setCurrentTestType('')
        setReadyToRun(false)
        setReadyToAccept(false)
        setStoredInitHeight(false)
    }


    const handleSmurfSelect = () => {
        setSmurfSelected(true)
    }

    const handlePusherSelect = () => {
        setSmurfSelected(false)
        setCurrentTestType('PUSHER')
    }

    const exportExcel = async (value) => {
        let angleArr = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5]
        const infoArray = value.split("$")
        console.log(`Info array at the beginning of exporting ${infoArray}`)
        const dateArray = infoArray[1].split(" ")

        let tmp = JSON.parse(await AsyncStorage.getItem(value))
        let tmpData = tmp.data
        let tmpSize = tmp.size

        let torsionalStiffness = findStiffness(tmpData)

        let data = [{
            "Tester Name": infoArray[3],
            "Date": dateArray[0],
            "Plant ID - Replicate Number": infoArray[0],
            "Planting Date": "",
            "Test Type": infoArray[4],
            "Torsional Stiffness": torsionalStiffness.toString(),
            "Additional Notes": ""
        },
        {},
        {
            "Tester Name": "Angle (degrees)",
            "Date": "Force (N)",
            "Plant ID - Replicate Number": "Torque (N*m)"
        }];

        for (var i in tmpData) {
            let tmp_force = parseFloat(tmpData[i]) * 9.81
            let torque = tmp_force * Math.sin((Math.PI / 2) - (angleArr[i] * Math.PI / 180)) * 0.15
            let tmp = {
                "Tester Name": angleArr[i],
                "Date": tmp_force.toString(),
                "Plant ID - Replicate Number": torque.toString()
            }
            data.push(tmp);
        }

        let ws = XLSX.utils.json_to_sheet(data);
        let wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "PlantData")
        const wbout = XLSX.write(wb, {
            type: 'base64',
            bookType: "xlsx"
        });

        const fileName = infoArray[0] + '_' + dateArray[0].replaceAll('/', '_') + '_' + dateArray[1].replaceAll(':', '_') + '.xlsx'
        const uri = FileSystem.cacheDirectory + fileName.replace(' ', '_');
        console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout} `);
        await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64
        });

        await Sharing.shareAsync(uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: "Data for Spreadsheets",
            UTI: 'com.microsoft.excel.xlsx'
        });
    }

    const findStiffness = (data) => {
        console.log(`Finding Torsional stiffness for the following data: ${data} `)

        let stiffness = 0.0
        let count = 0
        let sum = 0

        for (let i = 0; i < data.length - 1; i++) {
            if (i != data.length - 1) {
                console.log(`Sum, count before adding: ${sum}, ${count} `)
                sum += ((data[i + 1] * 9.81) - (data[i] * 9.81))
                count += 1
                console.log(`Sum, count after adding: ${sum}, ${count} `)
            }
        }
        console.log(`Average Change in Torque: ${sum / count} `)
        console.log(`Sum and Count: ${sum} and ${count} `)
        let deltaTau = sum / count
        let deltaRadians = .0087266
        stiffness = deltaTau / deltaRadians
        console.log(`Delta Tau, Delta Radians, and Stiffness: ${deltaTau}, ${deltaRadians}, ${stiffness} `)

        return stiffness
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
                        isConnected={connected}
                        connectedDevice={connectedDeviceName}
                        smurfSelected={smurfSelected}
                        selectSMURF={handleSmurfSelect}
                        selectPUSHER={handlePusherSelect} />
                </View>

            </Modal>
            <DataContainer
                isConnected={connected}
                handleDisplayConnectionPopUp={showConnectionPopUp}
                deviceName={connectedDeviceName}
                handleTestType={setTestType}
                handlePlantID={setPlantID}
                plantID={currentTestPlant}
                currentTestType={currentTestType} />
            <ControlsContainer
                isConnected={connected}
                sendOperationCode={sendOperationCode}
                handleRequestSmallData={readSmallData}
                handleRequestLargeData={readLargeData}
                readyToTest={readyToRun}
                smurfSelected={smurfSelected}
                retrievePusherData={retrievePusherData}
                calibrated={calibrated}
                storedInitHeight={storedInitHeight}
                isCalibrating={isCalibrating}
                calibrateStatus={calibrateStatus}
                isGettingHeight={isGettingHeight}
                runningCommand={runningCommand}
                runningSmallTest={runningSmallTest}
                runningLargeTest={runningLargeTest} />
            <OutputContainer
                isConnected={connected}
                currentTest={currentTestData}
                handleAccept={handleAccept}
                handleReject={handleReject}
                readyToAccept={readyToAccept}
                movePlant={handleMovePlant}
                readyToMove={readyToMove}
                isMovingToHome={isMovingToHome}
                runningCommand={runningCommand} />
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