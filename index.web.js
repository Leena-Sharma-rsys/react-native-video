import React, {Component} from 'react';
import { Platform} from 'react-native';
import WebPlayer from './Video.web';
console.log("Platform.OS", Platform.OS)
// const Module = Platform.OS === 'web' ? require('./Video.web') : require('./Video.App')

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <WebPlayer {...props} />
    
  }
}
