import Bluetooth from './Bluetooth';
import BluetoothCarregar from './BluetoothCarregar';
import ListWifi from './ListWifi';
import WifiParams from './WifiParams';
import Sensores from './Sensores';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Routes = createAppContainer(
  createStackNavigator({
    BluetoothPage: Bluetooth,
    BluetoothCarregarPage: BluetoothCarregar,
    ListWifiPage: ListWifi,
    WifiParamsPage: WifiParams,
    SensoresPage: Sensores,
  })
);

export default Routes;