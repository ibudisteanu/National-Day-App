import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { FormValidationMessage} from 'react-native-elements';

import Layout from "./../layout";

export default class RankingsScreen extends React.Component {

  static navigationOptions = {
      headerTitle: 'Clasament',
      headerTintColor: '#ffe500',
      headerStyle: {
          backgroundColor: '#002d72'
      }
  };

  constructor(props) {

    super(props);
    this.state = {

        timeout: undefined,

        error: '',
        success: '',

        checkedServer: false,

        tableHead: ["Nr","Nume", "Corect", "Penalitati", "Scor"],
        tableData: [ ],
    };

  }

  render() {

    return (
        <Layout onNavigate={ ( page, params) => this.props.navigation.navigate(page, params) } >

            <View style={styles.container}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#dfe2e5'}}>
                  <Row
                      data={this.state.tableHead}
                      style={styles.head}
                      textStyle={styles.text}
                      flexArr={[7,23,10,15,10]}
                  />
                  {
                    this.state.tableData.map((rowData, index) => (
                        <Row
                            key={index}
                            data={rowData}
                            textStyle={styles.text}
                            style={ (index%2 === 0) ? '' : styles.rowColor }
                            flexArr={[7,23,10,15,10]}
                        />
                    ))
                  }

                </Table>
            </View>

            <FormValidationMessage>{this.state.error}</FormValidationMessage>

        </Layout>
    );
  }

  async componentDidMount(){
    this.downloadQuestionsInterval();
  }

   async downloadQuestions(){

        try{

            let answer = await fetch("http://webdollar-vps2.ddns.net:8084/ranking-top-100", {
                 method: 'GET',
            });

            answer = await answer.json();

            if (answer && answer.result){

                  answer = answer.message;

                  let tableData = [];
                  for (let i=0; i < answer.length; i++){

                    let row = [

                        i+1,
                        answer[i].name||'Anonim',
                        answer[i].questions,
                        answer[i].penality,
                        Math.floor(answer[i].score)

                    ];

                    tableData.push(row);

                  }

                  this.setState({
                    tableData: tableData,
                    checkedServer: true,
                    error: "",
                  });

            } else
               throw "Nu s-a putut conecta";

        } catch (error){

            this.setState({
                error: "Nu s-a putut conecta"
            })

        }

    }

   async downloadQuestionsInterval(){

        if (this.state.timeout !== undefined) return;

        await this.downloadQuestions();
        this.setState({

            timeout: setTimeout( this.downloadQuestionsInterval.bind(this), 10000 )

        });

    }

    componentWillUnmount(){

        if (this.state.timeout !== undefined){

            clearTimeout(this.state.timeout);

            this.setState({
                timeout: undefined,
            })

        }

    }


}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#d4d7da' },
  text: { margin: 5 },
    rowColor: { backgroundColor: '#f1f4f7' }
});