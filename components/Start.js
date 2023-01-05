import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";

// define background colors selectable by users
const backgroundColors = {
    black: '#090C08',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE'
}

// Start component - The state of name and color are set from user input to be used as props in Chat component.
export default function Start(props) {
    const [name, setName] = useState('');
    const [color, setColor] = useState(backgroundColors.black);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/Background-Image.png')}
                resizeMode='cover'
                style={styles.image}
            >
                <Text style={styles.title}>Chat App</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.nameInput}
                        onChangeText={(name) => setName(name)}
                        value={name}
                        placeholder='Your name'
                    />
                    <View style={styles.colorContainer}>
                        <Text style={styles.text}>Choose a Background Color:</Text>
                        <View style={styles.colors}>
                            <TouchableOpacity 
                                style={[styles.circle, {backgroundColor: backgroundColors.black}]}
                                onPress={() => setColor(backgroundColors.black)}
                            />
                            <TouchableOpacity 
                                style={[styles.circle, {backgroundColor: backgroundColors.purple}]}
                                onPress={() => setColor(backgroundColors.purple)}
                            />
                            <TouchableOpacity 
                                style={[styles.circle, {backgroundColor: backgroundColors.blue}]}
                                onPress={() => setColor(backgroundColors.blue)}
                            />
                            <TouchableOpacity 
                                style={[styles.circle, {backgroundColor: backgroundColors.green}]}
                                onPress={() => setColor(backgroundColors.green)}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => props.navigation.navigate('Chat', { name: name, color: color })}
                    >
                        <Text style={styles.buttonText}>START CHATTING</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#fff',
        marginTop: 40
    },

    inputContainer: {
        backgroundColor: '#fff',
        height: '44%',
        width: '88%',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 5,
        marginBottom: 28
    },

    nameInput: {
        fontSize: 16,
        height: '20%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 5,
        color: '#757083'
    },

    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#757083',
        paddingBottom: 5,
    },

    colorContainer: {
        height: '60%',
        justifyContent: 'center',
        paddingVertical: 5,
    },

    colors: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },


    circle: {
        width: 60,
        height: 60,
        borderRadius: 60/2,
        backgroundColor: 'blue'
    },

    startButton: {
        backgroundColor: '#757083',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        fontSize: 16, 
        fontWeight: '600',
        color: '#fff'
    }
});