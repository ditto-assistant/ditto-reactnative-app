/**
 * Send button and form for sending Ditto a message.
 */
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from "react";
// import { statusTemp } from "../models/Status";
// import { grabStatus } from "../models/api";

export default function StatusBar(props) {
    const status = props.status

    let statusColor = 'red'
    if (status === 'on') {
        statusColor = 'green'
    }


    return (
        <View style={styles.statusBar} >
            <View style={styles.status}>
                <Text style={styles.statusText}>Status:</Text>
                <Text style={[styles.statusIndicator, { color: statusColor }]} >{status}</Text>
            </View>
            <TouchableOpacity onPress={() => { props.navigation.navigate('Settings') }}>
                <Icon
                    name='cog'
                    size={30}
                    style={{
                        color: 'white',
                        paddingTop: 10
                    }}
                />
            </TouchableOpacity>
            <View style={styles.status}>
                <Text style={styles.statusText}>Volume:</Text>
                <Text style={styles.statusIndicator}>70%</Text>
            </View>
        </View >
    );
}


const styles = StyleSheet.create({
    statusBar: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    status: {
        flexDirection: 'row',
        paddingLeft: 50,
        paddingRight: 50,
    },
    statusText: {
        fontSize: 17,
        paddingRight: 5,
        paddingTop: 10,
        color: 'white',
    },
    statusIndicator: {
        fontSize: 17,
        paddingTop: 10,
        color: 'green',
    },
});
