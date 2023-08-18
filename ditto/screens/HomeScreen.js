import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { grabConversationHistory, grabConversationHistoryCount } from "./modules/db";
// import { grabStatus, resetConversation, grabMicStatus, toggleMic } from "./modules/db";
import { Divider } from '@rneui/themed';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import StatusBar from "../components/StatusBar";
import Icon from 'react-native-vector-icons/FontAwesome';
import { grabConversationHistory, grabConversationHistoryCount, grabMicStatus, grabStatus, sendPrompt, resetConversation, toggleMic, defaultIP } from '../modules/db'

const HomeScreen = ({ navigation }) => {

    const [bootStatus, setBootStatus] = useState("off");

    const [histCount, setCount] = useState(0)

    const [reset, setReset] = useState(false)

    const [IP, setIP] = useState(defaultIP)

    const [messages, setMessages] = useState([
        {
            _id: 1,
            text: "Hi! I'm Ditto.",
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'Ditto',
                // avatar: 'https://placeimg.com/140/140/any',
            },
        },
    ])

    const [microphoneStatus, setMicrophoneStatus] = useState("off")

    let buttonSize = 30

    const handleMicPress = async () => {
        console.log('handling mic press...')
        await toggleMic(IP)
        setMicrophoneStatus((prevStatus) => (prevStatus === 'off' ? 'on' : 'off'));
    }

    const resetConversationHandler = async () => {
        console.log('Resetting conversation history...')
        await resetConversation(IP)
        setReset(true)
    }


    /**
     * Gets local cached conversation history.
     * @returns {prompts, responses} prompts and responses objects 
     */
    const getSavedConversation = async () => {
        let prompts = JSON.parse(await AsyncStorage.getItem('prompts'))
        let responses = JSON.parse(await AsyncStorage.getItem('responses'))
        return { prompts, responses }
    }

    /**
     * Save updated history locally.
     */
    const handleSaveConversation = async (hist) => {
        await AsyncStorage.setItem('prompts', JSON.stringify(hist.prompts))
        await AsyncStorage.setItem('responses', JSON.stringify(hist.responses))
    }

    /**
     * Creates renderable conversation history that updates the sate.
     * @param {*} hist conversation history response from API
     * @param save boolean to save locally or not
     */
    const createConversation = async (hist, save) => {
        if (save) { await handleSaveConversation(hist) }
        let prompts = hist.prompts
        let responses = hist.responses
        let newConversation = [
            {
                _id: 1,
                text: "Hi! I'm Ditto.",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Ditto',
                    // avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ]
        if (reset) {
            setCount(0)
            setMessages(newConversation)
            setReset(false)
            return
        }
        let num = 2
        for (var key in prompts) {
            let prompt = prompts[key]
            let response = responses[key]
            var p_date = new Date(0)
            p_date.setUTCSeconds(Number(prompt[1]))
            var r_date = new Date(0)
            var start_date = new Date(0)
            start_date.setUTCSeconds(Number(prompt[1]) - 0.5)
            newConversation[0].createdAt = start_date

            newConversation.push(
                {
                    _id: num,
                    text: prompt[0],
                    createdAt: p_date,
                    user: {
                        _id: 1,
                        name: 'User',
                        // avatar: 'https://placeimg.com/140/140/any',
                    },
                }
            )

            if (response !== undefined) {
                r_date.setUTCSeconds(Number(response[1]))
                newConversation.push(
                    {
                        _id: num + 1,
                        text: response[0],
                        createdAt: r_date,
                        user: {
                            _id: 2,
                            name: 'Ditto',
                            // avatar: 'https://placeimg.com/140/140/any',
                        },
                    }
                )
                num = num + 2
            } else {
                num = num + 1
            }
            newConversation.sort((a, b) => b.createdAt - a.createdAt)
            setMessages(newConversation)
        }
    }

    useEffect(() => {

        const handleStatus = async () => {
            var statusDb = await grabStatus(IP)
            if (bootStatus !== statusDb.status) {
                setBootStatus(statusDb.status)
            }
        }

        const handleMicStatus = async () => {
            var micStatusDb = await grabMicStatus(IP)
            if (microphoneStatus !== micStatusDb.ditto_mic_status) {
                setMicrophoneStatus(micStatusDb.ditto_mic_status)
            }
        }

        const checkIPChange = async () => {
            let ipChange = await AsyncStorage.getItem('IP')
            if (ipChange === null) {
                return
            } else {
                setIP(ipChange)
            }
        }

        const syncConversationHist = async () => {
            let hasHistCount = await AsyncStorage.getItem('histCount')
            if (hasHistCount === undefined) { hasHistCount = false }
            let serverHistCount = await grabConversationHistoryCount(IP)
            localHistCount = await AsyncStorage.getItem('histCount')
            localHistCount = Number(localHistCount)
            if (hasHistCount) { // If there is a local histCount variable, check if need to update from Server
                // console.log(histCount, localHistCount)
                let localHist = await getSavedConversation()
                if (histCount !== localHistCount) {
                    setCount(localHistCount)
                    await createConversation(localHist, false)
                }

            }
            if (serverHistCount !== undefined && serverHistCount !== localHistCount) {
                try {
                    let hist = await grabConversationHistory(IP)
                    if (histCount !== serverHistCount) {
                        setCount(serverHistCount)
                        await AsyncStorage.setItem('histCount', String(serverHistCount)) // store histCount locally
                    }
                    await createConversation(hist, true)
                    // console.log(serverHistCount, histCount)
                } catch (e) {
                    console.log(e)
                }
            }
        }

        const syncInterval = setInterval(async () => {

            try {
                await checkIPChange()
                await handleStatus()
                await handleMicStatus()
                await syncConversationHist()
            } catch (e) {
                console.log(e)
            }

        }, 1000)

        // run when unmounted
        return () => {
            clearInterval(syncInterval) // fixes memory leak 
        }

    }, [reset, IP, histCount])

    const statusColor = bootStatus === 'on' ? 'green' : 'red'

    const onSend = useCallback(async (messages = []) => {
        // setMessages(previousMessages =>
        //     GiftedChat.append(previousMessages, messages),
        // )
        await sendPrompt(messages[0].text, IP)
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={async () => { await handleMicPress() }}>
                    {microphoneStatus === 'on' ? (
                        <Icon
                            name='microphone'
                            size={buttonSize}
                            style={{
                                alignSelf: 'flex-start',
                                width: buttonSize,
                                height: buttonSize,
                                color: 'green',
                            }}
                        />
                    ) :
                        <Icon
                            name='microphone-slash'
                            size={buttonSize}
                            style={{
                                alignSelf: 'flex-start',
                                width: buttonSize,
                                height: buttonSize,
                                color: 'red',
                            }}
                        />
                    }

                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 10
                }}
                    onPress={async () => { await resetConversationHandler() }}
                >
                    <Icon
                        name='undo'
                        size={buttonSize}
                        style={{
                            alignSelf: 'flex-end',
                            width: buttonSize,
                            height: buttonSize,
                            color: 'white'
                        }}
                    />

                </TouchableOpacity>
            )
        })
    }, [navigation, microphoneStatus, bootStatus]);

    renderInputToolbar = (props) => {
        //Add the extra styles via containerStyle
        return <InputToolbar {...props} containerStyle={{ borderTopWidth: 1.5, borderTopColor: '#333', borderRadius: 10, backgroundColor: '#282c34' }} />
    }


    return (
        <View style={{ flex: 1 }}>
            <Divider color='black' />
            <StatusBar
                status={bootStatus}
                statusColor={statusColor}
                navigation={navigation}
            />
            <Divider color='black' style={{ paddingBottom: 10 }} />
            <GiftedChat
                renderInputToolbar={renderInputToolbar}
                messages={messages}
                onSend={async (messages) => { await onSend(messages) }}
                user={{
                    _id: 1,
                }}
            />
        </View>

    );
}

const styles = StyleSheet.create({

    NavButton: {
        fontSize: '10px',
    },

    AppLink: {
        color: '#61dafb',
    },

});

export default HomeScreen;