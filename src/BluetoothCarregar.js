import React from 'react';
import { View, NativeEventEmitter, StyleSheet, Image, 
	Alert, Dimensions} from 'react-native';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import { stringToBytes } from "convert-string";
import Icon from 'react-native-vector-icons/FontAwesome';
/*import BluetoothSerial, {
  BTEvents,
  BTCharsets,
} from 'react-native-bluetooth-classic';*/
import BluetoothSerial, {
  withSubscription
} from "react-native-bluetooth-serial-next";

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

var SERIE = "-";
var LOTE = "-";
var CONEXAO = "Sincronizando";
var MAC = "-";

var conectado = 0;
var characteristic = "";
var service = "";
var UUID = "";
var tempoAtualizacao = 0;
var flagTimer = false;
const { height, width } = Dimensions.get('screen');

async function atualizaBLE()
{
	const tempoAgora = Date.parse(new Date());
	//Não chegou no tempo e enviar a nova solicitação
	if(tempoAgora < tempoAtualizacao)
	{
		//Habilita para mais 30s
		setTimeout(() => {atualizaBLE()}, 1000*30);
		return;
	}
	try
	{
		//Envia dados para extensão de tempo
		await BluetoothSerial.write("{dotA:T:B:E}");
		await BluetoothSerial.readEvery
		(
			(data, intervalId) => 
			{
				
				clearInterval(intervalId); 
				var buffer = data.replace("\r", "");
				buffer = buffer.replace("\n", "");
				console.log("Extend time");
				console.log(buffer);
				if(buffer == "{CFGOK}")
				{
					//Espera 4 minutos
					tempoAtualizacao = Date.parse(new Date()) + 4*60*1000;
					setTimeout(() => {atualizaBLE()}, 1000*30);
				}
				else
				{
					flagTimer = false;
				}
				
			}, 
			1000, "}"
		);
	}
	catch(e)
	{
		flagTimer = false;
		console.log("Error atualiza BLE");
	}
}


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
	}

	async getMAC()
	{
		try
		{
			await BluetoothSerial.clear();
			await BluetoothSerial.write("{dotA:T:S:M}");
			await BluetoothSerial.readEvery
			(
				(data, intervalId) => 
				{
					console.log("MAC");
					console.log(data);
					clearInterval(intervalId); 
					MAC = data.replace("{", "");
					MAC = MAC.replace("}", "");
					MAC = MAC.replace("\r", "");
					MAC = MAC.replace("\n", "");

					this.forceUpdate();
				}, 1000, "}"
			);
		}
		catch(e)
		{
			this.forceUpdate();
			console.log("Error");
			console.log(e);
		}

	}

	async getLote()
	{
		try
		{
			await BluetoothSerial.clear();
			await BluetoothSerial.write("{dotA:G:L}\r\n");
			await BluetoothSerial.readEvery
			(
				(data, intervalId) => 
				{
					console.log("Lote");
					console.log(data);
					clearInterval(intervalId); 
					LOTE = data.replace("{", "");
					LOTE = LOTE.replace("}", "");
					LOTE = LOTE.replace("\r", "");
					LOTE = LOTE.replace("\n", "");

					if(LOTE.length <= 1)
					{
						conectado = 2;
						SERIE = "-";
						LOTE = "-";
					}
					
					this.forceUpdate();
					this.getMAC();
				}, 1000, "\r\n"
			);
		}
		catch(e)
		{
			conectado = 2;
			SERIE = "-";
			LOTE = "-";
			this.forceUpdate();
			console.log("Error");
			console.log(e);
		}

	}

	async getSerie()
	{
		try
		{
			await BluetoothSerial.clear();
			await BluetoothSerial.write("{dotA:G:I}\r\n");
			await BluetoothSerial.readEvery
			(
				(data, intervalId) => 
				{
					console.log("Serie");
					clearInterval(intervalId); 
					SERIE = data.replace("{", "");
					SERIE = SERIE.replace("}", "");
					SERIE = SERIE.replace("\r", "");
					SERIE = SERIE.replace("\n", "");
					if(SERIE.length <= 1)
					{
						conectado = 2;
						SERIE = "-";
						LOTE = "-";
						this.forceUpdate();
					}
					else
						this.getLote();
				}, 1000, "\r\n"
			);
		}
		catch(e)
		{
			conectado = 2;
			SERIE = "-";
			LOTE = "-";
			this.forceUpdate();
			console.log("Error");
			console.log(e);
		}
	}

	async componentDidMount()
	{
		try
		{
			const connected = await BluetoothSerial.connect(this.params.UUID);

			const isConnected = await BluetoothSerial.isConnected();

			if(isConnected)
			{
				tempoAtualizacao = Date.parse(new Date()) + 4*60*1000;

				console.log("Conectado");
				conectado = 1;
				await BluetoothSerial.write("{dotA:T:B:E}");
				await BluetoothSerial.readEvery
				(
					(data, intervalId) => 
					{
						console.log(data); 
						clearInterval(intervalId); 
						var buffer = data.replace("\r", "");
						buffer = buffer.replace("\n", "");
						if(buffer == "{CFGOK}")
						{
							if(flagTimer == false)
							{
								setTimeout(() => {atualizaBLE()}, 1000*30);
								flagTimer = true;
							}
							this.getSerie();
						}
						else
						{
							conectado = 2;
							SERIE = "-";
							LOTE = "-";
							this.forceUpdate();
						}
					}, 
					1000, "}"
				);

			}
			else
			{
				conectado = 2;
				SERIE = "-";
				LOTE = "-";
				this.forceUpdate();
			}


		}
		catch (e)
		{
			flagTimer = false;
			conectado = 2;
			SERIE = "-";
			LOTE = "-";
			this.forceUpdate();
			console.log("Error");
			console.log(e);
		}
		
	}

	render()
	{
		
		if(conectado == 1)
		{
			return(<Block style={{ flex: 1, alignItems: 'center'}}>
				<CardsTwo icone1="bluetooth-b" titulo1="NOME" subtitulo1={this.params.name}
					icone2="rss" titulo2="ESTADO" subtitulo2="Conectado"/>
				<CardsTwo icone1="database" titulo1="LOTE/SÉRIE" subtitulo1={LOTE+'/'+SERIE}
					icone2="link" titulo2="MAC" subtitulo2={MAC}/>
				<Button color="#78A59A" center
					onPress={() => this.props.navigation.navigate('ListWifiPage' ,
		 					{UUID : this.params.UUID,})}>CONTINUAR
				</Button>
				<Button color="#BE5A38" center
					onPress={() => this.props.navigation.navigate('BluetoothPage')}
					>VOLTAR
				</Button>
				
				</Block>

			);
		}
		else if(conectado == 2)
		{
			return(<Block style={{ flex: 1, alignItems: 'center'}}>
				<CardsTwo icone1="bluetooth-b" titulo1="NOME" subtitulo1={this.params.name}
					icone2="rss" titulo2="ESTADO" subtitulo2="Erro"/>
				<CardsTwo icone1="database" titulo1="LOTE/SÉRIE" subtitulo1={LOTE+'/'+SERIE}
					icone2="link" titulo2="MAC" subtitulo2={MAC}/>
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
					icone2="rss" titulo2="ESTADO" subtitulo2="Sincronizando"/>
				<CardsTwo icone1="database" titulo1="LOTE/SÉRIE" subtitulo1={LOTE+'/'+SERIE}
					icone2="link" titulo2="MAC" subtitulo2={MAC}/>
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