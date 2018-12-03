/** @format */

import {AppRegistry} from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation'

import bgMessaging from './src/bgMessaging'; // <-- Import the file you created in (2)

import HomeScreen from "./src/screens/home.screen.js"
import QuestionsScreen from "./src/screens/questions.screen.js"
import RankingsScreen from "./src/screens/rankings.screen.js"
import ProfileScreen from "./src/screens/profile.screen.js"

import {name as appName} from './app.json';


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

// Current main application
AppRegistry.registerComponent( appName, () => AppContainer);


// New task registration
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line
