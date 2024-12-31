// Created by Pritish on 3/09/2020
// Custom UI compoment to create Capsule UI items
//Props 
/*
color : To set color
onClick : Method to excute on click of the item
*/
import React,{Component} from 'react';
import {TouchableOpacity,View,Text} from 'react-native';
//import DismissKeyboard from '../DismissKeyBoard';
export default class Capsule extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return(
<TouchableOpacity keyboardShouldPersistTaps='handled' onPress ={this.props.onClick} onLongPress={this.props.onLongClick} style={{backgroundColor : '#ffffff', alignSelf: 'baseline',borderRadius : 22,shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.10,
shadowRadius: 2.62,
marginHorizontal : 10,
marginVertical : 12,
elevation: 1}}>
<Text style={{color : "#0065d7",paddingHorizontal : 20, paddingVertical : 10, textAlign: 'center',fontSize : 18}}>{this.props.text}</Text>
</TouchableOpacity>
        )
    }
}

