import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { ProgressBar } from 'react-native-paper'

export default function ControlsContainer({ isConnected, sendOperationCode, handleRequestSmallData, handleRequestLargeData, readyToTest, smurfSelected, retrievePusherData, calibrated, storedInitHeight, isCalibrating, calibrateStatus, isGettingHeight, runningCommand }) {

    console.log(`Running Command: ${runningCommand}`)

    return (
        <View style={styles.pageContainer}>

            {
                smurfSelected ? (
                    <View>
                        <TouchableOpacity
                            style={calibrated ? [styles.buttonStyle, { backgroundColor: 'red' }] : [styles.buttonStyle]}
                            onPress={() => sendOperationCode("0")}
                            disabled={!isConnected || runningCommand}>

                            {isCalibrating ?
                                (<ActivityIndicator />) :
                                (<Text style={styles.buttonText}>Calibrate</Text>)}


                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => sendOperationCode("2")}>
                            <Text style={styles.buttonText}>Return to Home</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={!isConnected || storedInitHeight || runningCommand ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                            onPress={() => sendOperationCode("1")}
                            disabled={!isConnected || storedInitHeight || runningCommand}>
                            {isGettingHeight ?
                                (<ActivityIndicator />) :
                                (<Text style={styles.buttonText}>Get Init Height</Text>)}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={!(readyToTest && storedInitHeight) ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                            onPress={() => sendOperationCode("8")}
                            disabled={!(readyToTest && storedInitHeight)}>
                            <Text style={styles.buttonText}>Small Flex Test</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={!(readyToTest && storedInitHeight) ? [styles.buttonStyle, styles.disabledButton] : styles.buttonStyle}
                            onPress={() => sendOperationCode("9")}
                            disabled={!(readyToTest && storedInitHeight)}>
                            <Text style={styles.buttonText}>Large Flex Test</Text>
                        </TouchableOpacity>

                    </View>
                ) : (
                        <TouchableOpacity
                            style={!readyToTest ? [styles.buttonStyle, styles.disabledButton] : [styles.buttonStyle]}
                            onPress={retrievePusherData}
                            disabled={!readyToTest}>
                            <Text style={styles.buttonText}>Retrieve Pusher Data</Text>
                        </TouchableOpacity>
                    )
            }
        </View >
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 5,
        justifyContent: 'center',
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
        width: 650

    },
    buttonText: {
        color: '#cddddd',
        fontSize: 25,
        alignSelf: 'center'
    },
    largeButtonStyle: {
        width: 350
    },
    disabledButton: {
        backgroundColor: 'grey'
    }
})
