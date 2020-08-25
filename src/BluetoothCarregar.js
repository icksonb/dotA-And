import React from 'react';
import { View, NativeEventEmitter, StyleSheet, Image, Alert } from 'react-native';
import  BleManager  from 'react-native-ble-manager';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import { stringToBytes } from "convert-string";

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

var SERIE = "";
var LOTE = "";

const manager = BleManager;
const bleManagerEmitter = new NativeEventEmitter(manager);
var conectado = 0;
var characteristic = "";
var service = "";
class CarregaBluetooth extends React.Component
{
	constructor(props)
	{
		super(props);
		conectado = 0;
		this.params = this.props.navigation.state.params;
		manager.stopScan();
	}

	//Requisita número de série
	requestSerie()
	{
		const data = stringToBytes("{dotA:G:I}");
		manager.write(this.params.UUID, service, 
		characteristic, data)
			.then(() =>
			{
				this.getSerie();
			})
			.catch((error) =>
			{
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {this.props.navigation.navigate('BluetoothPage')}}],
					{ cancelable: false }
				);
				console.log(error);
			});
	}

	//Recebe valores da comunicação bluetooth
	getSerie()
	{
		manager.read(this.params.UUID, service, characteristic)
			.then((data) =>
			{
				console.log("Serie: " + data);

			    var buffer = "";
			    for(var aux = 0; aux < data.length; aux++)
			    	buffer += String.fromCharCode(data[aux]);

			    SERIE = buffer.replace("{", "");
			    SERIE = SERIE.replace("}", "");

			    this.requestLote();

			    
			})
			.catch((error) => {
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {this.props.navigation.navigate('BluetoothPage')}}],
					{ cancelable: false }
				);
				console.log("Error Serie");
				console.log(error);
			});
	}

	//Requisita número de lote
	requestLote()
	{
		const data = stringToBytes("{dotA:G:L}");
		manager.write(this.params.UUID, service, 
		characteristic, data)
			.then(() =>
			{
				this.getLote();
			})
			.catch((error) =>
			{
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {this.props.navigation.navigate('BluetoothPage')}}],
					{ cancelable: false }
				);
				console.log("Error lote");
				console.log(error);
			});
	}

	//Recebe valores da comunicação bluetooth
	getLote()
	{
		manager.read(this.params.UUID, service, characteristic)
			.then((data) =>
			{
				console.log("Lote: " + data);

			    var buffer = "";
			    for(var aux = 0; aux < data.length; aux++)
			    	buffer += String.fromCharCode(data[aux]);

			    LOTE = buffer.replace("{", "");
			    LOTE = SERIE.replace("}", "");
			    conectado = 1;
			    this.forceUpdate();
			    
			    
			})
			.catch((error) => {
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {this.props.navigation.navigate('BluetoothPage')}}],
					{ cancelable: false }
				);
				console.log("Error lote");
				console.log(error);
			});
	}

	getAllServicesAndCharacteristics()
	{
		var arrayCharacteristics = "";

		manager.retrieveServices(this.params.UUID).
		then((peripheralInfo) => 
		{
			arrayCharacteristics = JSON.stringify(peripheralInfo);
			arrayCharacteristics = arrayCharacteristics.replace("Peripheral info: ", "");
			arrayCharacteristics = arrayCharacteristics.replace("[Array]", "[]");
			arrayCharacteristics = arrayCharacteristics.replace("[Object]", "[]");
			const obj = JSON.parse(arrayCharacteristics);
			const characteristics = obj.characteristics;
			
			for(var aux = 0; aux < characteristics.length; aux++)
			{
				if(characteristics[aux].characteristic.length > 5)
				{
					characteristic = characteristics[aux].characteristic;
					service = characteristics[aux].service;
					break;
				}
			}
			
			//Envia dados para extensão de tempo
			const dadosExtensaoTempo = stringToBytes("{dotA:T:B:E}");
			manager.writeWithoutResponse(this.params.UUID, service, 
			characteristic, dadosExtensaoTempo)
				.then(() =>
				{
					console.log("Extensão OK");
					this.requestSerie();
				})
				.catch((error) =>
				{
					Alert.alert(
						"Erro",
						"Erro durante a comunicação com o dispositivo.",
						[{ text: "OK", onPress: () => {this.props.navigation.navigate('BluetoothPage')}}],
						{ cancelable: false }
					);
					console.log("Error");
					console.log(error);
				});

		}
		);
	}

	componentDidMount()
	{
		manager.connect(this.params.UUID, null)
		.then(() => 
		{
			console.log(conectado);
			this.getAllServicesAndCharacteristics();

		})
		.catch((error) => 
		{
			conectado = 2;
			console.log("Erro conect");
			console.log(error);
			this.forceUpdate();
		});
		
	}

	render()
	{
		if(conectado == 0)
		{
			return(
				<View style={{ flex: 1, alignItems: 'center', 
							backgroundColor : '#3A435E' }} >
					<Text style={{color : 'white'}}>Sincronizando com o dispositivo</Text>
					<Text style={{color : 'white', fontWeight : 'bold',}}>{this.params.name}</Text>
				</View>

			);	
		}
		else if(conectado == 1)
		{
			return(
				<View style={{ flex: 1, alignItems: 'center', 
							backgroundColor : '#3A435E' }} >

					<Text style={{color : 'white', paddingBottom : BASE_SIZE}}>CONFIRA OS DADOS</Text>
					<Text style={{color : 'white'}}>Conectado com o dispositivo</Text>
					<Text style={{color : 'white', fontWeight : 'bold',}}>{this.params.name}</Text>
					<Text style={{color : 'white', paddingTop : BASE_SIZE}}>Número de série:</Text>
					<Text style={{color : 'white', fontWeight : 'bold', paddingBottom : BASE_SIZE}}>{SERIE}</Text>
					<Text style={{color : 'white', paddingTop : BASE_SIZE}}>Número do lote:</Text>
					<Text style={{color : 'white', fontWeight : 'bold', paddingBottom : BASE_SIZE}}>{SERIE}</Text>
					<Button color="success" 
					onPress={() => this.props.navigation.navigate('ListWifiPage' ,
		 					{UUID : this.params.UUID, 
		 					 serviceParam : service,
		 					 characteristicParam : characteristic,})}
					>CONFIRMAR</Button>
				</View>


			);
		}
		else 
		{
			return(
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', 
							backgroundColor : '#3A435E' }} >
					<Text style={{color : 'white'}}>Erro ao conectar com o dispositivo</Text>
					<Text style={{color : 'white', fontWeight : 'bold',}}>{this.params.name}</Text>
				</View>

			);
		}		
	}
}


const BluetoothCarregar = ({ navigation }) => (
	<Block flex fluid style={{backgroundColor : '#3A435E'}}>
		<Block row center card space="between" style={styles.header}>
			<Block flex center space="between">
				<Image source={require('./image/logo.png')}/>
			</Block>
		</Block>
		<CarregaBluetooth navigation={navigation}/>

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

BluetoothCarregar.navigationOptions = {
    header: null,
}


export default BluetoothCarregar;