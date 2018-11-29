import React, {Component} from 'react';
import { Alert, Platform, StyleSheet, Text, View, Button, Dimensions, AsyncStorage} from 'react-native';
import { Header } from 'react-native-elements';

import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

import Image from 'react-native-scalable-image';

import Layout from "./../layout";

export default class HomeScreen extends React.Component {


    constructor(props) {

        super(props);
        this.state = {
            status: '',
        };

    }

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


                <Text>{this.state.status}</Text>

                <Image
                    style={ styles.image }
                    width={Dimensions.get('window').width} // height will be calculated automatically
                    source={require('./../../res/ribbon_2.png')}
                />


            </View>

        </Layout>
    );

  }

    // async componentDidMount() {
    //
    //     this.setState({status: "Started"});
    //
    //     const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    //
    //     this.setState({status: "Started Notification"});
    //
    //     if (notificationOpen) {
    //         const action = notificationOpen.action;
    //         const notification: Notification = notificationOpen.notification;
    //         var seen = [];
    //         alert(JSON.stringify(notification.data, function(key, val) {
    //             if (val != null && typeof val == "object") {
    //                 if (seen.indexOf(val) >= 0) {
    //                     return;
    //                 }
    //                 seen.push(val);
    //             }
    //             return val;
    //         }));
    //     }
    //
    //     this.setState({status: "Notification Open " + notificationOpen.toString() });
    //
    //     const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
    //         .setDescription('My apps test channel');
    //
    //     this.setState({status: "Creating Channel"});
    //
    //     // Create the channel
    //     firebase.notifications().android.createChannel(channel);
    //     this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
    //         // Process your notification as required
    //         // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    //     });
    //
    //     this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
    //         // Process your notification as required
    //         notification
    //             .android.setChannelId('test-channel')
    //             .android.setSmallIcon('ic_launcher');
    //         firebase.notifications()
    //             .displayNotification(notification);
    //
    //     });
    //
    //     this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
    //         // Get the action triggered by the notification being opened
    //         const action = notificationOpen.action;
    //         // Get information about the notification that was opened
    //         const notification: Notification = notificationOpen.notification;
    //         var seen = [];
    //         alert(JSON.stringify(notification.data, function(key, val) {
    //             if (val != null && typeof val == "object") {
    //                 if (seen.indexOf(val) >= 0) {
    //                     return;
    //                 }
    //                 seen.push(val);
    //             }
    //             return val;
    //         }));
    //         firebase.notifications().removeDeliveredNotification(notification.notificationId);
    //
    //     });
    //
    // }
    //
    // //Remove listeners allocated in createNotificationListeners()
    // componentWillUnmount() {
    //     this.notificationDisplayedListener();
    //     this.notificationListener();
    //     this.notificationOpenedListener();
    // }


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


    async createNotificationListeners(){

        /*
        * Triggered when a particular notification has been received in foreground
        * */

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            // Process your notification as required
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher')
                .android.setPriority(firebase.notifications.Android.Priority.Max)
                .setSound('default');
            firebase.notifications()
                .displayNotification(notification);

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

        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');

        // Create the channel
        firebase.notifications().android.createChannel(channel);

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log(JSON.stringify(message));
        });

        this.setState({status: "Notofications Initialized"})


        // /*
        // * Triggered when a particular notification has been received in foreground
        // * */
        //
        // this.notificationListener = firebase.notifications().onNotification((notification) => {
        //     // Process your notification as required
        //     notification
        //         .android.setChannelId('test-channel')
        //         .android.setSmallIcon('ic_launcher')
        //         .android.setPriority(firebase.notifications.Android.Priority.Max)
        //         .setSound('default');
        //     firebase.notifications()
        //         .displayNotification(notification);
        //
        //     const { title, body } = notification;
        //     this.showAlert(title, body);
        // });
        //
        // /*
        // * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        // * */
        // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        //     const { title, body } = notificationOpen.notification;
        //     this.showAlert(title, body);
        // });
        //
        // /*
        // * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        // * */
        // const notificationOpen = await firebase.notifications().getInitialNotification();
        // if (notificationOpen) {
        //     const { title, body } = notificationOpen.notification;
        //     this.showAlert(title, body);
        // }
        // /*
        // * Triggered for data only payload in foreground
        // * */
        // this.messageListener = firebase.messaging().onMessage((message) => {
        //     //process data message
        //     console.log(JSON.stringify(message));
        // });
        //
        // this.setState({status: "Notofications Initialized"})
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
