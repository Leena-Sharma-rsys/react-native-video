
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import ShakaPlayer from 'shaka-player-react';
import shaka from 'shaka-player';

import 'shaka-player/dist/controls.css';
import 'shaka-player-react/dist/controls.css';


export default function WebPlayer() {

    return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>
            <ShakaPlayer
                src={
                    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
                controls
                chromeless={true}
            />
        </View>
    );

}


