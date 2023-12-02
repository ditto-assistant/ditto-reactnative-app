import React from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { updateDittoUnitIP, defaultIP } from "../modules/db";

const Settings = ({ navigation }) => {
    const [text, onChangeText] = React.useState('');

    const handleIPChange = () => {
        updateDittoUnitIP(text, defaultIP)
        onChangeText('')
    }

    return (
        <View style={styles.body}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
            />
            <TouchableOpacity onPress={handleIPChange}>
                <Text style={{ fontSize: 30, color: 'white' }}>Set IP</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({

    body: {
        flex: 1,
        alignItems: 'center'
    },

    input: {
        backgroundColor: 'white',
        height: 40,
        width: '80%',
        margin: 12,
        padding: 10
    }

});

export default Settings;