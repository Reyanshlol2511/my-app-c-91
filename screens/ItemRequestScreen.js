import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableHighlight
} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class ItemRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      reasonToRequest:"",
      IsitemRequestActive : "",
      requesteditemName: "",
      itemStatus:"",
      requestId:"",
      userDocId: '',
      docId :''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (itemName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_items').add({
        "user_id": userId,
        "item_name":itemName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "item_status" : "requested",
         "date"       : firebase.firestore.FieldValue.serverTimestamp()
    })

    await this.getitemRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsitemRequestActive: true
      })
    })
  })

    this.setState({
        itemName :'',
        reasonToRequest : '',
        requestId: randomRequestId
    })
    return Alert.alert("Item Requested Successfully")
  }

receiveditems=(itemName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_items').add({
      "user_id": userId,
      "item_name":itemName,
      "request_id"  : requestId,
      "itemStatus"  : "received",
  })
}

getIsitemRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsitemRequestActive:doc.data().IsitemRequestActive,
        userDocId : doc.id
      })
    })
  })
}

getitemRequest =()=>{

var itemRequest=  db.collection('requested_items')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().item_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requesteditemName: doc.data().item_name,
          itemStatus:doc.data().item_status,
          docId     : doc.id
        })
      }
    })
})}

sendNotification=()=>{

  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var itemName =  doc.data().item_name

          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the item " + itemName ,
            "notification_status" : "unread",
            "item_name" : itemName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getitemRequest()
  this.getIsitemRequestActive()
}

updateitemRequestStatus=()=>{
  db.collection('requested_items').doc(this.state.docId)
  .update({
    item_status : 'recieved'
  })

  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      db.collection('users').doc(doc.id).update({
        IsitemRequestActive: false
      })
    })
  })
}

  renderItem = ({item, i})=>{
    return(
      <TouchableHighlight style={{alignItems: 'center', backgroundColor: "#DDDDDD", padding: 10, width: '90%'}} 
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={()=>{
        this.setState({
          showFlatList: false,
          itemName: item.volumeInfo.title
        })
      }}
      bottomDivider
      >
        <Text>{item.volumeInfo.title}</Text>
      </TouchableHighlight>
    )
  }

  render(){
    if(this.state.IsitemRequestActive === true){
      return(
        <SafeAreaProvider>
        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>item Name</Text>
          <Text>{this.state.requesteditemName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> item Status </Text>

          <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateitemRequestStatus();
            this.receiveditems(this.state.requesteditemName)
          }}>
          <Text>I recieved the item </Text>
          </TouchableOpacity>
        </View>
        </SafeAreaProvider>
      )
    }
    else
    {
    return(
      <SafeAreaProvider>
        <View style={{flex:1}}>
          <MyHeader title="Request item" navigation ={this.props.navigation}/>
          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <FlatList data={this.state.dataSource} renderItem={this.renderItem} enableEmptySections={true} style={{marginTop: 10}}
              keyExtractor={(item, index)=>index.toString} />
              <TextInput
                style ={styles.formTextInput}
                placeholder={"Enter item name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Reason for Item Request"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.itemName,this.state.reasonToRequest);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
        </SafeAreaProvider>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  formTextInput: {
    width: "75%",
    height: 35,
    borderWidth: 1,
    padding: 10
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: 150,
    width: 150,
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: 10
  },
  bookstatus:{
    flex: 0.4,
    alignItems: "center"

  },
  requestedbookName:{
    fontSize: 30,
    fontWeight: "500",
    padding: 10,
    fontWeight: "bold",
    alignItems:'center',
    marginLeft:60
  },
  status:{
    fontSize: 20,
    marginTop: 30
  },
  bookStatus:{
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  buttontxt:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff"
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%"
  },
  requestbuttontxt:{
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  button: {
    width: "75%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16
  },
});