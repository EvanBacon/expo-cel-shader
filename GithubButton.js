
import React from 'react';
import { Linking, TouchableOpacity, Image, View } from 'react-native';

const url = "https://github.com/EvanBacon/expo-cel-shader";
export default () => (
    <TouchableOpacity style={{ position: 'absolute', bottom: 8, right: 8 }} onPress={_ => {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err))
    }}>
        <Image style={{ width: 50, height: 50, borderRadius: 25, opacity: 0.5 }} source={{ uri: "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png" }} />
    </TouchableOpacity>
);