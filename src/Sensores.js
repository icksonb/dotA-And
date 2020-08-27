import React from 'react';
import { View, NativeEventEmitter, StyleSheet, Image, 
	Alert, Dimensions, ScrollView} from 'react-native';
import  BleManager  from 'react-native-ble-manager';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import { stringToBytes } from "convert-string";
import Icon from 'react-native-vector-icons/FontAwesome';
import RNRestart from 'react-native-restart';

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

var temperaturas = ['-', '-', '-'];
var tensao = "-";
var portas = ['-', '-', '-'];
var botao = "-";
var controle = 0;

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


class CarregaSensores extends React.Component
{
	constructor(props)
	{
		super(props);
		this.params = this.props.navigation.state.params;
		console.log("constructor Sensores");
	}

	recarregaLeituras()
	{
		temperaturas = ['-', '-', '-'];
		tensao = "-";
		portas = ['-', '-', '-'];
		botao = "-";
		controle = 0;
		this.forceUpdate();
		this.escritaBluetooth();
	}

	escritaBluetooth()
	{
		var dadosEscrita = "";
		if(controle == 0)
			dadosEscrita = stringToBytes("{dotA:V:T:0}");
		else if(controle == 1)
			dadosEscrita = stringToBytes("{dotA:V:T:1}");
		else if(controle == 2)
			dadosEscrita = stringToBytes("{dotA:V:T:2}");
		else if(controle == 3)
			dadosEscrita = stringToBytes("{dotA:V:V:0}");
		else if(controle == 4)
			dadosEscrita = stringToBytes("{dotA:V:D:0}");
		else if(controle == 5)
			dadosEscrita = stringToBytes("{dotA:V:D:1}");
		else if(controle == 6)
			dadosEscrita = stringToBytes("{dotA:V:D:2}");
		else if(controle == 7)
			dadosEscrita = stringToBytes("{dotA:V:P:0}");

		manager.write(this.params.UUID, this.params.serviceParam, 
		this.params.characteristicParam, dadosEscrita)
			.then(() =>
			{
				this.leituraBluetooth();
			})
			.catch((error) =>
			{
				
				temperaturas = ['-', '-', '-'];
				tensao = "-";
				portas = ['-', '-', '-'];
				botao = "-";
				controle = 0;
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

	leituraBluetooth()
	{
		manager.read(this.params.UUID, this.params.serviceParam, 
		this.params.characteristicParam)
			.then((data) =>
			{
				console.log("Lote: " + data);

			    var buffer = "";
			    for(var aux = 0; aux < data.length; aux++)
			    	buffer += String.fromCharCode(data[aux]);

			    buffer = buffer.replace("{", "");
			    buffer = buffer.replace("}", "");

			    if(controle == 0)
			    	temperaturas[0] = buffer + "ºC";
			    else if(controle == 1)
			    	temperaturas[1] = buffer + "ºC";
			    else if(controle == 2)
			    	temperaturas[2] = buffer + "ºC";
			    else if(controle == 3)
			    	tensao = buffer + "V";
			    else if(controle == 4 && buffer == "0")
			    	portas[0] = "Closed";
			    else if(controle == 4 && buffer == "1")
			    	portas[0] = "Open";
			    else if(controle == 5 && buffer == "0")
			    	portas[1] = "Closed";
			    else if(controle == 5 && buffer == "1")
			    	portas[1] = "Open";
			    else if(controle == 6 && buffer == "0")
			    	portas[2] = "Closed";
			    else if(controle == 6 && buffer == "1")
			    	portas[2] = "Open";
			    else if(controle == 7 && buffer == "0")
			    	botao = "Pushed";
			    else if(controle == 7 && buffer == "1")
			    	botao = "Normal";
			    
			    controle++;
			    
			    if(controle >= 8)
			    {
			    	this.forceUpdate();
			    	controle = 0;
			    }
			    else
			    	this.escritaBluetooth();
			    
			    
			})
			.catch((error) => 
			{
				temperaturas = ['-', '-', '-'];
				tensao = "-";
				portas = ['-', '-', '-'];
				botao = "-";
				controle = 0;
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

	componentDidMount()
	{
		this.escritaBluetooth();
	}
	
	finalizaApp()
	{
		const dadosEscrita = stringToBytes("{dotA:T:B:X}");
		manager.write(this.params.UUID, this.params.serviceParam, 
		this.params.characteristicParam, dadosEscrita)
			.then(() =>
			{
				manager.disconnect(this.params.UUID)
					.then(() => {
						// Success code
						console.log("Disconnected");
						RNRestart.Restart();
					})
					.catch((error) => 
					{
						// Failure code
						console.log(error);
						RNRestart.Restart();
					});
			})
			.catch((error) =>
			{
				
				console.log("Error");
				console.log(error);
				RNRestart.Restart();
			});

		
	}

	render()
	{
		
			return(<Block style={{ flex: 1, alignItems: 'center'}}>
				<CardsTwo icone1="thermometer-half" titulo1="TEMPERATURA-1" subtitulo1={temperaturas[0]}
					icone2="thermometer-half" titulo2="TEMPERATURA-2" subtitulo2={temperaturas[1]}/>
				<CardsTwo icone1="thermometer-half" titulo1="TEMPERATURA-3" subtitulo1={temperaturas[2]}
					icone2="plug" titulo2="TENSÃO" subtitulo2={tensao}/>
				<CardsTwo icone1="building" titulo1="PORTA-1" subtitulo1={portas[0]}
					icone2="building" titulo2="PORTA-2" subtitulo2={portas[1]}/>
				<CardsTwo icone1="building" titulo1="PORTA-3" subtitulo1={portas[2]}
					icone2="warning" titulo2="BOTÃO" subtitulo2={botao}/>
				<Button color="#BE5A38" center
					onPress={() => this.recarregaLeituras()}
					>RECARREGAR</Button>
				<Button color="#78A59A" center
					onPress={() => this.finalizaApp()}
					>FINALIZAR</Button>
				</Block>

			);
		
		
	}

}


const Sensores = ({ navigation }) => (
	<ScrollView>
		<Block flex fluid style={{backgroundColor : '#3A435E'}}>
			<Block row center card space="between" style={styles.header}>
				<Block flex center space="between">
					<Image source={require('./image/logo.png')}/>
				</Block>
			</Block>
			
			<CarregaSensores navigation={navigation}/>

		</Block>
	</ScrollView>
);

const styles = StyleSheet.create({
  textCardTitle:{
  	fontFamily: 'Abel',
  	fontSize: BASE_SIZE*0.8,
  	color: 'black',
  	paddingTop: BASE_SIZE,
  	fontWeight: 'bold',
  },
  textCard:{
  	fontFamily: 'Abel',
  	fontSize: BASE_SIZE*1.4,
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

Sensores.navigationOptions = {
    header: null,
}


export default Sensores;