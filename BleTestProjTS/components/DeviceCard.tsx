import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Device } from 'react-native-ble-plx';

// type DeviceCardProps = {
//     device: Device
// }

export default function DeviceCard({ device, handleConnect }) {
    // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // is the device connected?
        device.isConnected().then(setIsConnected);
    }, [device]);

    return (
        <TouchableOpacity
            style={styles.container}
            // navigate to the Device Screen
            onPress={() => handleConnect(device)}
        >
            <Text>{`Id : ${device.id}`}</Text>
            <Text>{`Name : ${device.name}`}</Text>
            <Text>{`Is connected : ${isConnected}`}</Text>
            <Text>{`RSSI : ${device.rssi}`}</Text>
            {/* Decode the ble device manufacturer which is encoded with the base64 algorithm */}
            {/* <Text>{`Manufacturer : ${Base64.decode(device.manufacturerData)}`}</Text> */}
            <Text>{`Manufacturer Data: ${device.manufacturerData}`}</Text>
            <Text>{`ServiceData : ${device.serviceData}`}</Text>
            <Text>{`UUIDS : ${device.serviceUUIDs}`}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginBottom: 12,
        borderRadius: 16,
        shadowColor: 'rgba(60,64,67,0.3)',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
        padding: 12,
    }
})
