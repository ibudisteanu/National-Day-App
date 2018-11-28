import React, {Component} from 'react';
import { Alert, Platform, StyleSheet, Text, View, Button, Dimensions, AsyncStorage} from 'react-native';
import { Header } from 'react-native-elements';

import firebase from 'react-native-firebase';

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

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners(); //add this line
    }

    //Remove listeners allocated in createNotificationListeners()
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem( 'fcmToken' );
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }


    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log(JSON.stringify(message));
        });
    }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
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
