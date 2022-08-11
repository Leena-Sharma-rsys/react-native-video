import React, {Component} from 'react';
import { Platform} from 'react-native';
import AppAndroidPlayer from './Video.App';
console.log("Platform.OS", Platform.OS)
// const Module = Platform.OS === 'web' ? require('./Video.web') : require('./Video.App')

export default class AndroidPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <AppAndroidPlayer {...this.props} />
    
  }
}
