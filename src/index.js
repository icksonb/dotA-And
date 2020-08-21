import Bluetooth from './Bluetooth';
import BluetoothCarregar from './BluetoothCarregar';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Routes = createAppContainer(
  createStackNavigator({
    BluetoothPage: Bluetooth,
    BluetoothCarregarPage: BluetoothCarregar,
  })
);

export default Routes;