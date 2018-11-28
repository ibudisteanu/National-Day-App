import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ScrollView} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';

import NavBar from "./nav-bar";


export default class HomeScreen extends React.Component {

  render() {

    return (

        <View  style={styles.container} >

            <ScrollView style={styles.content}>
                {this.props.children}
            </ScrollView>

            <View>

                <View style={styles.buttons} >
                    <NavBar onPress={ ( page, params) => this.props.onNavigate(page, params) } />
                </View>

            </View>

        </View>

    );
  }


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
     // flex: 1,
     // height:'auto'
  },
  buttons: {

  },
  ribbon: {
      marginTop: 10,
      justifyContent: 'flex-end',
      marginBottom: 10
  }
});
