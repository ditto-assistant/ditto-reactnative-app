import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { grabConversationHistory, grabConversationHistoryCount } from "./modules/db";
// import { grabStatus, resetConversation, grabMicStatus, toggleMic } from "./modules/db";
import { Divider } from '@rneui/themed';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import StatusBar from "../components/StatusBar";
import Icon from 'react-native-vector-icons/FontAwesome';
import { grabConversationHistory, grabConversationHistoryCount, grabMicStatus, grabStatus, sendPrompt, resetConversation, toggleMic, defaultIP } from '../modules/db'

const Settings = ({ navigation }) => {
    const [text, onChangeText] = React.useState('');

    const handleIPChange = () => {
        AsyncStorage.setItem('IP', text)
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