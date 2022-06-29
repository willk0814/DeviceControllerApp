import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

const screenWidth = Dimensions.get('window').width * .90

export default function OutputContainer() {
    let xLabels = ["2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0"]

    const data = {
        labels: xLabels,
        datasets: [
            {
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ]
    }

    const chartConfig = {
        backgroundGradientFrom: "#2E2F2F",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#2E2F2F",
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };


    return (
        <View style={styles.pageContainer}>
            <View style={{ flex: 4 }}>
                <LineChart
                    data={data}
                    width={screenWidth}
                    height={400}
                    chartConfig={chartConfig}
                    bezier={true} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.rowStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>Accept Result</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonStyle, styles.rejectButton]}>
                        <Text style={styles.buttonText}>Reject Result</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 8,
        alignItems: 'center'
    },
    titleStyle: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#cddddd'
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonStyle: {
        backgroundColor: '#315a2a',
        borderRadius: 10,
        padding: 5,
        margin: 15
    },
    rejectButton: {
        backgroundColor: 'red'
    },
    buttonText: {
        color: '#cddddd',
        fontSize: 25,
        paddingHorizontal: 12.5
    }
})