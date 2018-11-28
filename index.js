/** @format */

import {AppRegistry} from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation'


import HomeScreen from "./src/screens/home.screen.js"
import QuestionsScreen from "./src/screens/questions.screen.js"
import RankingsScreen from "./src/screens/rankings.screen.js"
import ProfileScreen from "./src/screens/profile.screen.js"

const AppNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Questions: {screen: QuestionsScreen},
  Rankings: {screen: RankingsScreen},
  Profile: {screen: ProfileScreen},
}, {
   initialRouteName: 'Home',
}
);

const AppContainer = createAppContainer(AppNavigator);

//import App from './src/App';

import {name as appName} from './app.json';

//AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent( appName, () => AppContainer);
