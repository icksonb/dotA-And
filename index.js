/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Routes from './src';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => Routes);