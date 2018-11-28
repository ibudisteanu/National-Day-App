import { AsyncStorage } from "react-native";

class Storage{

    constructor(){

    }

    async getName(){

        try{

            let answer = await AsyncStorage.getItem('name');
            if (answer !== null) return answer;
            else return '';

        } catch (err){
            return '';
        }


    }

    setName(data){

        return AsyncStorage.setItem( "name", data );
    }


    async getEmail(){

        try{

            let answer = await AsyncStorage.getItem('email');
            if (answer !== null) return answer;
            else return '';

        } catch (err){
            return '';
        }


    }

    setEmail(data){

        return AsyncStorage.setItem( "email", data );
    }


    async getDevice(){

        try{

            let uuid = await AsyncStorage.getItem('deviceUuid');

            if (uuid !== null) return uuid;
            else return await this._saveDevice();

        } catch (err){
            return await this.saveDevice();
        }
    }

    async saveDevice(){

        const hat = require('uuid');
        uuid = hat();

        await AsyncStorage.setItem( "deviceUuid", uuid);

        return uuid;

    }


    async getQuestions(){

        try{

            let answer = await AsyncStorage.getItem('localQuestions');

            if (answer !== null) return JSON.parse(answer);
            else return [];

        } catch (err){
            return [];
        }

    }

    async setQuestions(questions){
        return AsyncStorage.setItem( "localQuestions", JSON.stringify( questions ) );
    }



    async getLastAnsweredQuestion(){

        try{

            let answer = await AsyncStorage.getItem('lastAnsweredQuestion');

            if (answer !== null) return Number.parseInt(answer);
            else return 0;

        } catch (err){
            return 0;
        }

    }

    async setLastAnsweredQuestion(question){
        return AsyncStorage.setItem( "lastAnsweredQuestion", question.toString() );
    }



}

export default new Storage();