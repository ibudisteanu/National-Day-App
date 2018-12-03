import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Header} from 'react-native';
import { FormValidationMessage } from 'react-native-elements';

import Layout from "./../layout";
import Storage from "./../storage";


export default class QuestionsScreen extends React.Component {

  static navigationOptions = {
      headerTitle: 'Întrebări',
      headerTintColor: '#ffe500',
      headerStyle: {
          backgroundColor: '#002d72'
      }
  };

  constructor(props) {

    super(props);


     this.state = {

          lives: 3,

          timeout: undefined,

          error: '',
          success: '',

          checkedServer: false,

          questions: [],
          lastAnsweredQuestion: 0,

          question: null,

          errorStatus: "",
     }


  }

  async componentDidMount(){

      let questions = await Storage.getQuestions();

      this.setState({
        questions: questions,
      });

      let lastAnsweredQuestion = await Storage.getLastAnsweredQuestion();


    this.setState({

        lastAnsweredQuestion: lastAnsweredQuestion,

    });

    this.getNextQuestion();

    this.downloadQuestionsInterval()

  }


  render() {

    return (
        <Layout onNavigate={ ( page, params) => this.props.navigation.navigate(page, params) } >

          { this.state.question !== null ? this.renderQuestion() : this.renderNoQuestion() }

          <FormValidationMessage>{this.state.errorStatus}</FormValidationMessage>

        </Layout>
    );

  }

   renderQuestion(){
    return (
        <View>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    {this.state.question.title}
                    </Text>
            </View>

            <View style={styles.questionsContainer}>
                { this.state.question.answers[0] ? this.renderAnswer(0) : null }
                { this.state.question.answers[1] ? this.renderAnswer(1) : null }
                { this.state.question.answers[2] ? this.renderAnswer(2) : null }
                { this.state.question.answers[3] ? this.renderAnswer(3) : null }
            </View>

            <View style={styles.resultContainer}>
                { this.state.success==="" ? <Text style={styles.error}>{this.state.error}</Text> : <Text style={styles.success}>{this.state.success}</Text>}
            </View>

            <Text  style={styles.remaining}>
                Încercări rămase {this.state.lives}
            </Text>

        </View>
     );
   }

   renderNoQuestion(){

     return (
        <View style={styles.infoText}>

            {this.state.noMoreQuestions ? this.renderNoMoreQuestions() : this.renderQuestionsLoading() }

        </View>
     )

   }

   renderNoMoreQuestions(){
        return (
            <Text style={styles.infoText}>Nu mai sunt intrebari. Incearca mai tarziu!</Text>
        )
   }

   renderQuestionsLoading(){
        return (
            <Text style={styles.infoText}>Loading</Text>
        )
   }

   renderAnswer(answer){
       return(
           <Text style={styles.question} onPress={ () => this.handleAnswer(answer) }>{this.state.question.answers[answer]}</Text>
       )
   }

   async downloadQuestions(){

        try{

            let url = "http://webdollar-vps2.ddns.net:8084/new-questions/"+(this.state.lastAnsweredQuestion||'0');

            let answer = await fetch(url, {
                method: "GET"
            })


            answer = await answer.json();

            if (answer && answer.result){

                answer = answer.message;

                let newQuestions = this.state.questions;
                for (let i=0; i< answer.length; i++){

                    let ok = false;
                    for (let j=0; j < newQuestions.length; j++)

                        if (newQuestions[j]._id === answer[i]._id) {
                            newQuestions[j] = answer[i]
                            ok = true;
                            break;
                        }

                    if (!ok)
                        newQuestions.push( answer[i] );


                }

                this.setState({
                    questions: newQuestions,
                    checkedServer: true,
                })

                await Storage.setQuestions( this.state.questions );

                this.getNextQuestion();

            }


        } catch (exception){

            this.setState({
                errorStatus: "Nu se poate conecta la server",
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

    getNextQuestion(){

        let foundIndex = -1;
        for (let i = 0; i<this.state.questions.length; i++)
            if (this.state.questions[i]._id === this.state.lastAnsweredQuestion){

                foundIndex = i;
                break;

            }

        foundIndex++;
        if ( foundIndex < this.state.questions.length){
            this.newQuestion( this.state.questions[foundIndex] )
        }
        else {


             this.setState({
                question: null,
                noMoreQuestions: this.state.checkedServer ? true : false
             })

        }

    }

    newQuestion( question ){

        this.setState({
            error: "",
            success: "",
            question: question,
        })

    }

  async handleAnswer( answerOption ) {

      let url = "http://webdollar-vps2.ddns.net:8084/question-answer/"+await Storage.getDevice()+'/'+this.state.question._id+"/"+this.state.question.answers[answerOption];

      let answer = await fetch( url, {
        method: "GET",
      })

      answer = await answer.json();

      if (answer){

          if (answer.result && answer.message === "Correct"){

              this.setState({
                success: "Felicitari! Ai raspuns corect",
                error: "",
              })

              setTimeout( async ()=>{

                  this.setState({
                    lastAnsweredQuestion: this.state.question._id
                  });

                  await Storage.setLastAnsweredQuestion(this.state.lastAnsweredQuestion);
                  this.getNextQuestion()

              }, 4000 );

          } else if (answer.message === "Incorrect") {

              this.setState({
                success: "",
                error: "Raspuns Gresit!",
              })

          }


      } else {

          this.setState({
              success: "Nu s-a putut trimite raspuns. Verifica internetul",
              error: "",
           })

      }

  }


}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        color: '#19171c',
        alignSelf:'center',
        fontSize:20,
        padding:20,
        paddingTop:30,
        paddingBottom:30
    },
    titleContainer:{
        flex: 1,
        backgroundColor: '#dbdee1',
    },
    questionsContainer:{
        margin:10,
    },
    question:{
        padding:8,
        fontSize:16,
        backgroundColor:'#002d72',
        color:'#fff',
        margin:8,
        borderRadius: 5
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
    infoText:{
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20
    },
    remaining: {
        textAlign: 'center',
        
    }
});
