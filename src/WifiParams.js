import React from 'react';
import { View, NativeEventEmitter, StyleSheet, Image, Alert, } from 'react-native';
import {Text, Block, Card, Button, NavBar, theme, Input} from 'galio-framework';
import { stringToBytes } from "convert-string";
import BluetoothSerial, {
  withSubscription
} from "react-native-bluetooth-serial-next";
const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

var pass = "";
var passRep = "";
var errorMsg = "";
var retornoBotoes = true;

class Botoes extends React.Component
{
	constructor(props)
	{
		super(props);
		this.navigation = this.props.navigation;
		this.params = this.props.navigation.state.params;

	}

	setConfigs(navigation, UUID, SSID)
	{
		retornoBotoes = false;
		this.forceUpdate();
		this.setSSID(navigation, UUID, SSID);
	}

	async setSSID(navigation, UUID, SSID)
	{
		if (pass != passRep)
		{
			Alert.alert(
				"Erro - as senhas são diferentes",
				"Por favor, informe as duas senhas iguais.",
				[{ text: "OK", onPress: () => console.log("OK Pressed") }],
				{ cancelable: false }
			);
			retornoBotoes = true;
			this.forceUpdate();
		} else {
			try
			{
				await BluetoothSerial.clear();
				var dataStr = "{dotA:D:S:" + SSID + "}\r\n";
				await BluetoothSerial.write(dataStr);
				await BluetoothSerial.readEvery
				(
					(data, intervalId) => 
					{
						clearInterval(intervalId); 
						this.getSSID(navigation, UUID, SSID);
					}, 500, "}"
				);
			}
			catch(e)
			{
				console.log("Error");
				console.log(e);
				Alert.alert(
					"Erro inesperado",
					"Ocorreu um erro ao se comunicar com o dispositivo.",
					[{ text: "OK", onPress: () => console.log("OK") }],
					{ cancelable: false }
				);
				retornoBotoes = true;
				this.forceUpdate();
			}	
		}
		
		
		
	}

	//Recebe valores da comunicação bluetooth
	async getSSID(navigation, UUID, SSID)
	{
		try
		{
			await BluetoothSerial.clear();
			var dataStr = "{dotA:G:S}\r\n";
			await BluetoothSerial.write(dataStr);
			await BluetoothSerial.readEvery
			(
				(data, intervalId) => 
				{
					clearInterval(intervalId);
					var ssidRes = data.replace("{", "");
					ssidRes = ssidRes.replace("}", "");
					ssidRes = ssidRes.replace("\r", "");
					ssidRes = ssidRes.replace("\n", "");
					console.log(ssidRes);
					console.log(SSID);
					if(SSID == ssidRes)
					{
						this.setPASS(navigation, UUID, SSID);
					}
					else
					{
						Alert.alert(
							"Erro inesperado",
							"O SSID não corresponde ao configurado.",
							[{ text: "OK", onPress: () => console.log("OK") }],
							{ cancelable: false }
						);
						retornoBotoes = true;
						this.forceUpdate();
					}
				}, 500, "\r\n"
			);
		}
		catch(e)
		{
			console.log("Error");
			console.log(e);
			Alert.alert(
				"Erro inesperado",
				"Ocorreu um erro ao se comunicar com o dispositivo.",
				[{ text: "OK", onPress: () => console.log("OK") }],
				{ cancelable: false }
			);
			retornoBotoes = true;
			this.forceUpdate();
		}
	}

	async setPASS(navigation, UUID, SSID)
	{
		if (pass != passRep) 
		{
			Alert.alert(
				"Erro - as senhas são diferentes",
				"Por favor, informe as duas senhas iguais.",
				[{ text: "OK", onPress: () => console.log("OK Pressed") }],
				{ cancelable: false }
			);
			retornoBotoes = true;
			this.forceUpdate();
			return;
		}

		try
		{
			await BluetoothSerial.clear();
			var dataStr = "{dotA:D:P:" + pass + "}\r\n";
			await BluetoothSerial.write(dataStr);
			await BluetoothSerial.readEvery
			(
				(data, intervalId) => 
				{
					clearInterval(intervalId); 
					this.getPass(navigation, UUID, SSID);
				}, 500, "}"
			);
		}
		catch(e)
		{
			console.log("Error");
			console.log(e);
			Alert.alert(
				"Erro inesperado",
				"Ocorreu um erro ao se comunicar com o dispositivo.",
				[{ text: "OK", onPress: () => console.log("OK") }],
				{ cancelable: false }
			);
			retornoBotoes = true;
			this.forceUpdate();
		}
	}

