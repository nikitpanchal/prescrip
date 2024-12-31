//Create by Pritish on 4/09/2020
//Custom Search bar for Medicine Selection
//Props
/*
TO BE ADDED
*/ 
import React,{Component} from 'react';
import {View,Text,Image,TextInput} from 'react-native';
import {NotoSans,NotoSans_BoldItalic,NotoSans_Italic,NotoSans_Bold} from '../../constants/font';
import {ic_blue_search} from '../../constants/images';
export default class SearchBar extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return(
            <View style={{padding: 20}}>
            <Text style={{fontFamily : NotoSans_Bold,fontSize : 20, color : '#0065d7',textAlign : 'left'}}>{"What is the "+this.props.dosage.currentView+" ?"  }</Text>
           
            </View>
        )
    }
}
