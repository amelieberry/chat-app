import React, { useCallback, useEffect, useState } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";

import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    let { color } = props.route.params;

    useEffect(() => {
        // use name prop to set the title in nav to the name entered by the user
        let { name } = props.route.params;
        props.navigation.setOptions({ title: name });

        // set state of messages
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ])
    }, [])

    // when message is sent, append new message to messages state
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    // Customize render bubble
    function renderBubble(props) {
        return (
            <Bubble {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2b2b2b',
                    }
                }}
            />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: color }}>
            <GiftedChat
                renderBubble={renderBubble}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
                accessible={true}
                accessibilityLabel='Chat text input field'
                accessibilityHint='Enter your message here and press "Send" on the right to sned your message '
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
            }
        </View>
    )
}