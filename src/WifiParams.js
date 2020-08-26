import React from 'react';
import { View, NativeEventEmitter, StyleSheet, Image, Alert, } from 'react-native';
import  BleManager  from 'react-native-ble-manager';
import {Text, Block, Card, Button, NavBar, theme, Input} from 'galio-framework';
import { stringToBytes } from "convert-string";

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

const manager = BleManager;
const bleManagerEmitter = new NativeEventEmitter(manager);
var pass = "";
var errorMsg = "";

function setSSID(UUID, service, characteristic, SSID)
{
	if(pass < 3)
	{
		Alert.alert(
			"Erro",
			"Verifique o tamanho da senha",
			[{ text: "OK", onPress: () => console.log("OK Pressed") }],
			{ cancelable: false }
		);
		return;
	}
	var dataStr = "{dotA:D:S:" + SSID + "}";
	const data = stringToBytes(dataStr);
	manager.write(UUID, service, characteristic, data)
		.then(() =>
		{
			getSSID(UUID, service, characteristic, SSID);
		})
		.catch((error) =>
		{
			console.log("Error WiFi");
			console.log(error);
		});
}

//Recebe valores da comunicação bluetooth
function getSSID(UUID, service, characteristic, SSID)
{
	manager.read(UUID, service, characteristic)
		.then((data) =>
		{
			var buffer = "";
		    for(var aux = 0; aux < data.length; aux++)
		    	buffer += String.fromCharCode(data[aux]);

		    console.log("WiFi: " + buffer);
			var ssidResponse = buffer.replace("{dotA:D:S:", "")
			ssidResponse = ssidResponse.replace("}", "")

			if(ssidResponse == SSID)
			{
				setPass(UUID, service, characteristic);
			}
			else
			{
				Alert.alert(
					"Erro",
					"SSID não confere",
					[{ text: "OK", onPress: () => console.log("OK Pressed") }],
					{ cancelable: false }
				);
			}
		})
		.catch((error) => {
			console.log("Error WiFi");
			console.log(error);
		});
}

function setPass(UUID, service, characteristic)
{
	if(pass < 3)
	{
		Alert.alert(
			"Erro",
			"Verifique o tamanho da senha",
			[{ text: "OK", onPress: () => console.log("OK Pressed") }],
			{ cancelable: false }
		);
		return;
	}
	var dataStr = "{dotA:D:P:" + pass + "}";
	const data = stringToBytes(dataStr);
	manager.write(UUID, service, characteristic, data)
		.then(() =>
		{
			getPass(UUID, service, characteristic);
		})
		.catch((error) =>
		{
			console.log("Error WiFi");
			console.log(error);
		});
}

//Recebe valores da comunicação bluetooth
function getPass(UUID, service, characteristic)
{
	manager.read(UUID, service, characteristic)
		.then((data) =>
		{
			var buffer = "";
		    for(var aux = 0; aux < data.length; aux++)
		    	buffer += String.fromCharCode(data[aux]);

		    console.log("WiFi: " + buffer);
			var passResponse = buffer.replace("{dotA:D:P:", "")
			passResponse = passResponse.replace("}", "")

			if(passResponse == pass)
			{
				Alert.alert(
					"Sucesso",
					"Configuração realizada com sucesso",
					[{ text: "OK", onPress: () => console.log("OK Pressed") }],
					{ cancelable: false }
				);
			}
			else
			{
				Alert.alert(
					"Erro",
					"Senha não confere",
					[{ text: "OK", onPress: () => console.log("OK Pressed") }],
					{ cancelable: false }
				);
			}				
				
		})
		.catch((error) => {
			console.log("Error WiFi");
			console.log(error);
		});
			
			
}

const WifiParams = ({ navigation }) => (
	<Block flex fluid style={{backgroundColor : '#3A435E'}}>
		<Block row center card space="between" style={styles.header}>
			<Block flex center space="between">
				<Image source={require('./image/logo.png')}/>
				<Text size={BASE_SIZE * 1.2} style={styles.textHeader}>CONFIRME OS DADOS</Text>
				<Text size={BASE_SIZE*1.1} style={styles.textSSID}>SSID: {navigation.state.params.SSID}</Text>
				<Input placeholder="password" rounded password viewPass 
				style={{ borderColor: COLOR_GREY }} onChangeText={value => {pass=value}}/>
				<Button color="#78A59A" 
					onPress={() => setSSID(navigation.state.params.UUID,
						navigation.state.params.serviceParam, 
						navigation.state.params.characteristicParam,
						navigation.state.params.SSID,)}>
					CONFIRMAR
				</Button>
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