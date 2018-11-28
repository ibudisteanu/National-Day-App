import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Dimensions, } from 'react-native';
import { Header } from 'react-native-elements';

import Image from 'react-native-scalable-image';

import Layout from "./../layout";

export default class HomeScreen extends React.Component {

  static navigationOptions = {
  headerTitle: 'Pagina Principală',
  headerTintColor: '#ffe500',
  headerStyle: {
      backgroundColor: '#002d72'
  }
  };

  render() {

    const {navigate} = this.props.navigation;

    return (
        <Layout onNavigate={ ( page, params) => this.props.navigation.navigate(page, params) } >

            <View style={ styles.textView } >


                <Image
                    style={ styles.image }
                    width={Dimensions.get('window').width} // height will be calculated automatically
                    source={require('./../../res/ribbon.png')}
                />


            </View>

        </Layout>
    );

  }
}


const styles = StyleSheet.create({
  text: {
      fontSize:25,
  },
  textView: {
      flex: 1,
      alignSelf: "center",
      alignItems: 'center',
      justifyContent: 'center'
  },
  image:{
      marginTop: (Dimensions.get('window').height  / 3),
      flex: 1,
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center'
  }
});
