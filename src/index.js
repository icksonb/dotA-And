import Bluetooth from './Bluetooth';
import BluetoothCarregar from './BluetoothCarregar';
import ListWifi from './ListWifi';
import WifiParams from './WifiParams';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Routes = createAppContainer(
  createStackNavigator({
    BluetoothPage: Bluetooth,
    BluetoothCarregarPage: BluetoothCarregar,
    ListWifiPage: ListWifi,
    WifiParamsPage: WifiParams,
  })
);

export default Routes;