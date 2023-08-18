/**
 * Send button and form for sending Ditto a message.
 */
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
// import { sendPrompt } from "../models/api";

export default function SendMessage() {
    const [message, setMessage] = useState("");

    const [formHeight, setFormHeight] = useState(50)

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (message !== '') {
            // await sendPrompt(message)
            setMessage("")
        }
    }

    const onEnterPress = async (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            if (message !== '') {
                // await sendPrompt(message)
                setMessage("")
            }
        }
    }

    return (
        <View styles={styles.contents} >
            <View styles={styles.bar}>
                <TextInput
                    styles={styles.textArea}
                    value={message}
                    onChangeText={(e) => setMessage(e.target.value)}
                />
                <Button
                    styles={styles.submit}
                    onPress={() => handleSubmit()}
                    title="Send"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contents: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        paddingRight: 15,
        color: 'white',
        fontSize: 10 + 2 * Math.min(window.innerWidth, window.innerHeight) / 100,
        maxWidth: '50%',
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        flexDirection: 'row',
        height: 50,
    },
    textArea: {
        borderRadius: 90,
        backgroundColor: 'transparent',
        color: 'white',
        padding: 10,
        overflow: 'hidden',
    },
    submit: {
        backgroundColor: 'transparent',
        borderColor: 'grey',
        borderRadius: 90,
        borderStyle: 'solid',
        color: 'skyblue',
    },
    submitActive: {
        borderStyle: 'groove',
        color: 'white',
        borderColor: 'skyblue',
    },
});
