import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';

import Layout from "./../layout";

import Storage from "./../storage";

export default class ProfileScreen extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
        name: '',
        email: '',
        error: '',
        success: '',
    };

  }

  async componentDidMount(){
    this.setState({
        name: await Storage.getName(),
        email: await Storage.getEmail(),
     })
  }

  static navigationOptions = {
      headerTitle: 'Profil',
      headerTintColor: '#ffe500',
      headerStyle: {
          backgroundColor: '#002d72',
      }
  };

  render() {

    return (
        <Layout onNavigate={ this.handleNavigate } >

            <View style={styles.container}>

                <FormInput
                    defaultValue={this.state.name}
                    placeholder='Nume si prenume'
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onChangeText = {this.handleName}
                    inputStyle = {styles.inputStyle}
                />

                <FormInput
                    defaultValue={this.state.email}
                    placeholder='Adresa de email'
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText = {this.handleEmail}
                    inputStyle = {styles.inputStyle}
                />

                <Button
                  onPress={this.handleSave}
                  icon={{name: 'save', type: 'font-awesome'}}
                  title='Salveaza'
                  textContentType="emailAddress"
                  backgroundColor="#002d72"
                  buttonStyle={styles.buttonStyle}
                 />

                <View style={styles.resultContainer}>
                    { this.state.success==="" ? <Text style={styles.error}>{this.state.error}</Text> : <Text style={styles.success}>{this.state.success}</Text>}
                </View>

                <Button
                   onPress={this.handleResetProfile}
                   icon={{name: 'save', type: 'font-awesome'}}
                   title='Reseteaza Profil'
                 />


            </View>

        </Layout>
    );
  }

   handleEmail = (text) => {
      this.setState({ email: text, error: "" })
   };
   handleName = (text) => {
      this.setState({ name: text, error: "" })
   };


   validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
   };

   handleSave = async () => {

        if (this.state.name.length < 3 || this.state.email.length < 3 ){
            this.setState({error: "Date Invalide"});
            return;
        }

       if (this.validateEmail(this.state.email ) ){
           this.setState({ error: "Adresa de email invalida" } );
           return;
       }

        await Storage.setName(this.state.name);
        await Storage.setEmail(this.state.email);


        try {

              let data = {
                  device:  await Storage.getDevice(),
                  name: this.state.name,
                  email: this.state.email,
              };

              let answer = await fetch("http://webdollar-vps2.ddns.net:8084/ranking-update-device", {
                   method: 'POST',
                   body: JSON.stringify( data ),
               });

               answer = await answer.json();

                if ( answer && answer.result ) {

                    this.setState({success: "Profilul tau s-a salvat cu success"})
                    this.props.navigation.navigate('Home', {} )

                } else
                    this.setState({success: "Profilul tau nu a fost salvat"} )


        } catch (err){

            this.setState({error: "Date nu au putut fi salvate: " + err.toString() });

        }


   };

   handleResetProfile = async () => {


        this.setState({
            error: '',
            name: '',
            email: '',
            success: "A fost resetat",
        });

        await Storage.saveDevice();

        await Storage.setName('');
        await Storage.setEmail('');
        await Storage.setQuestions([]);
        await Storage.setLastAnsweredQuestion(0);

   };

   handleNavigate = async ( page, params )=>{

       if (await Storage.getEmail() === '')
           return;

       this.props.navigation.navigate(page, params)

   }

}


const styles = StyleSheet.create({
  inputStyle: {
      borderBottomWidth:1,
      borderBottomColor:'#b7babd',
      padding:0
  },
    buttonStyle:{
      marginTop:20
    },
    resultContainer:{
        marginTop:15,
    },
    success:{
        color:'#34bf49',
        textAlign: 'center',
        fontSize: 20
    },
    error:{
        color:"#ff4c4c",
        textAlign: 'center',
        fontSize: 20
    },
});
