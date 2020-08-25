import React from 'react';
import {View, StatusBar, Dimensions, StyleSheet, ScrollView, Image, Alert,
  PermissionsAndroid, NativeModules, AppState, NativeEventEmitter} from 'react-native';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import WifiManager from "react-native-wifi-reborn";

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ['#6B84CA', '#8F44CE'];
const GRADIENT_PINK = ['#D442F8', '#B645F5', '#9B40F8'];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

class ListWifiCards extends React.Component {

	constructor(props)
	{
		super(props);

	}

	render()
	{
		return (
			<Block row center card shadow space="between" style={styles.card} key={this.props.title}>
				<Icon style={styles.right} size={22} name="wifi" color={COLOR_GREY} />
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
let redes = new Array();

class ListDevices extends React.Component
{

	constructor(props) 
	{
		super(props);
		this.retorno = false; //Monitora retorno
		this.params = this.props.navigation.state.params;
	}
  	
  	componentDidMount()
	{
		
		//Verifica permissão
		PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).
		then((result) => 
		{
			if (result) //Se permissão for OK
			{
				WifiManager.loadWifiList().then(
				nets =>
				{
					this.retorno = true;
					var arrayJson = JSON.parse(nets);
					for(var aux=0; aux<arrayJson.length; aux++)
					{
						console.log(arrayJson[aux].SSID)
						redes.push(arrayJson[aux].SSID);
						this.forceUpdate();		
					}
					
				},
				error =>
				{
					Alert.alert(
						"Erro",
						"Verifique suas permissões",
						[{ text: "OK", onPress: () => console.log("OK Pressed") }],
						{ cancelable: false }
					);
				});

				
		 	}
	 		else
	 		{
	 			//Requisita permissão
				PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).
				then((result) => 
				{
					if (result) //Permissão concedida
					{
						WifiManager.loadWifiList().then(
						nets =>
						{
							this.retorno = true;
							var arrayJson = JSON.parse(nets);
							for(var aux=0; aux<arrayJson.length; aux++)
								redes.push(arrayJson[aux].SSID);
							this.forceUpdate();
							
						},
						error =>
						{
							console.log("Falhou");
							console.log(error);
						});
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
		if(this.retorno == true)
	 	{
	 		return redes.map(nameDevice =>
	 		{
	 			if(nameDevice)
	 			{
		 			return(
		 				<ListWifiCards title={nameDevice} subtitle="Disponível"
		 					funcao={() => this.props.navigation.navigate('WifiParamsPage' ,
		 					{UUID : this.params.UUID, 
		 					 serviceParam : this.params.serviceParam,
		 					 characteristicParam : this.params.characteristicParam,
		 					 SSID: nameDevice, })}/>
		 			);
		 		}
	 		})
	 	}
	}

	render()
	{
		if(this.retorno == false)
		{
			return(
				<ScrollView style={{ flex: 1 }}>
					<Text style={styles.textHeader}>
						Buscando redes...</Text>
				</ScrollView>
			);	
		}
		else
		{
			return(
				<ScrollView style={{ flex: 1 }}>
					{this.printCards()}				
				</ScrollView>
			);	
		}
	}
}

const { width } = Dimensions.get("screen");

const ListWifi = ({ navigation }) => (
 
	 <Block flex fluid style={{backgroundColor : '#3A435E'}}>
		<Block row center card space="between" style={styles.header}>
			 
		  <Block center flex>
			<Image source={require('./image/logo.png')}/>
			<Text size={BASE_SIZE * 1.125} style={styles.textHeader}>SELECIONE UMA REDE</Text>
		  </Block>
		</Block>
		
		  <ListDevices navigation={navigation}/>
		
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

ListWifi.navigationOptions = {
    header: null,
}

export default ListWifi;