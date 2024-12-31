import React, { Component } from "react";

import LinearGradient from 'react-native-linear-gradient'
export default class GradientButton extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <LinearGradient colors={["#1b7cdb","#07cef2"]} start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }} locations={[0, 0.8]} style={{ width: '90%',height : 50,alignItems : 'center',justifyContent : 'center',marginBottom : 10,alignSelf: 'center',borderRadius:25}}>
            
            <Text style={{ textAlign: 'center',fontWeight:'bold', fontSize:20,color:'#ffffff' }} >SIGN UP</Text>
            </LinearGradient>
        )
    }
}