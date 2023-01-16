import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import { useState } from 'react';

export default function CustomActions(props) {
    return (
        <TouchableOpacity
            style={[styles.container]}
            onPress={() => onActionPress}
        >
            <View style={[styles.wrapper, props.wrapperStyle]}>
                <Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});