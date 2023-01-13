import AsyncStorage from "@react-native-async-storage/async-storage";

// Get messages from AsyncStorage
export const getMessages = async () => {
    try {
        const messageStringified =
            (await AsyncStorage.getItem('messages')) || [];
        const messageParsed = JSON.parse(messageStringified) || [];
        return messageParsed;
    } catch (error) {
        console.error('get message from storage error', error.message);
    }
};

// Add messages to AsyncStorage
export const saveMessages = async (messages) => {
    try {
        await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
        console.error('save message to storage error', error.message);
    }
};

// Delete messages from AsyncStorage
export const deleteMessages = async () => {
    try {
        await AsyncStorage.removeItem('messages');
    } catch (error) {
        console.error('remove message from storage error', error.message);
    }
};