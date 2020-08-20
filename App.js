/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, StatusBar, Dimensions, StyleSheet, ScrollView} from 'react-native';
import {Text, Block, Card, Button, NavBar, theme} from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';

const cards = {
    title: 'Tasks',
    subtitle: '1 completed tasks',
    icon: 'list-bullet',
    iconFamily: 'Galio'
};

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
  render(){
    return (
        <Block row center card shadow space="between" style={styles.card} key={this.props.title}>
          
          <Block flex>
            <Text size={BASE_SIZE * 1.125}>{this.props.title}</Text>
            <Text size={BASE_SIZE * 0.875} muted>{this.props.subtitle}</Text>
          </Block>
          <Button style={styles.right}>
            <Icon size={18} name={this.props.icon} color={COLOR_GREY} />
          </Button>
        </Block>
    );
  }
}


const App: () => React$Node = () => {

  const { width } = Dimensions.get("screen");

  return (
    
    <Block flex fluid style={{backgroundColor : '#3A435E'}}>
      <Block row center card space="between" style={styles.header}>
          
        <Block flex>
          <Text size={BASE_SIZE * 1.125} style={styles.textHeader}>SELECIONE O DISPOSITIVO</Text>
        </Block>
      </Block>

      <ScrollView style={{ flex: 1 }}>

        <RenderCard title="teste" subtitle="Teste2" icon="home"/>
        <RenderCard title="testes" subtitle="Teste2" icon="list-bullet"/>
      </ScrollView>
    </Block>
  );
};

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

export default App;