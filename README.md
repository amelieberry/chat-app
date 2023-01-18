# Chat App
A native chat app built with React Native. The app provides users with a chat interface and options to share images and their location.

## Key Features
* A page where users can enter their name and choose a background color for the chat screen before joining the chat.
* A page displaying the conversation, as well as an input field and submit button.
* The chat provides users with two additional communication features: sending image and location data.
* Data gets stored online and offline.

## User Stories
* As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family.
* As a user, I want to be able to send messages to my friends and family members to exchange the latest news.
* As a user, I want to send images to my friends to show them what I’m currently doing.
* As a user, I want to share my location with my friends to show them where I am.
* As a user, I want to be able to read my messages offline so I can reread conversations at any time.
* As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.

## Built with
* React Native
* Expo
* Firebase
* Gifted Chat library

## Running the Project
### Prerequisites
* Install [Expo](https://expo.dev/) `npm install expo-cli -g`.
* Download the [Expo Go App](https://expo.dev/client) on your mobile device from the Google Play Store or the Apple Store.
* Windows and Linux Users: Install [Android Studio](https://developer.android.com/studio).
* Mac Users: Install [Xcode](https://developer.apple.com/xcode/).

### Get Started
* Install all dependencies by running `npm i`.
* Start the app by running `npm start` or `expo start`.
* On the Expo Go App, launch the chat-app by scanning the QR code shown in your terminal
* On an emulator, launch the chat-app by pressing "Run on Android device / emulator

### Set up the Database
Chat messages are stored on [Firebase](https://firebase.google.com/), version 8.2.3.
Firebase documentation can be found [here](https://firebase.google.com/docs/web/setup).

* In your [Firebase Console](https://console.firebase.google.com), create a project in test mode.
* In your project's directory, run `npm install firebase@8.2.3`.
* At the top of your Chat.js file, import Firebase: `import firebase from 'firebase';`
* Back in the Firebase Console, navigate to Project Settings and select the `</>` icon to register the application.
* Copy the data received in the last step and store it in a variable:
>```js
>const firebaseConfig = {
>  apiKey: 'your-api-key',
>  authDomain: 'your-authdomain',
>  databaseURL: 'your-database-url',
>  projectId: 'your-project-id',
>  storageBucket: 'your-storage-bucket',
>  messagingSenderId: 'your-messaging-sender-id',
>  appId: 'your-app-id',
>};
>```
* Initialize the app:
>```js
>if (!firebase.apps.length) {
>        firebase.initializeApp(firebaseConfig);
>    }
>```
* Create a reference to the collection in Firestore:
>```js
>const referenceChatMessages = firebase.firestore().collection('messages');
>```




