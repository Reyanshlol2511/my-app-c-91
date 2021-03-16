import React from 'react';
import {Text, Image, View, StyleSheet, TextInput, Alert, TouchableOpacity, Modal, KeyboardAvoidingView} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class WelcomeScreen extends React.Component {
    constructor() {
        super();
        this.state={
            first_Name: '',
            last_Name: '',
            emailID: '',
            password: '',
            isModalVisible: false,
        }
    }

    showModal=()=>{
        return(
          <Modal animationType="fade" transparent={true} visible={this.state.isModalVisible}>
            <View style={styles.modalContainer}>
              <ScrollView style={{width: '100%'}}>
                <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
                  <Text style={styles.modalTitle}>
                    Registration 
                  </Text>   
                  <TextInput style={styles.formTextInput} placeholder={"First Name"}
                  autoCapitalize='none'
                  onChangeText={(text)=>{
                    this.setState({
                      first_Name: text
                    })
                  }} />
                  <TextInput style={styles.formTextInput} placeholder={"Last Name"}
                  autoCapitalize='none'
                  onChangeText={(text)=>{
                    this.setState({
                      last_Name: text
                    })
                  }} />
                  <TextInput style={styles.formTextInput} placeholder={"Email ID"}
                  autoCapitalize='none'
                  keyBoardType={'email-address'} 
                  onChangeText={(text)=>{
                    this.setState({
                      emailID: text
                    })
                  }} />
  
                  <TextInput style={styles.formTextInput} placeholder={"Password"}
                  autoCapitalize='none'
                  secureTextEntry={true}
                  onChangeText={(text)=>{
                    this.setState({
                      password: text
                    })
                  }} />

                  <View style={styles.modalBackButton}>
                  <TouchableOpacity style={styles.registerButton} 
                  onPress={()=>this.userSignup(this.state.emailID, this.state.password)}>
                    <Text style={{color: 'yellow'}}>
                    Register
                    </Text>
                  </TouchableOpacity>
                  </View>
                  <View style={styles.modalBackButton}>
                    <TouchableOpacity style={styles.cancelButton} onPress={()=>this.setState({"isModalVisible": false})}>
                    <Text style={{color: 'yellow'}}>
                    Cancel
                    </Text>
                    </TouchableOpacity>
                  </View>
                  
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
          </Modal>
        )
      }
    
    userSignup=(emailID, password)=> {
        firebase.auth().createUserWithEmailAndPassword(emailID, password)
        .then((response)=>{
            return Alert.alert("User Signed Up Successfully")
        })
        .catch(function(error) {
            var errorCode=error.code;
            var errorMessage=error.message;
            return Alert.alert(errorMessage)
        })
  }

    userLogin=(emailID, password)=>{
        firebase.auth().signInWithEmailAndPassword(emailID, password)
        .then(()=>{
          Alert.alert("You have Signed In Successfully.");
          this.props.navigation.navigate("DonateItems");
        })
        .catch((error)=>{
            var errorCode=error.code;
            var errorMessage = error.message;
            return Alert.alert(errorMessage)
        })
    }

        render() {
            return(
              <SafeAreaProvider>
                <View style={styles.container}>                 
                {this.showModal()}
                <Text style={styles.title}>Item Santa</Text>
                    <View>
                    <TextInput style={styles.loginBox} placeholder="abc@example.com" keyboardType='email-address'
                    onChangeText={(text)=>{this.setState({
                        emailID: text
                    })}} />
                </View>
                <View>
                    <TextInput style={styles.loginBox} placeholder="Enter Password" secureTextEntry={true}
                    onChangeText={(text)=>{this.setState({
                        password: text
                    })}} />

                    <TouchableOpacity style={[styles.button,{marginBottom: 20, marginTop: 20}]}
                    onPress={()=>{this.userLogin(this.state.emailID, this.state.password)}}>
                    <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={styles.button}
                    onPress={()=>{this.userSignup(this.state.emailID, this.state.password)}}>
                    <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </SafeAreaProvider>
            )
        }
    
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'black'
    },
    profileContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    title: {
      fontSize: 65,
      fontWeight: "300",
      paddingBottom: 30,
      color: "#ff3d00"
    },
    loginBox: {
      width: 300,
      height: 40,
      borderBottomWidth: 1.5,
      borderColor: "#ff8a65",
      fontSize: 20,
      margin: 10,
      paddingLeft: 10,
      color: 'white'
    },
    KeyboardAvoidingView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    modalTitle: {
      justifyContent: "center",
      alignSelf: "center",
      fontSize: 30,
      color: "#ff5722",
      margin: 50
    },
    modalContainer: {
      flex: 1,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffff",
      marginRight: 30,
      marginLeft: 30,
      marginTop: 80,
      marginBottom: 80
    },
    formTextInput: {
      width: "75%",
      height: 35,
      alignSelf: "center",
      borderColor: "#ffab91",
      borderRadius: 10,
      borderWidth: 1,
      marginTop: 20,
      padding: 10,
    },
    registerButton: {
      width: 200,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
      marginTop: 30
    },
    registerButtonText: {
      color: "#ff5722",
      fontSize: 15,
      fontWeight: "bold"
    },
    cancelButton: {
      width: 200,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 5
    },
  
    button: {
      width: 300,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 25,
      backgroundColor: "#ff9800",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowOpacity: 0.3,
      shadowRadius: 10.32,
      elevation: 16,
      padding: 10
    },
    buttonText: {
      color: "#ffff",
      fontWeight: "200",
      fontSize: 20
    }
})