import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert} from 'react-native';
import MyHeader from '../components/MyHeader'
import db from '../config'
import firebase from 'firebase'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class SettingScreen extends Component{
    constructor(){
        super();
        this.state={
            first_Name : '',
            last_Name  : '',
            emailId   : '',
            password  : '',
            docId     : '',
        }
    }

    getUserDetails=()=>{
        var email = firebase.auth().currentUser.email;
        db.collection('users').where('email_id','===',email).get()
        .then(snapshot => {
            var data=doc.data()
            this.setState({
                
                first_Name: data.first_name,
                last_Name: data.last_name,
                emailId: data.email_id,
                password: data.password,
                docId: doc.id,
            })
        })
    }
    
    updateUserDetails=()=>{
      if(this.state.first_Name !== "") {
        db.collection('users').doc(this.state.docId)
        .update({
            "first_name": this.state.first_Name
          })
      }
      if(this.state.last_Name !== ""){
        db.collection('users').doc(this.state.docId)
        .update({
            "last_name" : this.state.last_Name
          })
      }
      if(this.state.emailId !== ""){
        db.collection('users').doc(this.state.docId)
        .update({
          "emailId"   : this.state.emailId
          })
      }
      if(this.state.password !== ""){
        db.collection('users').doc(this.state.docId)
        .update({
          "password"   : this.state.password
          })
      }
      
        db.collection('users').doc(this.state.docId)
        .update({
            "first_name": this.state.first_Name,
            "last_name" : this.state.last_Name,
            "emailId"   : this.state.emailId,
            "password"  : this.state.password,
          })
          Alert.alert("Your Profile has been Updated.")
    }

    componentDidMount(){
        this.getUserDetails()
      }

    render() {
        return(
          <SafeAreaProvider>
            <View style={styles.container}>
                <MyHeader title="Settings" navigation={this.props.navigation}/>
                <View style={styles.formContainer}>
                <TextInput
              style={styles.formTextInput}
              placeholder ={"First Name (If you don't want to change it, leave it empty)"}
              autoCapitalize='none'
              onChangeText={(text)=>{
                this.setState({
                  first_Name: text
                })
              }}
              value ={this.state.firstName}
            />
             <TextInput
              style={styles.formTextInput}
              placeholder ={"Last Name (If you don't want to change it, leave it empty)"}
              autoCapitalize='none'
              onChangeText={(text)=>{
                this.setState({
                  last_Name: text
                })
              }}
                value ={this.state.last_Name}
            />
                         <TextInput
              style={styles.formTextInput}
              placeholder ={"Email (If you don't want to change it, leave it empty)"}
              autoCapitalize='none'
              keyboardType='email-address'
              onChangeText={(text)=>{
                this.setState({
                  emailId: text
                })
              }}
                value ={this.state.emailId}
            />
                         <TextInput
              style={styles.formTextInput}
              placeholder ={"New Password (If you don't want to change it, leave it empty)"}
              autoCapitalize='none'
              onChangeText={(text)=>{
                this.setState({
                  password: text
                })
              }}
                value ={this.state.password}
            />
            <TouchableOpacity style={styles.button}
              onPress={()=>{
                this.updateUserDetails()
              }}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
                </View>
            </View>
            </SafeAreaProvider>
        )
    }

}

const styles = StyleSheet.create({
    container : {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    formContainer:{
      flex:1,
      width:'100%',
      alignItems: 'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
    },
    buttonText:{
      fontSize:25,
      fontWeight:"bold",
      color:"#fff"
    }
  })