	//Recebe valores da comunicação bluetooth
	async getPass(navigation, UUID, SSID)
	{
		try
		{
			await BluetoothSerial.clear();
			var dataStr = "{dotA:G:P}\r\n";
			await BluetoothSerial.write(dataStr);
			await BluetoothSerial.readEvery
			(
				(data, intervalId) => 
				{
					clearInterval(intervalId);
					var passResponse = data.replace("{", "");
					passResponse = passResponse.replace("}", "");
					passResponse = passResponse.replace("\r", "");
					passResponse = passResponse.replace("\n", "");
					console.log(pass);
					console.log(passResponse);
					if(pass == passResponse)
					{
						Alert.alert(
							"Sucesso",
							"Configuração realizada com sucesso",
							[{ text: "OK", onPress: () => 
									this.navigation.navigate('SensoresPage' ,
				 					{UUID : UUID, }) }],
							{ cancelable: false }
						);
						retornoBotoes = true;
						this.forceUpdate();
					}
					else
					{
						Alert.alert(
							"Erro",
							"Senha não confere",
							[{ text: "OK", onPress: () => console.log("OK Pressed") }],
							{ cancelable: false }
						);
						retornoBotoes = true;
						this.forceUpdate();
					}			
				}, 500, "\r\n"
			);
		}
		catch(e)
		{
			console.log("Error");
			console.log(e);
			Alert.alert(
				"Erro inesperado",
				"Ocorreu um erro ao se comunicar com o dispositivo.",
				[{ text: "OK", onPress: () => console.log("OK") }],
				{ cancelable: false }
			);
			retornoBotoes = true;
			this.forceUpdate();
		}
				
	}
	render()
	{
		if(retornoBotoes == true)
		{
			return(<View>
				<Button color="#78A59A" 
					onPress={() => this.setConfigs(this.navigation, 
						this.navigation.state.params.UUID,
						this.navigation.state.params.SSID)}>
					CONFIRMAR
				</Button>
				<Button color="#BE5A38" 
					onPress={() => this.navigation.navigate('ListWifiPage')}>
					VOLTAR
				</Button>
				</View>
			);	
		}
		else
		{
			return(<Text size={BASE_SIZE*1.1} style={styles.textSSID}>
				Aguarde, sincronizando dados...</Text>);	
		}
		
	}
}

const WifiParams = ({ navigation }) => (
	<Block flex fluid style={{backgroundColor : '#3A435E'}}>
		<Block row center card space="between" style={styles.header}>
			<Block flex center space="between">
				<Image source={require('./image/logo.png')}/>
				<Text size={BASE_SIZE * 1.2} style={styles.textHeader}>CONFIRME OS DADOS</Text>
				<Text size={BASE_SIZE*1.1} style={styles.textSSID}>SSID: {navigation.state.params.SSID}</Text>
				<Input placeholder="Senha" rounded style={{ borderColor: COLOR_GREY }} onChangeText={value => {pass=value}}/>
				<Input placeholder="Repita a senha" rounded style={{ borderColor: COLOR_GREY }} onChangeText={value => {passRep=value}}/>
				
				<Botoes navigation={navigation}/>
				
			</Block>
		</Block>

	</Block>

);

const styles = StyleSheet.create({
  textSSID:{
	 color : 'white',
	 textAlign: 'center',
	 padding: BASE_SIZE,
	 fontFamily: 'Abel',
	 letterSpacing: BASE_SIZE/5,
	 fontWeight: 'bold',
  },
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

WifiParams.navigationOptions = {
    header: null,
}


export default WifiParams;