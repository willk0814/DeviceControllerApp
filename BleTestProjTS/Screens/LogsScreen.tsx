import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function LogsScreen() {
    return (
        <View style={styles.pageContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>Welcome to the Logs Screen</Text>
                <View style={styles.rowContainer}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => console.log("Search for Logs Pressed")}>
                        <Text style={styles.buttonText}>Search for Logs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => console.log("Clear Pressed")} >
                        <Text style={styles.buttonText}>Clear Records</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2E2F2F'
    },
    titleContainer: {
        flex: 1,
        marginTop: 15,
        alignItems: 'center',

    },
    titleStyle: {
        fontSize: 35,
        color: '#cddddd',
        marginBottom: 10
    },
    rowContainer: {
        flexDirection: 'row'
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 5
    },
    buttonText: {
        color: '#cddddd',
        fontSize: 25
    }
})