import React from 'react';
import { View, NativeEventEmitter, StyleSheet, Image, 
	Alert, Dimensions} from 'react-native';
import  BleManager  from 'react-native-ble-manager';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import { stringToBytes } from "convert-string";
import Icon from 'react-native-vector-icons/FontAwesome';

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

var SERIE = "-";
var LOTE = "-";
var CONEXAO = "Sincronizando";

const manager = BleManager;
const bleManagerEmitter = new NativeEventEmitter(manager);
var conectado = 0;
var characteristic = "";
var service = "";

const { height, width } = Dimensions.get('screen');

class CardsTwo extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	render()
	{
		return(

			<Block row fluid>
				<Block card space="between" style={styles.cardTwo}>
					<Icon style={{textAlign: 'center'}} size={40} name={this.props.icone1} color={COLOR_GREY} />
					<Text center style={styles.textCardTitle}>{this.props.titulo1}</Text>
					<Text center style={styles.textCard}>{this.props.subtitulo1}</Text>
				</Block>
				<Block card space="between" style={styles.cardTwo}>
					<Icon style={{textAlign: 'center'}} size={40} name={this.props.icone2} color={COLOR_GREY} />
					<Text center style={styles.textCardTitle}>{this.props.titulo2}</Text>
					<Text center style={styles.textCard}>{this.props.subtitulo2}</Text>
				</Block>
			</Block>
		);
	}
}


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
				conectado = 2;
				SERIE = "-";
				LOTE = "-";
				this.forceUpdate();
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {console.log("OK")}}],
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
				conectado = 2;
				SERIE = "-";
				LOTE = "-";
				this.forceUpdate();
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {console.log("OK")}}],
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
				conectado = 2;
				SERIE = "-";
				LOTE = "-";
				this.forceUpdate();
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {console.log("OK")}}],
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
			    LOTE = LOTE.replace("}", "");
			    conectado = 1;
			    this.forceUpdate();
			    
			    
			})
			.catch((error) => {
				conectado = 2;
				SERIE = "-";
				LOTE = "-";
				this.forceUpdate();
				Alert.alert(
					"Erro",
					"Erro durante a comunicação com o dispositivo.",
					[{ text: "OK", onPress: () => {console.log("OK")}}],
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
					conectado = 2;
					SERIE = "-";
					LOTE = "-";
					this.forceUpdate();
					Alert.alert(
						"Erro",
						"Erro durante a comunicação com o dispositivo.",
						[{ text: "OK", onPress: () => {console.log("OK")}}],
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
			SERIE = "-";
			LOTE = "-";
			this.forceUpdate();
			Alert.alert(
				"Erro",
				"Erro durante a comunicação com o dispositivo.",
				[{ text: "OK", onPress: () => {console.log("OK")}}],
				{ cancelable: false }
			);
			console.log("Erro conect");
			console.log(error);
			this.forceUpdate();
		});
		
	}

	render()
	{
		
		if(conectado == 1)
		{
			return(<Block style={{ flex: 1, alignItems: 'center'}}>
				<CardsTwo icone1="bluetooth-b" titulo1="NOME" subtitulo1={this.params.name}
					icone2="rss" titulo2="CONEXÃO" subtitulo2="Conectado"/>
				<CardsTwo icone1="database" titulo1="LOTE" subtitulo1={LOTE}
					icone2="link" titulo2="SÉRIE" subtitulo2={SERIE}/>
				
				<Button color="#78A59A" center
					onPress={() => this.props.navigation.navigate('ListWifiPage' ,
		 					{UUID : this.params.UUID, 
		 					 serviceParam : service,
		 					 characteristicParam : characteristic,})}
					>CONTINUAR</Button>
				</Block>

			);
		}
		else if(conectado == 2)
		{
			return(<Block style={{ flex: 1, alignItems: 'center'}}>
				<CardsTwo icone1="bluetooth-b" titulo1="NOME" subtitulo1={this.params.name}
					icone2="rss" titulo2="CONEXÃO" subtitulo2="Erro"/>
				<CardsTwo icone1="database" titulo1="LOTE" subtitulo1={LOTE}
					icone2="link" titulo2="SÉRIE" subtitulo2={SERIE}/>
				<Button color="#BE5A38" center
					onPress={() => this.props.navigation.navigate('BluetoothPage')}
					>VOLTAR</Button>
				</Block>
			);		
		}
		else
		{
			return(<Block style={{ flex: 1, alignItems: 'center'}}>
				<CardsTwo icone1="bluetooth-b" titulo1="NOME" subtitulo1={this.params.name}
					icone2="rss" titulo2="CONEXÃO" subtitulo2="Sincronizando"/>
				<CardsTwo icone1="database" titulo1="LOTE" subtitulo1={LOTE}
					icone2="link" titulo2="SÉRIE" subtitulo2={SERIE}/>
				<Button color="#BE5A38" center
					onPress={() => this.props.navigation.navigate('BluetoothPage')}
					>VOLTAR</Button>
				</Block>
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
  textCardTitle:{
  	fontFamily: 'Abel',
  	fontSize: BASE_SIZE*1.2,
  	color: 'black',
  	paddingTop: BASE_SIZE,
  	fontWeight: 'bold',
  },
  textCard:{
  	fontFamily: 'Abel',
  	fontSize: BASE_SIZE*1.2,
  	color: 'black',
  },
  textHeader:{
	 color : 'white',
	 textAlign: 'center',
	 fontFamily: 'Abel',
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
  cardTwo: {
	 borderColor: 'transparent',
	 marginHorizontal: BASE_SIZE,
	 marginVertical: BASE_SIZE / 2,
	 padding: BASE_SIZE,
	 backgroundColor: COLOR_WHITE,
	 shadowOpacity: 0.40,
	 width: width/2 - BASE_SIZE*2,
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