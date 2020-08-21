import React from 'react';
import {View, StatusBar, Dimensions, StyleSheet, ScrollView, 
  PermissionsAndroid} from 'react-native';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

import { BleManager } from 'react-native-ble-plx';

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

const manager = new BleManager();

class RenderCard extends React.Component {

  constructor(props)
  {
    super(props);  
  }

  render()
  {
    return (
        <Block row center card shadow space="between" style={styles.card} key={this.props.title}>
          
          <Block flex>
            <Text size={BASE_SIZE * 1.125}>{this.props.title}</Text>
            <Text size={BASE_SIZE * 0.875} muted>{this.props.subtitle}</Text>
          </Block>
          <Button style={styles.right} 
            onPress={this.props.funcao}>
            <Icon size={18} name="chevron-right" color={COLOR_GREY} />
          </Button>
        </Block>
    );
  }
}

let teste = false;

class ListDevices extends React.Component{
  constructor(props) 
  {
    super(props);
    this.retorno = false;
  }
  



  componentDidMount()
  {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
    if (result) {
      console.log("Permission is OK");
      manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
              // Handle error (scanning will be stopped automatically)
              console.log("Error");
              return "error"
      }
      console.log(device.name);
      manager.stopDeviceScan();
      this.retorno = true;
      this.forceUpdate();
    });
    }
    else
    {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
    }});

  }


  render()
  {

    
    
    
     
    
    if(this.retorno == false)
    {
    return(
        

        <ScrollView style={{ flex: 1 }}>
          <RenderCard title="Componente 2" subtitle="L2" funcao={this.props.funcao}/>
        </ScrollView>
      
    );
    }
    else
    {
      return(
      <ScrollView style={{ flex: 1 }}>
          <RenderCard title="Componente 1" subtitle="L1" funcao={this.props.funcao}/>
        </ScrollView>
        );
    }
  }
}

const { width } = Dimensions.get("screen");

const Bluetooth = ({ navigation }) => (
 
   



    <Block flex fluid style={{backgroundColor : '#3A435E'}}>
      <Block row center card space="between" style={styles.header}>
          
        <Block flex>
          <Text size={BASE_SIZE * 1.125} style={styles.textHeader}>SELECIONE O DISPOSITIVO</Text>
        </Block>
      </Block>
      
        <ListDevices funcao={() => navigation.navigate('BluetoothCarregarPage')}/>
      
    </Block>
  
);

const styles = StyleSheet.create({
  textHeader:{
    color : 'white',
    textAlign: 'center',
  },
  header: {
    borderColor: '#3A435E',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: 'transparent',
    shadowOpacity: 0.1,

  },
  card: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.40,
  },
  menu: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  settings: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  left: {
    marginRight: BASE_SIZE,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  gradient: {
    width: BASE_SIZE * 3.25,
    height: BASE_SIZE * 3.25,
    borderRadius: BASE_SIZE * 3.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Bluetooth.navigationOptions = {
  title: 'LSI-TEC',
}

export default Bluetooth;