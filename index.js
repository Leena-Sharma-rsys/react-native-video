import React, {Component} from 'react';
import {View, Text, Platform} from 'react-native';
// import VideoPlayerView from './VideoPlayerView';
import WebPlayer from './WebPlayer';
const Module = Platform.OS === 'web' ? require('./Video.web') : require('./Video.App')

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Module />;
    
  }
}
