import React from 'react';
import {View, StatusBar, Dimensions, StyleSheet, ScrollView, Image,
  PermissionsAndroid, NativeModules, AppState, NativeEventEmitter} from 'react-native';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

const manager = BleManager;
const bleManagerEmitter = new NativeEventEmitter(manager);

class RenderCard extends React.Component {

	constructor(props)
	{
		super(props);  
	}

	render()
	{
		return (
			<Block row center card shadow space="between" style={styles.card} key={this.props.title}>
				<Icon style={styles.right} size={22} name="bluetooth" color={COLOR_GREY} />
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

let verifica = false;
let devices = new Array();
var retorno = false;
class ListDevices extends React.Component
{

	constructor(props) 
	{
		super(props);
		retorno = false; //Monitora retorno
		this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
		console.log("Construtor");
	}
  	
  	//Retorno dos dispositivos encontrados
	handleDiscoverPeripheral(peripheral)
	{
		if(retorno == false)
		{
			devices = [];
			devices = [{'name': peripheral.name, 'UUID' : peripheral.id}];
			retorno = true;
		}
		else
		{
			verifica = false;
			if(devices)
			{
				devices.map(nameDevice =>
				{
					if(nameDevice.name == peripheral.name)
						verifica = true;
				});	
			}
			
			//Verifica se o elemento já existe na lista
			if(verifica == false)
			{
				devices.push({'name': peripheral.name, 'UUID' : peripheral.id});
			}	
		}
		this.forceUpdate();
	}

	componentDidMount()
	{
		console.log("Did");

		this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
		
		//Verifica permissão
		PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).
		then((result) => 
		{
			if (result) //Se permissão for OK
			{
				//Inicia módulo Bluetooth
				manager.start({showAlert: false});
				
				//Realiza o scan dos dispositivos
				BleManager.scan([], 15, false);
		 	}
	 		else
	 		{
	 			//Requisita permissão
				PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).
				then((result) => 
				{
					if (result) //Permissão concedida
					{
						//Inicia módulo Bluetooth
						manager.start({showAlert: false});
						
						//Realiza o scan dos dispositivos
						BleManager.scan(devices, 15, false);
					}
					else 
					{
						return "Error";
					}
				});
	 		}
		});
	}

	printCards()
	{
		if(retorno == true && devices)
	 	{
	 		return devices.map(nameDevice =>
	 		{
	 			if(nameDevice.name)
	 			{
		 			return(
		 				<RenderCard title={nameDevice.name} subtitle={nameDevice.UUID} 
		 					funcao={() => {this.props.funcao.navigate('BluetoothCarregarPage' ,
		 					{name: nameDevice.name, UUID : nameDevice.UUID,});}}/>
		 			);
		 		}
	 		})
	 	}
	}

	refresh()
	{
		devices = new Array();
		BleManager.scan([], 15, false);
		retorno = false;
		this.forceUpdate();
	}

	render()
	{
		if(retorno == false)
		{
			return(
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Button round center style={{ width: 40, height: 40}} color={COLOR_GREY} 
							onPress={() => this.refresh()}>
			  			<Icon size={22} name="refresh" color={COLOR_WHITE} />
		  			</Button>
					<Text size={BASE_SIZE * 1.125} style={styles.textHeader}>
						Buscando dispositivos...</Text>
				</View>
			);	
		}
		else
		{
			return(
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Button round center style={{ width: 40, height: 40}} color={COLOR_GREY} 
							onPress={() => this.refresh()}>
			  			<Icon size={22} name="refresh" color={COLOR_WHITE} />
		  			</Button>
		  			<Text size={BASE_SIZE * 1.125} style={styles.textHeader}>SELECIONE O DISPOSITIVO</Text>
					{this.printCards()}				
				</View>
			);	
		}
	}
}


const { width } = Dimensions.get("screen");

const Bluetooth = ({ navigation }) => (
 
	 <Block flex fluid style={{backgroundColor : '#3A435E'}}>
		<Block row center card space="between" style={styles.header}>
			<Block flex center space="between">
				<Image source={require('./image/logo.png')}/>
		  </Block>
		  		
		  
		</Block>
		
		<ListDevices funcao={navigation}/>
		
	 </Block>
  
);

const styles = StyleSheet.create({
  textHeader:{
	 color : 'white',
	 textAlign: 'center',
	 padding: BASE_SIZE,
	 fontFamily: 'Abel',
	 letterSpacing: BASE_SIZE/5,
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
  header: null,
}

export default Bluetooth;