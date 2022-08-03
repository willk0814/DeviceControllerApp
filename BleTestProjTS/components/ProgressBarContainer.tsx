import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { ProgressBar } from 'react-native-paper'

export default function ProgressBarContainer({ denomTime }) {

    const [status, setStatus] = useState(0)
    const [elapsedTime, setElapsedTime] = useState(0)




    useEffect(() => {
        const statusInterval = setInterval(() => {
            if (status < 1) {
                setElapsedTime(t => t + 1)
            }
        }, 1000)

        return () => {
            clearInterval(statusInterval)
        }
    }, [])

    useEffect(() => {
        setStatus(elapsedTime / denomTime)
    }, [elapsedTime])

    return (
        <View>
            <ProgressBar progress={status} color={'#2E2F2F'} />
        </View>
    )
}
