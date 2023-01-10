import React, { useCallback, useEffect, useState } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import firebase from 'firebase';
import firestore from 'firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Bubble, Day, GiftedChat, SystemMessage } from 'react-native-gifted-chat';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [uid, setUid] = useState("");
    let { color } = props.route.params;

    // Initialize Firestore App
    const firebaseConfig = {
        apiKey: "AIzaSyDLrtynpGQKU59OVJWJctjxBv4zeIAfqt4",
        authDomain: "chat-app-435a0.firebaseapp.com",
        projectId: "chat-app-435a0",
        storageBucket: "chat-app-435a0.appspot.com",
        messagingSenderId: "121247427447",
        appId: "1:121247427447:web:d47ff1f170c41ed912cf72"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // refer to the 'messages' collection in the database
    let referenceMessagesUser = null;
    const referenceChatMessages = firebase.firestore().collection('messages');

    // when message is sent, append new message to messages state
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const message = messages[0];
        message.uid = referenceMessagesUser
        addMessage(message);
    }, []);

    // add message document to the messages collection
    const addMessage = (message) => {     
        referenceChatMessages.add({
            uid: message.uid,
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: message.user,
        });
    }

    // retrieve the current data from messages collection and store it in messages state
    const onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //go through each document
        querySnapshot.forEach((doc) => {
            //get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                uid: data.uid,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                }
            });
        });
        setMessages(messages);
    }

    useEffect(() => {
        // use name prop to set the title in nav to the name entered by the user
        let { name } = props.route.params;
        props.navigation.setOptions({ title: name });

        let unsubscribe = null;
        // let unsubscribe = referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(onCollectionUpdate);

        // listen to authentication events
        const authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                const user = await firebase.auth().signInAnonymously();
                console.log("USER AUTH", user.user)
            }
            setUid(user.uid);
            // update user state with currently active user data
            referenceMessagesUser = user.uid;

            // console.warn('message uid', messages[0].uid);
            // console.log("referenceChatMessages", await referenceChatMessages.get({uid: user.uid}));
            await referenceChatMessages.get({ uid: user.uid }).then((querySnapshot) => {
                const docs = querySnapshot.docs.map(doc => doc.data());
                if (docs) {
                    if (docs.length > 0) {
                        const oldMessages = [];
                        //go through each document
                        docs.forEach((doc) => {
                            //get the QueryDocumentSnapshot's data                               
                            oldMessages.push({
                                _id: doc._id,
                                text: doc.text,
                                createdAt: doc.createdAt.toDate(),
                                uid: doc.uid,
                                user: {
                                    _id: doc.user._id,
                                    name: doc.user.name,
                                    avatar: doc.user.avatar,
                                }
                            });
                        });

                        // console.log("SETTING OLD MESSAGES: ", oldMessages)
                        setMessages(oldMessages);
                    }

                }
            });
            // create a reference to the active user's messages

            // Listen for collection changes for the user
            unsubscribe = referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(onCollectionUpdate);
        })

        // stop listening for updates when no longer required
        return () => {
            unsubscribe();
            authUnsubscribe();
        };
    }, [])

    // Customize right chat bubble
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

    // Customize system message text color
    function renderSystemMessage(props) {
        return (
            <SystemMessage {...props}
                textStyle={{
                    color: '#fff'
                }}
            />
        )
    }

    // Customize text color of date on top of messages
    function renderDay(props) {
        return (
            <Day {...props}
                textStyle={{
                    color: '#fff'
                }}
            />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: color }}>
            <GiftedChat
                renderBubble={renderBubble}
                renderSystemMessage={renderSystemMessage}
                renderDay={renderDay}
                messages={messages}
                referenceMessagesUser={referenceMessagesUser}
                onSend={messages => onSend(messages, referenceMessagesUser)}
                user={{
                    _id: uid,
                }}
                accessible={true}
                accessibilityLabel='Chat text input field'
                accessibilityHint='Enter your message here and press "Send" on the right to send your message '
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
            }
        </View>
    )
}