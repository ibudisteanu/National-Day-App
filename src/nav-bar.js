import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { Icon } from 'react-native-elements'

export default class NavBar extends React.Component {
  render() {
    let navigate = this.props.onPress;
    return (
        <View style={styles.container}>

            <Icon raised
                  name='info'
                  type='font-awesome'
                  color='#fff'
                  containerStyle={{backgroundColor: '#3c3940', marginLeft:10, marginRight: 10}}
                  reverseColor={'#504E53'}
                  underlayColor={'#504E53'}
                  onPress={ () => navigate('Home', {param: 0})} />
            <Icon raised
                  name='question-circle'
                  type='font-awesome'
                  color='#fff'
                  containerStyle={{backgroundColor: '#3c3940', marginLeft:10, marginRight: 10}}
                  reverseColor={'#504E53'}
                  underlayColor={'#504E53'}
                  onPress={ () => navigate('Questions', {param: 0})} />
            <Icon raised
                  name='trophy'
                  type='font-awesome'
                  color='#fff'
                  containerStyle={{backgroundColor: '#3c3940', marginLeft:10, marginRight: 10}}
                  reverseColor={'#504E53'}
                  underlayColor={'#504E53'}
                  onPress={ () => navigate('Rankings', {param: 0})} />
            <Icon raised
                  name='user-o'
                  type='font-awesome'
                  color='#fff'
                  containerStyle={{backgroundColor: '#3c3940', marginLeft:10, marginRight: 10}}
                  reverseColor={'#504E53'}
                  underlayColor={'#504E53'}
                  onPress={ () => navigate('Profile', {param: 0})} />

        </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#19171c',
    color:'#ffe500'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
