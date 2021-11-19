import React from 'react';
import {View, StatusBar, Dimensions, StyleSheet, ScrollView, Image, Alert, 
  PermissionsAndroid, NativeModules, AppState, NativeEventEmitter, Linking} from 'react-native';
import {Text, Block, Card, Button, NavBar, theme, Link} from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
/*import BluetoothSerial, {
  BTEvents,
  BTCharsets,
} from 'react-native-bluetooth-classic';*/
import BluetoothSerial, {
  withSubscription
} from "react-native-bluetooth-serial-next";
import VersaoApp from './AppVersao';

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

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
var retorno = 0;
class ListDevices extends React.Component
{

	constructor(props) 
	{
		super(props);
		retorno = 0; //Monitora retorno
		console.log("Construtor");
	}
  	
	async startScan()
	{
		try
		{
			let versaoAntiga = false;
			versaoAntiga = await VersaoApp();

			if (versaoAntiga) {
				Alert.alert(
					"Versão desatualizada",
					"sta versão do aplicativo está desatualizada. Por favor, atualize o aplicativo.",
					[{ text: "Atualizar", onPress: () => { 
						Linking.openURL('https://play.google.com/store/apps/details?id=com.dota') 
					}}],
				);

				return;
			}
			
			console.log("List");

			const devicesSerial = await BluetoothSerial.list();	

			var peripherals = devicesSerial;
			for(var aux=0; aux<peripherals.length; aux++)
			{
				if(peripherals[aux].name.indexOf("dotA") >= 0)
				{
					var isConnected = false; 
					try
					{
						var teste = await BluetoothSerial.connect(peripherals[aux].id);						
						isConnected = BluetoothSerial.isConnected();
					}
					catch (e)
					{
						console.log(e);
					}
					
					if(isConnected)
					{
						if(retorno == 0)
						{
							devices = [];
							devices = [{'name':  peripherals[aux].name, 
										'UUID' :  peripherals[aux].id}];
							retorno = 1;
						}
						else
						{
							verifica = false;
							if(devices)
							{
								devices.map(nameDevice =>
								{
									if(nameDevice.name ==  peripherals[aux].name)
										verifica = true;
								});	
							}
							
							//Verifica se o elemento já existe na lista
							if(verifica == false)
							{
								devices.push({'name':  peripherals[aux].name, 
									'UUID' :  peripherals[aux].id});
							}	
						}
						await BluetoothSerial.disconnect();
					}

					

					
				}
				this.forceUpdate();

			}

			setTimeout(() => {this.verificaListaBluetooth()}, 25000);

		}
		catch (e)
		{
			console.log("Error");
			console.log(e);
			Alert.alert(
				"Scan Error",
				"Error",
				[{ text: "OK", onPress: () => {console.log("OK")}}],
				{ cancelable: false }
			);
		}
		
	}

	async componentDidMount()
	{
		
		console.log("result");
		await BluetoothSerial.requestEnable();

		console.log("Enable");
		await BluetoothSerial.isEnabled();

		//Verifica permissão
		PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).
		then((result) => 
		{
			if (result) //Se permissão for OK
			{
				
				
				try
				{
					this.startScan();
				}
				catch (e)
				{
					console.log("Error");
					console.log(e);
				}
				
				
		 	}
	 		else
	 		{
	 			//Requisita permissão
				PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).
				then((result) => 
				{
					if (result) //Permissão concedida
					{
						try
						{
							this.startScan();
						}
						catch (e)
						{
							console.log("Error");
							console.log(e);
						}
					}
					else 
					{
						Alert.alert(
							"Erro",
							"Permissão não encontrada.",
							[{ text: "OK", onPress: () => {console.log("OK")}}],
							{ cancelable: false }
						);
						return "Error";
					}
				});
	 		}
		});
	}

	verificaListaBluetooth()
	{
		if(retorno == 0)
			retorno = 2;

		this.forceUpdate();
	}

	printCards()
	{
		if(retorno == 1 && devices)
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
		retorno = 0;
		//Aciona a função para verificar se dispositivos foram encontrados
		setTimeout(() => {this.verificaListaBluetooth()}, 25000);
		this.startScan();		
		this.forceUpdate();
	}

	render()
	{
		if(retorno == 0)
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
		else if(retorno == 2)
		{
			return(
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Button round center style={{ width: 40, height: 40}} color={COLOR_GREY} 
							onPress={() => this.refresh()}>
			  			<Icon size={22} name="refresh" color={COLOR_WHITE} />
		  			</Button>
					<Text size={BASE_SIZE * 1.125} style={styles.textHeader}>
						Nenhum dispositivo encontrado.
						Por favor, verifique o estado do Bluetooth e clique no botão acima
						para realizar um novo scan dos dispositivos.</Text>
				</View>
			);	
		}
		else
		{
			return(
				<ScrollView style={{flex: 1}}>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<Button round center style={{ width: 40, height: 40}} color={COLOR_GREY} 
								onPress={() => this.refresh()}>
				  			<Icon size={22} name="refresh" color={COLOR_WHITE} />
			  			</Button>
					</View>
		  			<Text size={BASE_SIZE * 1.125} style={styles.textHeader}>SELECIONE O DISPOSITIVO</Text>
					{this.printCards()}				
				</ScrollView>
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