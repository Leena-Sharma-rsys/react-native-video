import { AppRegistry } from 'react-native';
import App from './Video.web';



const style = document.createElement('style');

// Inject stylesheet
document.head.appendChild(style);
if (module.hot) {
    module.hot.accept();
}
AppRegistry.registerComponent('VideoApp', () => App);
AppRegistry.runApplication('VideoApp', {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
});
