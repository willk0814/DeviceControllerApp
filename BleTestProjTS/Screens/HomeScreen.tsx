import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.pageContainer}>
            <Text style={styles.titleText}>Welcome to the Device Controller Application</Text>
            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigation.navigate("Testing")}>
                <Text>Go to Testing Screen</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => console.log('Go to Logs Screen')} >
                <Text style={styles.buttonText}>Go to Logs Screen</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonStyle: {
        paddingTop: 10
    },
    buttonText: {

    },
    titleText: {

    }
})