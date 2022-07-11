import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function ControlsContainer({ isConnected, sendOperationCode, handleRequestSmallData, handleRequestLargeData, readyToTest, smurfSelected, retrievePusherData }) {
    return (
        <View style={styles.pageContainer}>

            {
                smurfSelected ? (
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
                                style={!readyToTest ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                                onPress={() => sendOperationCode("8")}
                                disabled={!readyToTest}>
                                <Text style={styles.buttonText}>Small Flex Test</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={!readyToTest ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                                onPress={handleRequestSmallData}
                                disabled={!readyToTest}>
                                <Text style={styles.buttonText}>Retrieve Small Data</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={!readyToTest ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                                onPress={() => sendOperationCode("9")}
                                disabled={!readyToTest}>
                                <Text style={styles.buttonText}>Large Flex Test</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={!readyToTest ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                                onPress={handleRequestLargeData}
                                disabled={!readyToTest}>
                                <Text style={styles.buttonText}>Retrieve Large Data</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                ) : (
                        <TouchableOpacity
                            style={!readyToTest ? [styles.buttonStyle, styles.disabledButton, { width: 300 }] : [styles.buttonStyle, { width: 300 }]}
                            onPress={retrievePusherData}
                            disabled={!readyToTest}>
                            <Text style={styles.buttonText}>Retrieve Pusher Data</Text>
                        </TouchableOpacity>
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
    },
    disabledButton: {
        backgroundColor: 'grey'
    }
})
