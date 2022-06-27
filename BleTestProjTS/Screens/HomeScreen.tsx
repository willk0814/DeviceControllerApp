import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.pageContainer}>
            <Text>Welcome to the Device Controller Application</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate("Testing")}>
                <Text>Go to Testing Screen</Text>
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

    },
    buttonText: {

    }
})
