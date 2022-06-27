import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function DeviceCard({ device, handleSelect, desiredDevice }) {
    return (
        <TouchableOpacity
            style={desiredDevice == device ? [styles.unSelected, styles.selected] : styles.unSelected}
            onPress={() => handleSelect(device)} >
            <Text>{`Id : ${device.id}`}</Text>
            <Text>{`Name : ${device.name}`}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    unSelected: {
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 8,
        padding: 5
    },
    selected: {
        backgroundColor: 'grey'
    }
})