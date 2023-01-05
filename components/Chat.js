import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function Chat(props) {
    let { color } = props.route.params;

    useEffect(() => {
        // use name prop to set the title in nav to the name entered by the user
        let { name } = props.route.params;
        props.navigation.setOptions({ title: name });
    });

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color}}>
            <View style={{backgroundColor: 'white', opacity: 0.7, height: '80%', width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontWeight: '600'}}>Chat Page</Text>
            </View>
        </View>
    )
}