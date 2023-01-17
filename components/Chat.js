// React & React Native Imports
import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Platform, KeyboardAvoidingView } from "react-native";
// Firebase Imports
import firebase from 'firebase';
import firestore from 'firebase';
// AsyncStorage Imports
import { getMessages, saveMessages, deleteMessages } from "../asyncStorage";
// Gifted Chat Imports
import { Bubble, Day, GiftedChat, InputToolbar, SystemMessage } from 'react-native-gifted-chat';
// NetInfo import
import NetInfo from '@react-native-community/netinfo';
// CustomActions imports
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';


export default function Chat(props) {
    // Declare States
    const [messages, setMessages] = useState([]);
    const [uid, setUid] = useState("");
    const [user, setUser] = useState({
        _id: '',
        name: '',
        avatar: '',
    });
    const [loginText, setLoginText] = useState('Logging you in, please wait');
    const [isOnline, setIsOnline] = useState(false);

    // Declare props from start.js
    let { color, name } = props.route.params;

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
        try {
            referenceChatMessages.add({
                uid: message.uid,
                _id: message._id,
                text: message.text || '',
                createdAt: message.createdAt,
                user: message.user,
                image: message.image || '',
                location: message.location || null,
            });
        } catch (error) {
            console.error('addMessage chat.js', error);
        }
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
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        setMessages(messages);
    }

    // Get the connection state and listen to changes being made to it
    useEffect(() => {
        NetInfo.fetch().then(connection => {
            setIsOnline(connection.isConnected);
        });

        const unsubNetInfo = NetInfo.addEventListener(
            connection => {
                setIsOnline(connection.isConnected);
            });

        // stop listening
        return () => {
            unsubNetInfo();
        }
    }, []);

    // if the user is online, get the data from firestore, if not, get the data from AsyncStorage
    useEffect(() => {
        // use name prop to set the title in nav to the name entered by the user
        props.navigation.setOptions({ title: name });
        let unsubscribe = null;

        if (isOnline) {
            // listen to authentication events
            const authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                if (!user) {
                    const user = await firebase.auth().signInAnonymously();
                    console.log("USER AUTH", user.user)
                }
                setUid(user.uid);
                setUser({
                    _id: user.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                });
                setLoginText(`Hello ${name}`)
                // update user state with currently active user data
                referenceMessagesUser = user.uid;

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
                                    },
                                    image: doc.image,
                                    location: doc.location,
                                });
                            });
                            setMessages(oldMessages);
                        }
                    }
                });
                // Listen for collection changes for the user
                unsubscribe = referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(onCollectionUpdate);

                // stop listening for updates when no longer required
                return () => {
                    unsubscribe();
                    authUnsubscribe();
                };
            })
        }
        // If the user is offline, let them know and get messages from AsyncStorage
        else {
            setLoginText('You appear to be offline');
            getMessages().then((messageParsed) => setMessages(messageParsed));
        }
    }, [isOnline]);

    // save messages to AsyncStorage when the state of 'messages' is updated
    useEffect(() => {
        saveMessages(messages);
    }, [messages]);

    //Customize input toolbar - hide if offline
    const renderInputToolbar = (props) => {
        if (!isOnline) {
            return null;
        } else {
            return <InputToolbar {...props} />
        }
    };

    // Customize right chat bubble
    const renderBubble = (props) => {
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
    const renderSystemMessage = (props) => {
        return (
            <SystemMessage {...props}
                textStyle={{
                    color: '#fff'
                }}
            />
        )
    }

    // Customize text color of date on top of messages
    const renderDay = (props) => {
        return (
            <Day {...props}
                textStyle={{
                    color: '#fff'
                }}
            />
        )
    }

    // render the button that displays communication features options (upload image, take photo, get location)
    const renderCustomActions = (props) => {
        return (
            <CustomActions {...props} />
        )
    }

    // render the MapView in chat when the user sends their location
    const renderCustomView = (props) => {
        const { currentMessage } = props;

        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            )
        }
        return null;
    }

    return (
        <View style={{ flex: 1, backgroundColor: color }}>
            <GiftedChat
                renderInputToolbar={renderInputToolbar}
                renderBubble={renderBubble}
                renderSystemMessage={renderSystemMessage}
                renderDay={renderDay}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                messages={messages}
                referenceMessagesUser={referenceMessagesUser}
                onSend={messages => onSend(messages, referenceMessagesUser)}
                user={user}
                showAvatarForEveryMessage={true}
                renderUsernameOnMessage={true}
                accessible={true}
                accessibilityLabel='Chat text input field'
                accessibilityHint='Enter your message here and press "Send" on the right to send your message '
            />
            {!isOnline && (
                <Text style={{ color: 'white', textAlign: 'center' }}>{loginText}</Text>
            )}
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
            }
        </View>
    )
}