import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function ControlsContainer({ isConnected, sendOperationCode, handleRequestSmallData, handleRequestLargeData }) {
    return (
        <View style={styles.pageContainer}>
            {
                isConnected ? (
                    <View>
                        <View style={[{ flexDirection: 'row' }, { justifyContent: 'center' }]}>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={() => sendOperationCode("0")}>
                                <Text style={styles.buttonText}>Calibrate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={() => sendOperationCode("3")}>
                                <Text style={styles.buttonText}>Return to Home Position</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={[{ flexDirection: 'row' }, { justifyContent: 'center' }]}>
                            <TouchableOpacity
                                style={[styles.buttonStyle]}
                                onPress={() => sendOperationCode("8")}>
                                <Text style={styles.buttonText}>Small Flex Test</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.buttonStyle]}
                                onPress={handleRequestSmallData}>
                                <Text style={styles.buttonText}>Retrieve Small Data</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.buttonStyle]}
                                onPress={() => sendOperationCode("9")}>
                                <Text style={styles.buttonText}>Large Flex Test</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.buttonStyle]}
                                onPress={handleRequestLargeData}>
                                <Text style={styles.buttonText}>Retrieve Large Data</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                ) : (
                        <Text style={styles.titleStyle}>Device Controls</Text>
                    )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 50
        // alignItems: 'center'
    },
    titleStyle: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#cddddd'
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        margin: 10,
        padding: 5,
        borderRadius: 5,
        paddingVertical: 10,
        width: 175
    },
    buttonText: {
        color: '#cddddd',
        fontSize: 20,
        textAlign: 'center'
    },
    largeButtonStyle: {
        width: 350
    }
})
