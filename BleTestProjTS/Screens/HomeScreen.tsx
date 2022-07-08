import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'

export default function HomeScreen({ navigation, setResearcher, emptyResearcher }) {

    const [tmpResearcherID, setTmpResearcherID] = useState('')



    return (
        <View style={styles.pageContainer}>
            <Text style={styles.titleText}>Welcome to the Device Controller Application</Text>

            <TextInput
                style={styles.inputStyle}
                placeholder='Researcher ID'
                placeholderTextColor='#2E2F2F'
                onChangeText={value => setTmpResearcherID(value)} />


            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => setResearcher(tmpResearcherID)}>
                <Text style={styles.buttonText}>Save ResearcherID</Text>
            </TouchableOpacity>



            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigation.navigate("Testing")}
                disabled={emptyResearcher}>
                <Text style={styles.buttonText}>Go to Testing Screen</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigation.navigate("Logs")} >
                <Text style={styles.buttonText}>Go to Logs Screen</Text>
            </TouchableOpacity>
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
    buttonStyle: {
        padding: 5,
        backgroundColor: '#315a2a',
        borderRadius: 10,
        marginVertical: 10,
        width: 350
    },
    buttonText: {
        fontSize: 25,
        color: '#cddddd',
        textAlign: 'center'
    },
    titleText: {
        fontSize: 35,
        color: '#cddddd',
    },
    inputStyle: {
        backgroundColor: '#cddddd',
        width: 350,
        textAlign: 'center',
        marginTop: 100,
        fontSize: 25,
        marginVertical: 10
    }
})
