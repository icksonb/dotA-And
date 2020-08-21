import React from 'react';
import { View, Button, Text } from 'react-native';

const BluetoothCarregar = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor : '#3A435E' }} >
    <Text style={{color : 'white'}}>Sincronizando dispositivo bluetooth</Text>
  </View>
);

BluetoothCarregar.navigationOptions = {
    title: 'LSI-TEC',
}


export default BluetoothCarregar;