// In App.js in a new project

import * as React from 'react';
import {StyleSheet,Text,View,array,Alert,Button,TextInput,Icon,FlatList,Modal,ScrollView,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from 'react-native-paper';
import { LogBox } from 'react-native';
import { Fontisto,FontAwesome,MaterialIcons,Entypo,AntDesign } from '@expo/vector-icons'; 

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
class StartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          savDis:false,
          amount:0,
          discount:0,
          result:0,
          saved:0,
          error:"",
          changeState:this.changeState
        },
        this.savedVal=[]
      }
      refresh=(data)=> {
        this.savedVal = data;
      }
      componentDidMount(){
        this.props.navigation.setOptions({
          headerRight: () =>(<TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate("History",{arr:this.savedVal,onGoBack: this.refresh})
                            }}><View style={{marginRight:10}}><Fontisto name="history" size={24} color="#D9F1FF" /></View>
          </TouchableOpacity>)
      })
      }
    calculate=()=>{
      this.setState({savDis:false});
      if(this.state.amount>=0 && this.state.discount>=0 && this.state.discount<=100){
        if(this.state.discount==0){
          const n=(this.state.amount);
          this.setState({result:n.toFixed(2),saved:0})
        }
        else{
          const n=(this.state.amount*this.state.discount)/100;
          this.setState({result:(this.state.amount-n).toFixed(2),saved:(n).toFixed(2)})
        }
      
    }
    else{
      if(this.state.discount>100){
        this.setState({error:'Invalid Discount Percentage!',saved:0,result:0})
      }else{
        if(isNaN(this.state.amount )||isNaN(this.state.discount)){
          this.setState({saved:0,result:0});
          if(this.state.amount<0){
            this.setState({error:'Please type possitive numbers',saved:0,result:0})
          }else if(this.state.discount<0){
            this.setState({error:'Please type possitive numbers',saved:0,result:0})
          }
          else{
          this.setState({error:''})
        }}
        else{
        this.setState({error:'Please type possitive numbers',saved:0,result:0})
       }
    }
      
    }
    }
    save=()=>{
      if(!(isNaN(this.state.amount)||isNaN(this.state.discount))){
        if(!(this.state.amount===0 || this.state.discount===0)){
        const obj=this.savedVal.concat({
        originalP:this.state.amount,
        discountP:this.state.discount ,
        FinalP:this.state.result,
        id:(Math.random())
      });
      this.savedVal=obj;
      this.setState({savDis:true})}}
      
    }
    render(){
      return(
      <ScrollView><View style={styles.container}>
        <Text style={styles.Head}>DISCOUNT CALCULATOR</Text>
        <TextInput 
        style={styles.input}
        keyboardType = 'numeric'
        placeholder="Price"
        onChangeText={(val)=> {
            this.setState({amount:parseInt(val),error:""},()=>this.calculate());
          
          
        }}/>
        <TextInput 
        style={styles.input}
        keyboardType = 'numeric'
        placeholder="Discount"
        onChangeText={(val)=>{
          this.setState({discount:parseInt(val),error:""},() =>this.calculate());
        }}
        />
        <View>
        <Text style={{alignSelf:"center",color:"red"}}>{this.state.error}</Text>
        </View>
        <Text style={styles.saved}>Saved:{this.state.saved}</Text>
      <Text style={styles.result}>Final Price:{this.state.result}</Text>
          <TouchableOpacity disabled={this.state.savDis} style={styles.heart} onPress={this.save}
      ><AntDesign name="heart" size={40} color={this.state.savDis?"red":"#1F9DE7"} /></TouchableOpacity>
      </View>
      </ScrollView>
      );
    }
}
class HistoryScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      array:this.props.route.params.arr
    }
    
  }
  deleteItem=(e)=>{
    console.log(e);
    this.setState({array:this.state.array.filter((val)=>val.id!=e)});
  }
  componentDidMount(){
    this.props.navigation.setOptions({
      headerLeft:null,
      headerLeft: () =>(<TouchableOpacity
                      onPress={() => {
                        this.props.route.params.onGoBack(this.state.array);
                        this.props.navigation.navigate("Start");
                        
                      }
                      }><MaterialIcons name="arrow-back" size={28} color="#D9F1FF" />
      </TouchableOpacity>),
      headerRight: () =>(<TouchableOpacity  onPress={()=>{this.setState({array:[]})}
    }
    ><View style={{marginRight:10}}><FontAwesome name="trash-o" size={30} color="#D9F1FF" /></View></TouchableOpacity>)  
  })

  }
  render(){
    const data=<View style={{width:"100%"}}>
      <View >
    <DataTable>
      <DataTable.Header >
        <DataTable.Title ><Text style={styles.tableHead}>Price </Text></DataTable.Title>
        <DataTable.Title ><Text style={styles.tableHead}>Discount</Text></DataTable.Title>
        <DataTable.Title style={styles.tableRow}><Text style={styles.tableHead}>Final Price</Text></DataTable.Title>
        <DataTable.Title style={styles.tableRow}></DataTable.Title>
        
      </DataTable.Header>
        {this.state.array.map((val)=>(
      <DataTable.Row key={val.id}>
        <DataTable.Cell ><Text style={{fontSize:13}}>{val.originalP}</Text></DataTable.Cell>
        <DataTable.Cell ><Text style={{fontSize:13}}>{val.discountP}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableRow}><Text style={{fontSize:13}}>{val.FinalP}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.tableRow}><View>
        <Entypo name="circle-with-cross" size={28} color="#1F9DE7" onPress={this.deleteItem.bind(this,val.id)} /></View></DataTable.Cell>
      </DataTable.Row>
      ))}
    </DataTable>
</View></View>;
   const empty=<View><Text style={styles.emptyH}>No data to Show!</Text></View>;
  return (
    <View style={styles.containerH}>
      {this.state.array.length===0?empty:data}
    </View>
  );
}
}
const Stack = createStackNavigator();
class App extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <NavigationContainer >
        <Stack.Navigator  initialRouteName={"Start"}>
          <Stack.Screen 
          name="Start" 
          component={StartScreen}
          options={{
            headerStyle: {
              backgroundColor: '#1F9DE7',
            },
            headerTintColor: '#D9F1FF',
            headerTitleStyle: {
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize:25,
              marginLeft:40
            },
            
          }}
          />
          <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{
            headerStyle: {
              backgroundColor: '#1F9DE7',
            },
            headerTintColor: '#D9F1FF',
            headerTitleStyle: {
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize:25,
            },
            
          }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container:{
    paddingTop:'30%',
    height:780,
    backgroundColor:"#D9F1FF",
    paddingBottom:30
  },
  containerH:{
    paddingTop:'5%',
    height:780,
    backgroundColor:"#D9F1FF",
    paddingBottom:30
  },
  emptyH:{
    textAlign:"center",fontSize:16,fontWeight:'bold',color:'#1F9DE7',paddingTop:'80%'
  },
  Head:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'bold',
    color:'#1F9DE7'
  },
  tableHead:{
    textAlign:'center',
    fontSize:16,
    fontWeight:'bold',
    color:'#1F9DE7',
  },
  tableRow:{
    paddingLeft:10
  },
  input:{
    borderColor:"#1F9DE7",
    borderWidth:1,
    width:'80%',
    alignSelf:"center",
    margin:10,
    padding:4,
    borderRadius:10,
  },
  heart:{
    alignSelf:"center",
    margin:10,
    padding:4,
  },
  saved:{
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    color:'#1F9DE7'
  },
  result:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'bold',
    color:'#1F9DE7'
  }
});